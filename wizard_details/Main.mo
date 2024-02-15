import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Backend "canister:backend";

import Types "./Types";
import {
  getWizardsByUser;
  isWizardNameTakenByUser;
  getWizardsBasicDetails;
  isUserBotCreator;
  publishUnpublishWizard;
  findWizardById;
  findWizardIndex;
} "./Utils";

actor class Main(_owner : Principal) {
  private stable var _wizardsNew : [Types.WizardDetails] = [];
  private stable var _analytics : [(Text, Types.Analytics)] = [];
  private stable var owner : Principal = _owner;
  var wizards = Buffer.Buffer<Types.WizardDetails>(10);
  var analytics = HashMap.HashMap<Text, Types.Analytics>(5, Text.equal, Text.hash);

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
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

  public query func getWizards() : async [Types.WizardDetailsBasic] {

    let publicWizards = Array.filter(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetails) : Bool {
        wizard.visibility == #publicVisibility and wizard.isPublished;
      },
    );

    getWizardsBasicDetails(publicWizards);
  };

  public query func getUserWizards(userId : Text) : async [Types.WizardDetailsBasic] {
    let userWizards = getWizardsByUser(wizards, userId);

    getWizardsBasicDetails(userWizards);
  };

  public query func getWizard(id : Text) : async ?Types.WizardDetails {
    findWizardById(id, wizards);
  };

  public shared query (message) func isWizardNameValid(wizardName : Text) : async Bool {
    isWizardNameTakenByUser(wizards, Principal.toText(message.caller), wizardName);
  };

  public shared (message) func addWizard(wizard : Types.WizardDetails) : async Types.Response {
    let isUserWhitelisted = await Backend.isUserWhitelisted(?message.caller);

    if (not isUserWhitelisted) {
      return { status = 422; message = "User dosen't have permission" };
    };

    let isNewWizardName = isWizardNameTakenByUser(wizards, Principal.toText(message.caller), wizard.name);

    if (isNewWizardName) {
      wizards.add(wizard);
      return { status = 200; message = "Created wizard" };
    } else {
      return { status = 422; message = "Wizard named already exist" };
    };
  };

  public shared (message) func deleteWizard(wizardId : Text) : async Types.Response {

    switch (findWizardById(wizardId, wizards)) {
      case null { return { status = 422; message = "Wizard does not exist" } };
      case (?wizard) {
        let canUserDelete = isOwner(message.caller) or isUserBotCreator(message.caller, wizard);

        if (not canUserDelete) {
          return {
            status = 403;
            message = "Wizard does not belong to user";
          };
        };
        switch (findWizardIndex(wizard, wizards)) {
          case null {
            return { status = 422; message = "Wizard does not exist" };
          };
          case (?index) {
            ignore wizards.remove(index);
            ignore analytics.remove(wizardId);
            return { status = 200; message = "Wizard deleted" };
          };
        };

      };
    };
  };

  public shared ({ caller }) func publishWizard(wizardId : Text) : async Types.Response {
    publishUnpublishWizard({ caller; wizardId; wizards; isPublish = true });
  };

  public shared ({ caller }) func unpublishWizard(wizardId : Text) : async Types.Response {
    publishUnpublishWizard({ caller; wizardId; wizards; isPublish = false });
  };

  public shared ({ caller }) func getAllWizards() : async [Types.WizardDetails] {
    let isUserAdmin = await Backend.isPrincipalAdmin(caller);
    switch (isUserAdmin) {
      case false {
        throw Error.reject("User is not admin");
      };
      case true {
        Buffer.toArray(wizards);
      };
    };
  };

  public query func getAllAnalytics() : async [(Text, Types.Analytics)] {
    Iter.toArray(analytics.entries());
  };

  system func preupgrade() {

    _wizardsNew := Buffer.toArray(wizards);
    _analytics := Iter.toArray(analytics.entries());
  };

  system func postupgrade() {
    wizards := Buffer.fromArray(_wizardsNew);
    analytics := HashMap.fromIter<Text, Types.Analytics>(_analytics.vals(), 5, Text.equal, Text.hash);
  };
};
