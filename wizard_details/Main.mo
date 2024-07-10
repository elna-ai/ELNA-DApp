import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

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
} "./Utils";

actor class Main(initlaArgs : Types.InitalArgs) {
  private stable var _wizardsNew : [Types.WizardDetails] = [];
  private stable var _wizardsV2 : [Types.WizardDetailsWithTimeStamp] = [];
  private stable var _analytics : [(Text, Types.Analytics)] = [];
  private stable var owner : Principal = initlaArgs.owner;
  private stable var _userManagementCanisterId : Principal = initlaArgs.userManagementCanisterId;
  var wizards = Buffer.Buffer<Types.WizardDetails>(10);
  var wizardsV2 = Buffer.Buffer<Types.WizardDetailsWithTimeStamp>(10);
  var analytics = HashMap.HashMap<Text, Types.Analytics>(5, Text.equal, Text.hash);

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
  };

  // TODO: better way to do and maintin this?
  let UserManagementCanister = actor (Principal.toText(_userManagementCanisterId)) : actor {
    isPrincipalAdmin : (Principal) -> async (Bool);
    isUserWhitelisted : (?Principal) -> async (Bool);
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

  public query func getWizards() : async [Types.WizardDetailsBasicWithTimeStamp] {

    let publicWizards = Array.filter(
      Buffer.toArray(wizardsV2),
      func(wizard : Types.WizardDetailsWithTimeStamp) : Bool {
        wizard.visibility == #publicVisibility and wizard.isPublished;
      },
    );

    getWizardsBasicDetails(publicWizards);
  };

  // TODO: should use caller to get current User
  public query func getUserWizards(userId : Text) : async [Types.WizardDetailsBasicWithTimeStamp] {
    let userWizards = getWizardsByUser(wizardsV2, userId);

    getWizardsBasicDetails(userWizards);
  };

  public query func getWizard(id : Text) : async ?Types.WizardDetails {
    findWizardById(id, wizardsV2);
  };

  public shared query (message) func isWizardNameValid(wizardName : Text) : async Bool {
    isWizardNameTakenByUser(wizardsV2, Principal.toText(message.caller), wizardName);
  };

  public shared (message) func addWizard(wizard : Types.WizardDetails) : async Types.Response {
    let isUserWhitelisted = await UserManagementCanister.isUserWhitelisted(?message.caller);

    if (not isUserWhitelisted) {
      return { status = 422; message = "User dosen't have permission" };
    };

    let isNewWizardName = isWizardNameTakenByUser(wizardsV2, Principal.toText(message.caller), wizard.name);

    if (isNewWizardName) {
      wizardsV2.add(addTimeStamp(wizard));
      return { status = 200; message = "Created wizard" };
    } else {
      return { status = 422; message = "Wizard named already exist" };
    };
  };

  public shared (message) func deleteWizard(wizardId : Text) : async Types.Response {

    switch (findWizardById(wizardId, wizardsV2)) {
      case null { return { status = 422; message = "Wizard does not exist" } };
      case (?wizard) {
        let canUserDelete = isOwner(message.caller) or isUserBotCreator(message.caller, wizard);

        if (not canUserDelete) {
          return {
            status = 403;
            message = "Wizard does not belong to user";
          };
        };
        switch (findWizardIndex(wizard, wizardsV2)) {
          case null {
            return { status = 422; message = "Wizard does not exist" };
          };
          case (?index) {
            ignore wizardsV2.remove(index);
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
      wizards = wizardsV2;
      isPublish = true;
    });
  };

  public shared ({ caller }) func unpublishWizard(wizardId : Text) : async Types.Response {
    publishUnpublishWizard({
      caller;
      wizardId;
      wizards = wizardsV2;
      isPublish = false;
    });
  };

  public shared ({ caller }) func getAllWizards() : async [Types.WizardDetails] {
    let isUserAdmin = await UserManagementCanister.isPrincipalAdmin(caller);
    switch (isUserAdmin) {
      case false {
        throw Error.reject("User is not admin");
      };
      case true {
        Buffer.toArray(wizardsV2);
      };
    };
  };

  public shared ({ caller }) func updateWizard(wizardId : Text, wizardDetails : Types.WizardUpdateDetails) : async Text {
    let wizard = findWizardById(wizardId, wizardsV2);
    switch (wizard) {
      case null {
        throw Error.reject("Agent not found");
      };
      case (?wizard) {
        if (Principal.toText(caller) != wizard.userId) {
          throw Error.reject("User dose not have permission to edit agent");
        };
        let wizardId = findWizardIndex(wizard, wizardsV2);
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
              updatedAt = Time.now();
            };
            wizardsV2.put(index, updatedWizardDetails);
            return "Agent updated";
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
    let wizardWithTime = Array.map(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetails) : Types.WizardDetailsWithTimeStamp {
        addTimeStamp(wizard);
      },
    );
    if (wizardsV2.size() > 0) {
      _wizardsV2 := Buffer.toArray(wizardsV2);
    } else {
      _wizardsV2 := wizardWithTime;
    };
    _analytics := Iter.toArray(analytics.entries());
  };

  system func postupgrade() {
    wizards := Buffer.fromArray(_wizardsNew);
    wizardsV2 := Buffer.fromArray(_wizardsV2);
    analytics := HashMap.fromIter<Text, Types.Analytics>(_analytics.vals(), 5, Text.equal, Text.hash);
  };
};
