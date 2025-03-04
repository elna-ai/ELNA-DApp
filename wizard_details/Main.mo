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
import Result "mo:base/Result";
import Option "mo:base/Option";

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
  visibilityToText;
} "./Utils";
import AnalyticsUtils "AnalyticsUtils";
import ElnaImages "external_canisters/ElnaImagesBackend";
import CapCanisterType "external_canisters/cap_backend";

actor class Main(initialArgs : Types.InitialArgs) {
  private stable var _wizardsNew : [Types.WizardDetails] = [];
  private stable var _wizardsV2 : [Types.WizardDetailsWithTimeStamp] = [];
  private stable var _wizardsV3 : [Types.WizardDetailsWithTimeV3] = [];
  private stable var _analytics : [(Text, Types.Analytics)] = [];

  // Initial args
  private stable var owner : Principal = initialArgs.owner;
  private stable var _userManagementCanisterId : Principal = initialArgs.userManagementCanisterId;
  private stable var _elnaImagesCanisterId : Principal = initialArgs.elnaImagesCanisterId;
  private stable var _capCanisterId : Principal = initialArgs.capCanisterId;
  private stable var _ragCanisterId : Principal = initialArgs.ragCanisterId;
  private stable var launchpadOwner : Principal = initialArgs.owner;

  // unstable memory
  var wizards = Buffer.Buffer<Types.WizardDetails>(10);
  var wizardsV2 = Buffer.Buffer<Types.WizardDetailsWithTimeStamp>(10);
  var wizardsV3 = Buffer.Buffer<Types.WizardDetailsWithTimeV3>(10);
  var analytics = HashMap.HashMap<Text, Types.Analytics>(5, Text.equal, Text.hash);

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
  };

  // TODO: better way to do and maintain this?
  let UserManagementCanister = actor (Principal.toText(_userManagementCanisterId)) : actor {
    isPrincipalAdmin : (Principal) -> async (Bool);
    getUserProfile : (Principal) -> async (Types.UserProfile);
    getAllUserProfiles : () -> async [(Principal, Types.UserProfile)];
  };
  // TODO: find a way to directly use the generated .mo file instead of defining custom actor
  let ElnaImagesCanister = actor (Principal.toText(_elnaImagesCanisterId)) : actor {
    add_asset : shared (ElnaImages.Asset, ?Text) -> async ElnaImages.Result;
  };
  let CapCanister : CapCanisterType.Log = actor (Principal.toText(_capCanisterId));

  public query func getAnalytics(wizardId : Text) : async Types.Analytics_V2_External {
    switch (analytics.get(wizardId)) {
      case null {
        throw Error.reject("wizard id not found");
      };
      case (?analyticsVariants) {
        switch (analyticsVariants) {
          case (#v2(data)) {
            return {
              messagesReplied = data.messagesReplied;
              uniqueUsers = data.uniqueUsers.size();
              modificationCount = data.modificationCount;
            };
          };
          case (#v1(data)) {
            return {
              messagesReplied = data.messagesReplied;
              uniqueUsers = 0;
              modificationCount = 0;
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateMessageAnalytics(wizardId : Text) : async () {
    switch (analytics.get(wizardId)) {
      case (?value) {
        switch (value) {
          case (#v2(data)) {
            switch (
              Array.find(
                data.uniqueUsers,
                func(user : Principal) : Bool {
                  user == caller;
                },
              )
            ) {
              case (?_) {
                analytics.put(
                  wizardId,
                  #v2 {
                    messagesReplied = data.messagesReplied + 1;
                    uniqueUsers = data.uniqueUsers;
                    modificationCount = data.modificationCount;
                  },
                );
              };
              case (null) {
                let users : Buffer.Buffer<Principal> = Buffer.fromArray(data.uniqueUsers);
                users.add(caller);
                analytics.put(
                  wizardId,
                  #v2 {
                    messagesReplied = data.messagesReplied + 1;
                    uniqueUsers = Buffer.toArray(users);
                    modificationCount = data.modificationCount;
                  },
                );
              };
            };

          };
          // TODO: can we removed later?
          case (#v1(data)) {
            analytics.put(
              wizardId,
              #v2 {
                messagesReplied = data.messagesReplied + 1;
                uniqueUsers = [caller];
                modificationCount = 0;
              },
            );
          };
        };
      };

      case (null) {
        analytics.put(wizardId, #v2 { messagesReplied = 1; uniqueUsers = [caller]; modificationCount = 0 });
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

  public query func getWizard(id : Text) : async ?Types.WizardDetailsV3 {
    findWizardById(id, wizardsV3);
  };

  public shared query (message) func isWizardNameValid(wizardName : Text) : async Bool {
    isWizardNameTakenByUser(wizardsV3, Principal.toText(message.caller), wizardName);
  };

  public shared ({ caller }) func addWizard(wizard : Types.WizardDetails) : async Types.Response {
    // Throws profile not found error if profile is not complete
    let _userProfile = await UserManagementCanister.getUserProfile(caller);
    let isNewWizardName = isWizardNameTakenByUser(wizardsV3, Principal.toText(caller), wizard.name);

    let doesWizardIdExist = findWizardById(wizard.id, wizardsV3);

    switch (doesWizardIdExist) {
      case (?_) {
        return { status = 422; message = "Agent id exist" };
      };
      case (null) {
        if (isNewWizardName) {
          if (wizard.name.size() < 1) {
            return { status = 422; message = "Agent name is too short" };
          };
          if (wizard.biography.size() < 30) {
            return { status = 422; message = "Agent biography is too short" };
          };
          if (wizard.greeting.size() < 20) {
            return { status = 422; message = "Agent greeting is too short" };
          };

          wizardsV3.add(addTimeStamp({ wizard with poolAddress = null; tokenAddress = null }));
          ignore CapCanister.addRecord(
            caller,
            "create_agent",
            [
              ("agentId", #Text(wizard.id)),
              ("createdBy", #Text(wizard.userId)),
            ],
          );
          return { status = 200; message = "Created wizard" };
        } else {
          return { status = 422; message = "Wizard named already exist" };
        };
      };
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

  // TODO: remove
  public query func getElnaBackendUri() : async Text {
    Principal.toText(_elnaImagesCanisterId);
  };

  public shared ({ caller }) func addWizardLaunchpad(wizard : Types.WizardDetailsV3) : async Result.Result<Text, Types.Error> {
    if (not (caller == launchpadOwner)) {
      Debug.print("fn:addWizardLaunchpad,err:Not launchpad owner. caller: " # debug_show caller # ". owner: " # debug_show launchpadOwner);
      return #err(#UserNotAuthorized);
    };

    let doesWizardIdExist = findWizardById(wizard.id, wizardsV3);
    switch (doesWizardIdExist) {
      case (?_) {
        return #err(#AgentIdExist);
      };
      case (null) {};
    };

    let avatar = {
      asset = wizard.avatar;
      owner = caller;
      file_name = "image";
    };
    try {
      let a = await ElnaImagesCanister.add_asset(avatar, null);
      // TODO: IMAGE CANISTER CHECK OWNER DISABLED IN STAGING RN
      switch (a) {
        case (#Ok(avatarId)) {
          wizardsV3.add(addTimeStamp({ wizard with avatar = avatarId }));
          let user = Principal.fromText(wizard.userId);
          ignore CapCanister.addRecord(
            user,
            "create_token_agent",
            [
              ("agentId", #Text(wizard.id)),
              ("createdBy", #Text(wizard.userId)),
            ],
          );
          return #ok("Created agent");
        };
        case (#Err(err)) {
          Debug.print("ERR: addWizardLaunchpad. unable to upload image Asset: " # debug_show (avatar) # "err: " # debug_show err);
          return #err(#UnableToUploadAvatar);
        };
      };
    } catch _ {
      Debug.print("Image catch");
      return #err(#UnableToUploadAvatar);

    }

  };

  public shared ({ caller }) func updateWizardLaunchpad(wizardId : Text, wizardDetails : { tokenAddress : ?Text; poolAddress : ?Text; agentId : Text; userId : Text }) : async Result.Result<Text, Types.Error> {
    if (not (caller == launchpadOwner)) {
      return #err(#UserNotAuthorized);
    };

    let wizard = findWizardById(wizardId, wizardsV3);
    switch (wizard) {
      case null {
        return #err(#AgentNotFound);
      };
      case (?wizard) {
        if (wizardDetails.userId != wizard.userId) {
          return #err(#PrincipalIdMissMatch);
        };
        let wizardId = findWizardIndex(wizard, wizardsV3);
        switch (wizardId) {
          case null {
            return #err(#AgentNotFound);
          };

          case (?index) {
            let updatedWizardDetails = {
              wizard with
              tokenAddress = if (Option.isNull(wizardDetails.tokenAddress)) {
                wizard.tokenAddress;
              } else { wizardDetails.tokenAddress };
              poolAddress = if (Option.isNull(wizardDetails.poolAddress)) {
                wizard.poolAddress;
              } else { wizardDetails.poolAddress };
              updatedAt = Time.now();
            };
            wizardsV3.put(index, updatedWizardDetails);
            let logDetails = Buffer.Buffer<(Text, CapCanisterType.DetailValue)>(3);
            logDetails.add(("agentId", #Text(wizard.id)));
            switch (wizardDetails.tokenAddress) {
              case (?tokenAddress) {
                logDetails.add(("tokenAddress", #Text(tokenAddress)));
              };
              case null {};
            };

            switch (wizardDetails.poolAddress) {
              case (?poolAddress) {
                logDetails.add(("poolAddress", #Text(poolAddress)));
              };
              case null {};
            };

            ignore CapCanister.addRecord(
              Principal.fromText(wizardDetails.userId),
              "update_token_agent",
              Buffer.toArray(logDetails),
            );
            return #ok("Agent updated");
          };
        };
      };
    };
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
            ignore CapCanister.addRecord(
              message.caller,
              "delete_agent",
              [("agentId", #Text(wizard.id))],
            );
            return { status = 200; message = "Wizard deleted" };
          };
        };

      };
    };
  };

  public shared ({ caller }) func publishWizard(wizardId : Text) : async Types.Response {
    await publishUnpublishWizard({
      caller;
      wizardId;
      wizards = wizardsV3;
      isPublish = true;
      capCanister = CapCanister;
    });
  };

  public shared ({ caller }) func unpublishWizard(wizardId : Text) : async Types.Response {
    await publishUnpublishWizard({
      caller;
      wizardId;
      wizards = wizardsV3;
      isPublish = false;
      capCanister = CapCanister;
    });
  };

  public shared ({ caller }) func transferAgentOwnership({
    newPrincipal : Principal;
    agentId : Text;
  }) : async Result.Result<Text, Types.TransferOwnershipError> {
    let wizard = findWizardById(agentId, wizardsV3);

    switch (wizard) {
      case null {
        return #err(#AgentNotFound);
      };
      case (?wizard) {
        if ((wizard.userId != Principal.toText(caller)) and (not isOwner(caller))) {
          Debug.print("user not authorized for transferAgentOwnership" # debug_show (caller));
          return #err(#UserNotAuthorized);
        };

        let index = findWizardIndex(wizard, wizardsV3);

        switch (index) {
          case null {
            return #err(#AgentNotFound);
          };
          case (?index) {
            let updatedWizard = {
              wizard with userId = Principal.toText(newPrincipal)
            };
            wizardsV3.put(index, updatedWizard);

            ignore CapCanister.addRecord(
              caller,
              "transferOwnership",
              [
                ("agentId", #Text(wizard.id)),
                ("from", #Text(wizard.userId)),
                ("to", #Text(Principal.toText(newPrincipal))),
              ],
            );

            return #ok("Owner transferred");
          };
        };
      };
    };
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

            // update check for tokenized agents
            if (Option.isSome(wizard.poolAddress) or Option.isSome(wizard.tokenAddress)) {
              if (wizardDetails.name != wizard.name) {
                throw Error.reject("Can't update name for tokenized agents");
              };
              if (wizardDetails.description != wizard.description) {
                throw Error.reject("Can't update description for tokenized agents");
              };
              if (wizardDetails.avatar != wizard.avatar) {
                throw Error.reject("Can't update avatar for tokenized agents");
              };
            };

            wizardsV3.put(index, updatedWizardDetails);
            let logDetails = Buffer.Buffer<(Text, CapCanisterType.DetailValue)>(5);
            logDetails.add(("agentId", #Text(wizard.id)));
            var changesCount = 0;

            if (wizardDetails.name != wizard.name) {
              logDetails.add(("before:wizardName", #Text(wizard.name)));
              logDetails.add(("after:wizardName", #Text(wizardDetails.name)));
              changesCount := changesCount + 1;
            };
            if (wizardDetails.biography != wizard.biography) {
              logDetails.add(("before:biography", #Text(wizard.biography)));
              logDetails.add(("after:biography", #Text(wizardDetails.biography)));
              changesCount := changesCount + 1;
            };
            if (wizardDetails.description != wizard.description) {
              logDetails.add(("before:description", #Text(wizard.description)));
              logDetails.add(("after:description", #Text(wizardDetails.description)));
              changesCount := changesCount + 1;
            };
            if (wizardDetails.avatar != wizard.avatar) {
              logDetails.add(("before:avatar", #Text(wizard.avatar)));
              logDetails.add(("after:avatar", #Text(wizardDetails.avatar)));
              changesCount := changesCount + 1;
            };

            if (wizardDetails.greeting != wizard.greeting) {
              logDetails.add(("before:greeting", #Text(wizard.greeting)));
              logDetails.add(("after:greeting", #Text(wizardDetails.greeting)));
              changesCount := changesCount + 1;
            };
            if (wizardDetails.visibility != wizard.visibility) {
              logDetails.add(("before:visibility", #Text(visibilityToText(wizard.visibility))));
              logDetails.add(("after:visibility", #Text(visibilityToText(wizardDetails.visibility))));
              changesCount := changesCount + 1;
            };

            AnalyticsUtils.updateModificationAnalytics(wizard.id, changesCount, analytics);
            ignore CapCanister.addRecord(caller, "update_agent", Buffer.toArray(logDetails));
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

  public shared ({ caller }) func updateKnowledgeAnalytics(wizardId : Text) : async Text {
    let canUpdate = (caller == _ragCanisterId) or isOwner(caller);
    if (not canUpdate) {
      Debug.print("Error:updateKnowledgeAnalytics, not authorized,caller: " # debug_show (caller));
      throw Error.reject("User not authorized");
    };

    AnalyticsUtils.updateModificationAnalytics(wizardId, 1, analytics);
    return "Analytics updated";
  };

  public query func getAllAnalytics() : async [(
    Text,
    Types.Analytics_V2_External,
  )] {
    Array.map<(Text, Types.Analytics), (Text, Types.Analytics_V2_External)>(
      Iter.toArray(analytics.entries()),
      func((wizardId, analytic) : (Text, Types.Analytics)) : (
        Text,
        Types.Analytics_V2_External,
      ) {
        switch (analytic) {
          case (#v2(data)) {
            return (
              wizardId,
              {
                messagesReplied = data.messagesReplied;
                uniqueUsers = data.uniqueUsers.size();
                modificationCount = data.modificationCount;
              },
            );
          };
          case (#v1(data)) {
            return (
              wizardId,
              {
                messagesReplied = data.messagesReplied;
                uniqueUsers = 0;
                modificationCount = 0;
              },
            );
          };
        };
      },
    );
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
    Debug.print(" END post_upgrade\n\n");

    wizards := Buffer.fromArray(_wizardsNew);
    wizardsV2 := Buffer.fromArray(_wizardsV2);
    // wizardsV3 := Buffer.fromArray(_wizardsV3);
    analytics := HashMap.fromIter<Text, Types.Analytics>(_analytics.vals(), 5, Text.equal, Text.hash);
  };
};
