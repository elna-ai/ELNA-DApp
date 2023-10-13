import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Vec "mo:vector";



import Types "./Types";
import {
  getWizardsByUser;
  isWizardNameTakenByUser;
  getWizardsBasicDetails
} "./Utils";



actor class Main() {
  stable var wizards = Vec.new<Types.WizardDetails>();

  public query func getWizards() : async [Types.WizardDetailsBasic] {

    let publicWizards = Array.filter(Vec.toArray(wizards), func (wizard:Types.WizardDetails): Bool {
        wizard.visibility == #publicVisibility
    });

    getWizardsBasicDetails(publicWizards);
  };

  public query func getUserWizards(userId: Types.UserAddress): async [Types.WizardDetailsBasic] {
    let userWizards = getWizardsByUser(wizards,userId);

    getWizardsBasicDetails(userWizards);
  };

  public query func getWizard(id: Text): async ?Types.WizardDetails {
    Array.find(Vec.toArray(wizards), func (wizard: Types.WizardDetails): Bool {
      wizard.id == id
    });
  };

  public query func  isWizardNameValid(userId: Types.UserAddress, wizardName: Text): async Bool {
    isWizardNameTakenByUser(wizards,userId, wizardName)
  };

  public func addWizard(userId: Types.UserAddress, wizard: Types.WizardDetails): async Types.Response {
    let isNewWizardName = isWizardNameTakenByUser(wizards, userId, wizard.name);

    if(isNewWizardName) {
      Vec.add(wizards, wizard);
      return {status=200;message="Created wizrad"};
    } else {
      return {status=422;message="Wizard named already exist"};
    }
  };
};
