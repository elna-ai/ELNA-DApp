import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Time "mo:base/Time";

module {

  public type InitalArgs = {
    owner : Principal;
    userManagementCanisterId : Principal;

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

  public type WizardDetails = WizardDetailsBasic and {
    greeting : Text;
    summary : ?Text;
    visibility : WizardVisibility;
  };

  public type WizardDetailsWithTimeStamp = WizardDetails and {
    createdAt : Time.Time;
    updatedAt : Time.Time;
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

  public type Analytics_V1 = {
    messagesReplied : Nat;
  };

  public type Analytics = {
    #v1 : Analytics_V1;
  };

};
