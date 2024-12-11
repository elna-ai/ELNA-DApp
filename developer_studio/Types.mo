import Text "mo:base/Text";
import Principal "mo:base/Principal";

module {

  public type InitialArgs = {
    userManagementCanisterId : Principal;
  };
  public type DeveloperStatus = {
    #approved;
    #disabled;
  };

  public type Developer = {
    id : Text;
    alias : Text;
    email : Text;
    github : Text;
    principal : Principal;
    status : DeveloperStatus;
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
    icon : ?Text;
    coverImage : ?Text;
    demoUrl : ?Text;
    presentationUrl : ?Text;
  };

  public type DeveloperToolWithCreator = {
    id : Text;
    name : Text;
    description : Text;
    projectUrl : Text;
    category : Text;
    status : DeveloperToolStatus;
    icon : ?Text;
    coverImage : ?Text;
    demoUrl : ?Text;
    presentationUrl : ?Text;
    creator : Text;
  };
};
