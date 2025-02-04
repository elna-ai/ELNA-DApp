import Array "mo:base/Array";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";

import Types "./Types";

module {

  public func getWizardsByUser(
    wizards : Buffer.Buffer<Types.WizardDetailsWithTimeV3>,
    // TODO: make principal?
    userId : Text,
  ) : [Types.WizardDetailsWithTimeV3] {
    Array.filter(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetailsWithTimeV3) : Bool {
        wizard.userId == userId;
      },
    );
  };

  public func isWizardNameTakenByUser(
    wizards : Buffer.Buffer<Types.WizardDetailsWithTimeV3>,
    // TODO: make principal?
    userId : Text,
    wizardName : Text,
  ) : Bool {
    let userWizards = getWizardsByUser(wizards, userId);
    Array.filter(
      userWizards,
      func(userWizard : Types.WizardDetailsWithTimeV3) : Bool {
        userWizard.name == wizardName;
      },
    ).size() == 0;
  };

  public func getWizardsBasicDetails(wizards : [Types.WizardDetailsWithCreatorName]) : [Types.WizardDetailsBasicWithCreatorName] {
    Array.map(
      wizards,
      func(wizard : Types.WizardDetailsWithCreatorName) : Types.WizardDetailsBasicWithCreatorName {
        {
          id = wizard.id;
          name = wizard.name;
          userId = wizard.userId;
          biography = wizard.biography;
          description = wizard.description;
          avatar = wizard.avatar;
          isPublished = wizard.isPublished;
          createdAt = wizard.createdAt;
          updatedAt = wizard.updatedAt;
          creatorName = wizard.creatorName;

        };
      },
    );
  };

  public func isUserBotCreator(userId : Principal, wizard : Types.WizardDetails) : Bool {
    wizard.userId == Principal.toText(userId);
  };

  public func findWizardById(wizardId : Text, wizards : Buffer.Buffer<Types.WizardDetailsWithTimeV3>) : ?Types.WizardDetailsWithTimeV3 {
    Array.find(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetailsWithTimeV3) : Bool {
        wizard.id == wizardId;
      },
    );
  };

  public func findWizardIndex(wizard : Types.WizardDetailsWithTimeV3, wizards : Buffer.Buffer<Types.WizardDetailsWithTimeV3>) : ?Nat {
    Buffer.indexOf(
      wizard,
      wizards,
      func(wizard1 : Types.WizardDetailsWithTimeV3, wizard2 : Types.WizardDetailsWithTimeV3) : Bool {
        return wizard1.id == wizard2.id;
      },
    );
  };

  public func updatePublishState(wizard : Types.WizardDetailsWithTimeV3, isPublished : Bool) : Types.WizardDetailsWithTimeV3 {
    {
      wizard with isPublished = isPublished;
      updatedAt = Time.now();
    };
  };

  public func publishUnpublishWizard({
    wizardId : Text;
    wizards : Buffer.Buffer<Types.WizardDetailsWithTimeV3>;
    isPublish : Bool;
    caller : Principal;
  }) : Types.Response {
    let wizard = findWizardById(wizardId, wizards);
    switch (wizard) {
      case null {
        return { status = 404; message = "Agent not found" };
      };
      case (?wizard) {
        if (not isUserBotCreator(caller, wizard)) {
          return { status = 401; message = "User did not create the agent" };
        };

        let wizardIndex = findWizardIndex(wizard, wizards);
        switch (wizardIndex) {
          case null {
            return { status = 404; message = "Agent not found" };
          };
          case (?index) {
            wizards.put(index, updatePublishState(wizard, isPublish));
            let status = if (isPublish) "published" else "unpublished";
            return {
              status = 200;
              message = "Agent " # status;
            };
          };
        };
      };
    };
  };

  public func addTimeStamp(wizard : Types.WizardDetailsV3) : Types.WizardDetailsWithTimeV3 {
    {
      wizard with
      createdAt = Time.now();
      updatedAt = Time.now();
    };
  };

  public func getWizardsWithCreator(wizards : [Types.WizardDetailsWithTimeV3], creatorProfilesArray : [(Principal, Types.UserProfile)]) : [Types.WizardDetailsWithCreatorName] {
    let userProfiles = HashMap.fromIter<Principal, Types.UserProfile>(creatorProfilesArray.vals(), 5, Principal.equal, Principal.hash);
    let wizardsWithCreatorNames = Array.map(
      wizards,
      func(wizard : Types.WizardDetailsWithTimeV3) : Types.WizardDetailsWithCreatorName {
        let creatorProfile = userProfiles.get(Principal.fromText(wizard.userId));
        let alias = switch creatorProfile {
          case (?profile) { profile.alias };
          case null "";
        };
        return {
          wizard and { creatorName = alias }
        };
      },
    );

    return wizardsWithCreatorNames;
  };
};
