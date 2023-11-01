import Array "mo:base/Array";
import Text "mo:base/Text";
import Vec "mo:vector";

import Types "./Types";

module {

  public func getWizardsByUser(
    wizards : Vec.Vector<Types.WizardDetails>,
    // TODO: make principal?
    userId : Text,
  ) : [Types.WizardDetails] {
    Array.filter(
      Vec.toArray(wizards),
      func(wizard : Types.WizardDetails) : Bool {
        wizard.userId == userId;
      },
    );
  };

  public func isWizardNameTakenByUser(
    wizards : Vec.Vector<Types.WizardDetails>,
    // TODO: make principal?
    userId : Text,
    wizardName : Text,
  ) : Bool {
    let userWizards = getWizardsByUser(wizards, userId);
    Array.filter(
      userWizards,
      func(userWizard : Types.WizardDetails) : Bool {
        userWizard.name == wizardName;
      },
    ).size() == 0;
  };

  public func getWizardsBasicDetails(wizards : [Types.WizardDetails]) : [Types.WizardDetailsBasic] {
    Array.map(
      wizards,
      func(wizard : Types.WizardDetails) : Types.WizardDetailsBasic {
        {
          id = wizard.id;
          name = wizard.name;
          userId = wizard.userId;
          biography = wizard.biography;
        };
      },
    );
  };
};
