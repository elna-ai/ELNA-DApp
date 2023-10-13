import Text "mo:base/Text";
import Nat "mo:base/Nat";

module {
  public type WizardVisibility = {
      #publicVisibility;
      #privateVisibility;
      #unlistedVisibility;
  };

  // TODO: check if something like Omit exist for types
  public type WizardDetailsBasic = {
    id: Text;
    name: Text;
    userId: Text;
    biography: Text;
  };

  public type WizardDetails = {
      id: Text;
      name: Text;
      avatar: ?Text;
      biography: Text;
      greeting: Text;
      summary: ?Text;
      userId: Text;
      visibility: WizardVisibility;
  };

  public type Response = {
    status: Nat;
    message: Text;
  };

  public type UserAddress = Text;

};
