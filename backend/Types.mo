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

  public type DeveloperStatus = {
    #approved;
    #disabled;
  };

  public type DeveloperApprovalStatus = {
    #approved;
    #pending;
    #rejected;
  };

  public type Developer = {
    id : Text;
    alias : Text;
    email : Text;
    github : Text;
    principal : Principal;
    status : DeveloperStatus;
  };

  public type DeveloperApproval = {
    id : Text;
    alias : Text;
    email : Text;
    github : Text;
    description : Text;
    principal : Principal;
    // TODO: IS this required?
    status : DeveloperApprovalStatus;
  };

  public type DeveloperToolStatus = {
    #approved;
    #disabled;
    #pending;
    #rejected;
  };

  public type DeveloperTool = {
    id : Text;
    name : Text;
    description : Text;
    projectUrl : Text;
    category : Text;
    principal : Principal;
    status : DeveloperToolStatus;
  };

  public type DeveloperToolWithCreator = {
    id : Text;
    name : Text;
    description : Text;
    projectUrl : Text;
    category : Text;
    creator : Text;
    status : DeveloperToolStatus;
  };
};
