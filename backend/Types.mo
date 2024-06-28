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


  // type creator status
  public type CreatorStatus = {
    #approved;
    #disabled;
  };


  public type DeveloperApprovalStatus = {
    #approved;
    #pending;
    #rejected;
  };

//Creator approval status
  public type CreatorApprovalStatus = {
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

  //Creator type
  public type Creator = {
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

//creator approval type
  public type CreatorApproval = {
    id : Text;
    alias : Text;
    email : Text;
    github : Text;
    description : Text;
    principal : Principal;
    status : CreatorApprovalStatus;
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
