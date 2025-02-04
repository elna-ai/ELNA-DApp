import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Int "mo:base/Int";

import Types "./Types";
import {
  getWizardsByUser;
  isWizardNameTakenByUser;
  getWizardsBasicDetails;
  isUserBotCreator;
  publishUnpublishWizard;
  findWizardById;
  findWizardIndex;
  addTimeStamp;
  getWizardsWithCreator;
} "./Utils";

actor class Main(initlaArgs : Types.InitalArgs) {
  private stable var _wizardsNew : [Types.WizardDetails] = [];
  private stable var _wizardsV2 : [Types.WizardDetailsWithTimeStamp] = [];
  private stable var _wizardsV3 : [Types.WizardDetailsWithTimeV3] = [];
  private stable var _analytics : [(Text, Types.Analytics)] = [];
  private stable var owner : Principal = initlaArgs.owner;
  private stable var _userManagementCanisterId : Principal = initlaArgs.userManagementCanisterId;
  private stable var launchpadOwner : Principal = initlaArgs.owner;
  var wizards = Buffer.Buffer<Types.WizardDetails>(10);
  var wizardsV2 = Buffer.Buffer<Types.WizardDetailsWithTimeStamp>(10);
  var wizardsV3 = Buffer.Buffer<Types.WizardDetailsWithTimeV3>(10);
  var analytics = HashMap.HashMap<Text, Types.Analytics>(5, Text.equal, Text.hash);

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
  };

  // TODO: better way to do and maintin this?
  let UserManagementCanister = actor (Principal.toText(_userManagementCanisterId)) : actor {
    isPrincipalAdmin : (Principal) -> async (Bool);
    getUserProfile : (Principal) -> async (Types.UserProfile);
    getAllUserProfiles : () -> async [(Principal, Types.UserProfile)];
  };

  public query func getAnalytics(wizardId : Text) : async Types.Analytics_V1 {
    switch (analytics.get(wizardId)) {
      case null {
        throw Error.reject("wizard id not found");
      };
      case (?anlyticsVarints) {
        switch (anlyticsVarints) {
          case (#v1(data)) {
            return data;
          };
        };
      };
    };
  };

  public func updateMessageAnalytics(wizardId : Text) : async () {
    switch (analytics.get(wizardId)) {
      case (?value) {
        switch (value) {
          case (#v1(data)) {
            analytics.put(
              wizardId,
              #v1 {
                messagesReplied = data.messagesReplied + 1;
              },
            );
          };
        };
      };

      case (null) {
        analytics.put(wizardId, #v1 { messagesReplied = 1 });
      };
    };
  };

  public func getWizards() : async [Types.WizardDetailsBasicWithCreatorName] {

    let publicWizards = Array.filter(
      Buffer.toArray(wizardsV3),
      func(wizard : Types.WizardDetailsWithTimeV3) : Bool {
        wizard.visibility == #publicVisibility and wizard.isPublished;
      },
    );
    let userProfilesArray = await UserManagementCanister.getAllUserProfiles();
    let wizardsWithCreatorNames = getWizardsWithCreator(publicWizards, userProfilesArray);

    getWizardsBasicDetails(wizardsWithCreatorNames);
  };

  // TODO: should use caller to get current User
  public func getUserWizards(userId : Text) : async [Types.WizardDetailsBasicWithCreatorName] {
    let userWizards = getWizardsByUser(wizardsV3, userId);
    let userProfilesArray = await UserManagementCanister.getAllUserProfiles();
    let wizardsWithCreatorNames = getWizardsWithCreator(userWizards, userProfilesArray);

    getWizardsBasicDetails(wizardsWithCreatorNames);
  };

  public query func getWizard(id : Text) : async ?Types.WizardDetails {
    findWizardById(id, wizardsV3);
  };

  public shared query (message) func isWizardNameValid(wizardName : Text) : async Bool {
    isWizardNameTakenByUser(wizardsV3, Principal.toText(message.caller), wizardName);
  };

  public shared ({ caller }) func addWizard(wizard : Types.WizardDetails) : async Types.Response {
    // Throws profile not found error if profile is not complete
    let _userProfile = await UserManagementCanister.getUserProfile(caller);
    let isNewWizardName = isWizardNameTakenByUser(wizardsV3, Principal.toText(caller), wizard.name);

    if (isNewWizardName) {
      wizardsV3.add(addTimeStamp({ wizard with poolAddress = null; tokenAddress = null }));
      return { status = 200; message = "Created wizard" };
    } else {
      return { status = 422; message = "Wizard named already exist" };
    };
  };

  public shared ({ caller }) func updateLaunchpadOwner(principal : Principal) : async Text {
    if (not isOwner(caller)) {
      throw Error.reject("User not authorized");
    };
    launchpadOwner := principal;
    return "Updated launchpad owner";

  };

  // TODO:remove
  public query func getLaunchpadOwner() : async Text {
    Debug.print("In get launchpad owner");
    return Principal.toText(launchpadOwner);
  };

  public shared ({ caller }) func addWizardLaunchpad(wizard : Types.WizardDetailsV3) : async Text {
    if (not (caller == launchpadOwner)) {
      throw Error.reject("User not authorized");
    };
    // todo avatar update from here
    wizardsV3.add(addTimeStamp(wizard));
    return "Created agent";

  };

  public shared ({ caller }) func updateWizardLaunchpad(wizardId : Text, wizardDetails : Types.WizardUpdateDetails and { userId : Text }) : async Text {
    if (not (caller == launchpadOwner)) {
      throw Error.reject("User not authorized");
    };

    let wizard = findWizardById(wizardId, wizardsV3);
    switch (wizard) {
      case null {
        throw Error.reject("Agent not found");
      };
      case (?wizard) {
        if (wizardDetails.userId != wizard.userId) {
          throw Error.reject("User dose not have permission to edit agent");
        };
        let wizardId = findWizardIndex(wizard, wizardsV3);
        switch (wizardId) {
          case null {
            throw Error.reject("Agent not found");
          };
          case (?index) {
            let updatedWizardDetails = {
              name = wizardDetails.name;
              biography = wizardDetails.biography;
              description = wizardDetails.description;
              avatar = wizardDetails.avatar;
              greeting = wizardDetails.greeting;
              visibility = wizardDetails.visibility;
              id = wizard.id;
              userId = wizard.userId;
              isPublished = wizard.isPublished;
              summary = wizard.summary;
              createdAt = wizard.createdAt;
              tokenAddress = wizard.tokenAddress;
              poolAddress = wizard.poolAddress;
              updatedAt = Time.now();
            };
            wizardsV3.put(index, updatedWizardDetails);
            return "Agent updated";
          };
        };
      };
    };
  };

  // TODO: remove
  public query func getV31() : async [Types.WizardDetailsWithTimeV3] {
    return Buffer.toArray(wizardsV3);
  };

  // TODO: remove
  public query func getV2() : async [Types.WizardDetailsWithTimeStamp] {
    return Buffer.toArray(wizardsV2);
  };

  public shared (message) func deleteWizard(wizardId : Text) : async Types.Response {

    switch (findWizardById(wizardId, wizardsV3)) {
      case null { return { status = 422; message = "Wizard does not exist" } };
      case (?wizard) {
        let canUserDelete = isOwner(message.caller) or isUserBotCreator(message.caller, wizard);

        if (not canUserDelete) {
          return {
            status = 403;
            message = "Wizard does not belong to user";
          };
        };
        switch (findWizardIndex(wizard, wizardsV3)) {
          case null {
            return { status = 422; message = "Wizard does not exist" };
          };
          case (?index) {
            ignore wizardsV3.remove(index);
            ignore analytics.remove(wizardId);
            return { status = 200; message = "Wizard deleted" };
          };
        };

      };
    };
  };

  public shared ({ caller }) func publishWizard(wizardId : Text) : async Types.Response {
    publishUnpublishWizard({
      caller;
      wizardId;
      wizards = wizardsV3;
      isPublish = true;
    });
  };

  public shared ({ caller }) func unpublishWizard(wizardId : Text) : async Types.Response {
    publishUnpublishWizard({
      caller;
      wizardId;
      wizards = wizardsV3;
      isPublish = false;
    });
  };

  public shared ({ caller }) func getAllWizards() : async [Types.WizardDetailsWithTimeStamp] {
    let isUserAdmin = await UserManagementCanister.isPrincipalAdmin(caller);
    switch (isUserAdmin) {
      case false {
        throw Error.reject("User is not admin");
      };
      case true {
        Buffer.toArray(wizardsV3);
      };
    };
  };

  public shared ({ caller }) func updateWizard(wizardId : Text, wizardDetails : Types.WizardUpdateDetails) : async Text {
    let wizard = findWizardById(wizardId, wizardsV3);
    switch (wizard) {
      case null {
        throw Error.reject("Agent not found");
      };
      case (?wizard) {
        if (Principal.toText(caller) != wizard.userId) {
          throw Error.reject("User dose not have permission to edit agent");
        };
        let wizardId = findWizardIndex(wizard, wizardsV3);
        switch (wizardId) {
          case null {
            throw Error.reject("Agent not found");
          };
          case (?index) {
            let updatedWizardDetails = {
              name = wizardDetails.name;
              biography = wizardDetails.biography;
              description = wizardDetails.description;
              avatar = wizardDetails.avatar;
              greeting = wizardDetails.greeting;
              visibility = wizardDetails.visibility;
              id = wizard.id;
              userId = wizard.userId;
              isPublished = wizard.isPublished;
              summary = wizard.summary;
              createdAt = wizard.createdAt;
              tokenAddress = wizard.tokenAddress;
              poolAddress = wizard.poolAddress;
              updatedAt = Time.now();
            };
            wizardsV3.put(index, updatedWizardDetails);
            return "Agent updated";
          };
        };
      };
    };
  };

  // For migration only to be deleted after
  public shared ({ caller }) func updateWizardAdmin(wizardId : Text, newImageId : Text) : async Text {
    if (not isOwner(caller)) {
      throw Error.reject("Not admin");
    };

    let wizard = findWizardById(wizardId, wizardsV3);
    switch (wizard) {
      case null {
        throw Error.reject("Agent not found");
      };
      case (?wizard) {
        let wizardId = findWizardIndex(wizard, wizardsV3);
        switch (wizardId) {
          case null {
            throw Error.reject("Agent not found");
          };
          case (?index) {
            let updatedWizardDetails = {
              avatar = newImageId;
              name = wizard.name;
              biography = wizard.biography;
              description = wizard.description;
              greeting = wizard.greeting;
              visibility = wizard.visibility;
              id = wizard.id;
              userId = wizard.userId;
              isPublished = wizard.isPublished;
              summary = wizard.summary;
              createdAt = wizard.createdAt;
              updatedAt = wizard.updatedAt;
            };
            wizardsV2.put(index, updatedWizardDetails);
            return "Agent avatar updated";
          };
        };
      };
    };
  };

  public query func getAllAnalytics() : async [(Text, Types.Analytics)] {
    Iter.toArray(analytics.entries());
  };

  system func preupgrade() {

    _wizardsNew := Buffer.toArray(wizards);

    Debug.print("START pre_upgrade: " # Int.toText(Time.now()));
    // if (wizardsV2.size() > 0) {
    //   _wizardsV2 := Buffer.toArray(wizardsV2);
    // } else {
    //   _wizardsV2 := wizardWithTime;
    // };
    _wizardsV2 := Buffer.toArray(wizardsV2);
    _wizardsV3 := Buffer.toArray(wizardsV3);
    _analytics := Iter.toArray(analytics.entries());
    Debug.print("END pre_upgrade");
    Debug.print("\n\n");
  };

  system func postupgrade() {
    let wizardsWithV3Data = Array.map(
      _wizardsV2,
      func(wizard : Types.WizardDetailsWithTimeStamp) : Types.WizardDetailsWithTimeV3 {
        return { wizard with poolAddress = null; tokenAddress = null };
      },
    );

    Debug.print("Start post_upgrade: " # Int.toText(Time.now()));
    Debug.print("wizardsV3 size: " # debug_show wizardsV3.size() # "_wizardsV3 size:" # debug_show _wizardsV3.size());
    Debug.print(debug_show wizardsWithV3Data);

    if (_wizardsV3.size() > 0) {
      Debug.print("used existing data");
      wizardsV3 := Buffer.fromArray(_wizardsV3);
    } else {
      Debug.print("migrated data from _wizardsV2");
      wizardsV3 := Buffer.fromArray(wizardsWithV3Data);
    };
    Debug.print("\n END post_upgrade");

    wizards := Buffer.fromArray(_wizardsNew);
    wizardsV2 := Buffer.fromArray(_wizardsV2);
    // wizardsV3 := Buffer.fromArray(_wizardsV3);
    analytics := HashMap.fromIter<Text, Types.Analytics>(_analytics.vals(), 5, Text.equal, Text.hash);
  };
};
