import Types "./Types";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Bool "mo:base/Bool";

module {
  public func filterApprovedTools(developerTools : Buffer.Buffer<Types.DeveloperTool>) : [Types.DeveloperTool] {
    return Array.filter(
      Buffer.toArray(developerTools),
      func(tool : Types.DeveloperTool) : Bool {
        tool.status == #approved;
      },
    );
  };

  public func getToolWithCreator(tool : Types.DeveloperTool, creator : Text) : Types.DeveloperToolWithCreator {
    {
      tool with creator = creator;
    };
  };

  public func getToolOwner(developerUsers : [Types.Developer], toolOwner : Principal) : ?Types.Developer {
    Array.find(
      developerUsers,
      func(developer : Types.Developer) : Bool {
        developer.principal == toolOwner;
      },
    );
  };

  public func getTool(developerTools : Buffer.Buffer<Types.DeveloperTool>, id : Text) : ?Types.DeveloperTool {
    Array.find(
      Buffer.toArray(developerTools),
      func(request : Types.DeveloperTool) : Bool {
        request.id == id;
      },
    );
  };

  public func findIndexDevTool(buffer : Buffer.Buffer<Types.DeveloperTool>, item : Types.DeveloperTool) : ?Nat {
    Buffer.indexOf(
      item,
      buffer,
      func(item1 : Types.DeveloperTool, item2 : Types.DeveloperTool) : Bool {
        item1.id == item2.id;
      },
    );
  };

  public func getUserTool(developerTools : Buffer.Buffer<Types.DeveloperTool>, principal : Principal) : [Types.DeveloperTool] {
    Array.filter(
      Buffer.toArray(developerTools),
      func(request : Types.DeveloperTool) : Bool {
        request.principal == principal;
      },
    );
  };
};
