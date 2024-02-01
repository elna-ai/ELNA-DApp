import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
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
  private stable var owner : Principal = _owner;
  var wizards = Buffer.Buffer<Types.WizardDetails>(10);

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
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

  system func preupgrade() {

    _wizardsNew := Buffer.toArray(wizards);
  };

  system func postupgrade() {
    wizards := Buffer.fromArray(_wizardsNew);
  };
};
