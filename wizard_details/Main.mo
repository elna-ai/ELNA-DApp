import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Vec "mo:vector";
import Backend "canister:backend";

import Types "./Types";
import {
  getWizardsByUser;
  isWizardNameTakenByUser;
  getWizardsBasicDetails;
} "./Utils";

actor class Main() {
  stable var wizards = Vec.new<Types.WizardDetails>();

  public query func getWizards() : async [Types.WizardDetailsBasic] {

    let publicWizards = Array.filter(
      Vec.toArray(wizards),
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
      Vec.toArray(wizards),
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
      Vec.add(wizards, wizard);
      return { status = 200; message = "Created wizrad" };
    } else {
      return { status = 422; message = "Wizard named already exist" };
    };
  };
};
