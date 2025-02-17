import Array "mo:base/Array";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import CapBackend "external_canisters/cap_backend";

import Types "./Types";

module {

  public func getWizardsByUser(
    wizards : Buffer.Buffer<Types.WizardDetailsWithTimeStamp>,
    // TODO: make principal?
    userId : Text,
  ) : [Types.WizardDetailsWithTimeStamp] {
    Array.filter(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetailsWithTimeStamp) : Bool {
        wizard.userId == userId;
      },
    );
  };

  public func isWizardNameTakenByUser(
    wizards : Buffer.Buffer<Types.WizardDetailsWithTimeStamp>,
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
          tokenAddress = wizard.tokenAddress;
          poolAddress = wizard.poolAddress;

        };
      },
    );
  };

  public func isUserBotCreator(userId : Principal, wizard : Types.WizardDetails) : Bool {
    wizard.userId == Principal.toText(userId);
  };

  public func findWizardById(wizardId : Text, wizards : Buffer.Buffer<Types.WizardDetailsWithTimeStamp>) : ?Types.WizardDetailsWithTimeStamp {
    Array.find(
      Buffer.toArray(wizards),
      func(wizard : Types.WizardDetails) : Bool {
        wizard.id == wizardId;
      },
    );
  };

  public func findWizardIndex(wizard : Types.WizardDetailsWithTimeStamp, wizards : Buffer.Buffer<Types.WizardDetailsWithTimeStamp>) : ?Nat {
    Buffer.indexOf(
      wizard,
      wizards,
      func(wizard1 : Types.WizardDetailsWithTimeStamp, wizard2 : Types.WizardDetailsWithTimeStamp) : Bool {
        return wizard1.id == wizard2.id;
      },
    );
  };

  public func updatePublishState(wizard : Types.WizardDetailsWithTimeStamp, isPublished : Bool) : Types.WizardDetailsWithTimeStamp {
    {
      isPublished = isPublished;
      id = wizard.id;
      name = wizard.name;
      userId = wizard.userId;
      biography = wizard.biography;
      description = wizard.description;
      avatar = wizard.avatar;
      greeting = wizard.greeting;
      summary = wizard.summary;
      visibility = wizard.visibility;
      createdAt = wizard.createdAt;
      updatedAt = Time.now();
    };
  };

  public func publishUnpublishWizard({
    wizardId : Text;
    wizards : Buffer.Buffer<Types.WizardDetailsWithTimeStamp>;
    isPublish : Bool;
    caller : Principal;
    capCanister : CapBackend.Log;
  }) : async Types.Response {
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
            if (status == "published") {
              ignore capCanister.addRecord(
                caller,
                "agent_update",
                [
                  ("before", #Text("agent unpublished")),
                  ("after", #Text("agent published")),
                  ("agentId", #Text(wizard.id)),
                ],
              );
            } else {
              ignore capCanister.addRecord(
                caller,
                "agent_update",
                [
                  ("before", #Text("agent published")),
                  ("after", #Text("agent unpublished")),
                  ("agentId", #Text(wizard.id)),
                ],
              );
            };

            return {
              status = 200;
              message = "Agent " # status;
            };
          };
        };
      };
    };
  };

  public func addTimeStamp(wizard : Types.WizardDetails) : Types.WizardDetailsWithTimeStamp {
    {
      id = wizard.id;
      name = wizard.name;
      userId = wizard.userId;
      biography = wizard.biography;
      description = wizard.description;
      avatar = wizard.avatar;
      isPublished = wizard.isPublished;
      greeting = wizard.greeting;
      summary = wizard.summary;
      visibility = wizard.visibility;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
  };

  public func getWizardsWithCreator(wizards : [Types.WizardDetailsWithTimeStamp], creatorProfilesArray : [(Principal, Types.UserProfile)]) : [Types.WizardDetailsWithCreatorName] {
    let userProfiles = HashMap.fromIter<Principal, Types.UserProfile>(creatorProfilesArray.vals(), 5, Principal.equal, Principal.hash);
    let wizardsWithCreatorNames = Array.map(
      wizards,
      func(wizard : Types.WizardDetailsWithTimeStamp) : Types.WizardDetailsWithCreatorName {
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

  public func visibilityToText(visibility : Types.WizardVisibility) : Text {
    switch (visibility) {
      case (#publicVisibility) { return "public visibility" };
      case (#privateVisibility) { return "private visibility" };
      case (#unlistedVisibility) { return "unlisted visibility" };
    };
  };


};
