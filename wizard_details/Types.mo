import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Time "mo:base/Time";

module {

  public type InitialArgs = {
    owner : Principal;
    userManagementCanisterId : Principal;
    elnaImagesCanisterId : Principal;
    capCanisterId : Principal;
    ragCanisterId : Principal;

  };

  public type WizardVisibility = {
    #publicVisibility;
    #privateVisibility;
    #unlistedVisibility;
  };

  public type UserAddress = Principal;

  public type WizardDetailsBasic = {
    id : Text;
    name : Text;
    // TODO: Make Principal
    userId : Text;
    biography : Text;
    description : Text;
    avatar : Text;
    isPublished : Bool;
  };

  public type WizardDetailsBasicWithTimeStamp = WizardDetailsBasic and {
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type WizardDetailsBasicWithCreatorName = WizardDetailsBasicWithTimeStamp and {
    creatorName : Text;
    tokenAddress : ?Text;
    poolAddress : ?Text;
  };

  public type WizardDetails = WizardDetailsBasic and {
    greeting : Text;
    summary : ?Text;
    visibility : WizardVisibility;
  };

  public type WizardDetailsWithTimeStamp = WizardDetails and {
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type WizardDetailsV3 = WizardDetailsBasic and {
    greeting : Text;
    summary : ?Text;
    visibility : WizardVisibility;
    poolAddress : ?Text;
    tokenAddress : ?Text;
  };

  public type WizardDetailsWithTimeV3 = WizardDetailsV3 and {
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type WizardDetailsWithCreatorName = WizardDetailsWithTimeV3 and {
    creatorName : Text;
  };

  public type WizardUpdateDetails = {
    name : Text;
    biography : Text;
    description : Text;
    avatar : Text;
    greeting : Text;
    visibility : WizardVisibility;
  };

  public type Response = {
    status : Nat;
    message : Text;
  };

  // TODO: can we removed?
  public type Analytics_V1 = {
    messagesReplied : Nat;
  };

  public type Analytics_V2 = {
    messagesReplied : Nat;
    uniqueUsers : [Principal];
    modificationCount : Nat;
  };

  public type Analytics_V2_External = {
    messagesReplied : Nat;
    uniqueUsers : Nat;
    modificationCount : Nat;
  };

  public type Analytics = {
    #v1 : Analytics_V1;
    #v2 : Analytics_V2;
  };

  public type UserProfile = {
    alias : Text;
    xHandle : ?Text;
    bio : ?Text;
  };

  public type Error = {
    #UserNotAuthorized;
    #UnableToUploadAvatar;
    #AgentNotFound;
    #PrincipalIdMissMatch;
    #AgentIdExist;
  };

  public type TransferOwnershipError = {
    #AgentNotFound;
    #UserNotAuthorized;
  };
};
