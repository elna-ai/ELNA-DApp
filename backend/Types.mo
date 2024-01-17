import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
  public type UserAddress = Principal;

  public type UserDetails = {
    botList : [Text];
  };

  public type UserToken = {
    token : Text;
    expireyTime : Time.Time;
  };
};
