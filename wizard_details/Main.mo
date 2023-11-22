import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Backend "canister:backend";

import Types "./Types";
import {
  getWizardsByUser;
  isWizardNameTakenByUser;
  getWizardsBasicDetails;
} "./Utils";

actor class Main() {
  private stable var _wizards : [Types.WizardDetails] = [];
  var wizards = Buffer.Buffer<Types.WizardDetails>(10);

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
      return { status = 200; message = "Created wizrad" };
    } else {
      return { status = 422; message = "Wizard named already exist" };
    };
  };

  system func preupgrade() {
    _wizards := Buffer.toArray(wizards);
  };

  system func postupgrade() {
    wizards := Buffer.fromArray(_wizards);
  };
};
