import Text "mo:base/Text";
import Principal "mo:base/Principal";

module {
  public type UserAddress = Principal;

  public type UserDetails = {
    botList : [Text];
  };
};
