import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

module {
  public type WizardVisibility = {
    #publicVisibility;
    #privateVisibility;
    #unlistedVisibility;
  };

  public type UserAddress = Principal;

  // TODO: check if something like Omit exist for types
  public type WizardDetailsBasic = {
    id : Text;
    name : Text;
    // Make Principal
    userId : Text;
    biography : Text;
  };

  public type WizardDetails = WizardDetailsBasic and {
    avatar : ?Text;
    greeting : Text;
    summary : ?Text;
    visibility : WizardVisibility;
  };

  public type Response = {
    status : Nat;
    message : Text;
  };

};
