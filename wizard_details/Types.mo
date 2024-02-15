import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";

module {
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

  public type WizardDetails = WizardDetailsBasic and {
    greeting : Text;
    summary : ?Text;
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
