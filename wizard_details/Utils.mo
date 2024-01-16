import Array "mo:base/Array";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";

import Types "./Types";

module {

  public func getWizardsByUser(
    wizards : Buffer.Buffer<Types.WizardDetails>,
    // TODO: make principal?
    userId : Text,
  ) : [Types.WizardDetails] {
    Array.filter(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetails) : Bool {
        wizard.userId == userId;
      },
    );
  };

  public func isWizardNameTakenByUser(
    wizards : Buffer.Buffer<Types.WizardDetails>,
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
          description = wizard.description;
          avatar = wizard.avatar;
        };
      },
    );
  };

  public func isUserBotCreator(userId : Principal, wizard : Types.WizardDetails) : Bool {
    wizard.userId == Principal.toText(userId);
  };
};
