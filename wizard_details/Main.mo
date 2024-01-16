import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import None "mo:base/None";
import Backend "canister:backend";

import Types "./Types";
import {
  getWizardsByUser;
  isWizardNameTakenByUser;
  getWizardsBasicDetails;
  isUserBotCreator;
} "./Utils";

actor class Main(_owner : Principal) {
  private stable var _wizards : [Types.WizardDetails] = [];
  private stable var owner : Principal = _owner;
  var wizards = Buffer.Buffer<Types.WizardDetails>(10);

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
  };

  public query func getWizards() : async [Types.WizardDetailsBasic] {

    let publicWizards = Array.filter(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetails) : Bool {
        wizard.visibility == #publicVisibility;
      },
    );

    getWizardsBasicDetails(publicWizards);
  };

  public query func getUserWizards(userId : Text) : async [Types.WizardDetailsBasic] {
    let userWizards = getWizardsByUser(wizards, userId);

    getWizardsBasicDetails(userWizards);
  };

  public query func getWizard(id : Text) : async ?Types.WizardDetails {
    Array.find(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetails) : Bool {
        wizard.id == id;
      },
    );
  };

  public query func isWizardNameValid(userId : Text, wizardName : Text) : async Bool {
    isWizardNameTakenByUser(wizards, userId, wizardName);
  };

  public func addWizard(userId : Text, wizard : Types.WizardDetails) : async Types.Response {
    let isUserWhitelisted = await Backend.isUserWhitelisted(userId);

    if (not isUserWhitelisted) {
      return { status = 422; message = "User dosen't have permission" };
    };

    let isNewWizardName = isWizardNameTakenByUser(wizards, userId, wizard.name);

    if (isNewWizardName) {
      wizards.add(wizard);
      return { status = 200; message = "Created wizard" };
    } else {
      return { status = 422; message = "Wizard named already exist" };
    };
  };

  public shared (message) func deleteWizard(wizardId : Text) : async Types.Response {

    let wizard = Array.find(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetails) : Bool {
        wizard.id == wizardId;
      },
    );
    switch (wizard) {
      case null { return { status = 422; message = "Wizard does not exist" } };
      case (?value) {
        let canUserDelete = isOwner(message.caller) or isUserBotCreator(message.caller, value);

        if (not canUserDelete) {
          return {
            status = 403;
            message = "Wizard does not belong to user";
          };
        };
        let wizardIndex = Buffer.indexOf(
          value,
          wizards,
          func(wizard1 : Types.WizardDetails, wizard2 : Types.WizardDetails) : Bool {
            return wizard1.id == wizard2.id;
          },
        );
        switch (wizardIndex) {
          case null {
            return { status = 422; message = "Wizard does not exist" };
          };
          case (?index) {
            let _ = wizards.remove(index);
            return {
              status = 200;
              message = "Wizard deleted";
            };
          };
        };

      };
    };
  };

  system func preupgrade() {
    _wizards := Buffer.toArray(wizards);
  };

  system func postupgrade() {
    wizards := Buffer.fromArray(_wizards);
  };
};
