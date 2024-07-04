import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import Backend "canister:backend";

import Types "./Types";
import Utils "./Utils";

actor class DeveloperStudio() {
  private stable var _developerTools : [Types.DeveloperTool] = [];

  var developerTools = Buffer.Buffer<Types.DeveloperTool>(10);

  public func getApprovedTools() : async [Types.DeveloperToolWithCreator] {
    let approvedTools = Utils.filterApprovedTools(developerTools);
    let developerUsers = await Backend.getDevelopers();
    let developerToolsWithCreator = Buffer.map<Types.DeveloperTool, Types.DeveloperToolWithCreator>(
      Buffer.fromArray(approvedTools),
      func(devTool) {
        let creator = Utils.getToolOwner(developerUsers, devTool.principal);
        switch (creator) {
          case (?user) {
            Utils.getToolWithCreator(devTool, user.alias);
          };
          case null {
            Utils.getToolWithCreator(devTool, "");
          };
        };
      },
    );

    return Buffer.toArray(developerToolsWithCreator);
  };

  public shared ({ caller }) func getTools() : async [Types.DeveloperTool] {
    // TODO: create a cache for isUserAdmin?
    let isUserAdmin = await Backend.isPrincipalAdmin(caller);
    if (not isUserAdmin) {
      throw Error.reject("User not authorized for this action");
    };

    return Buffer.toArray(developerTools);
  };

  public shared ({ caller }) func requestToolSubmission(tool : Types.DeveloperTool) : async Bool {
    if (tool.principal != caller) {
      throw Error.reject("Principal does not match");
    };

    developerTools.add(tool);
    return true;
  };

  public shared ({ caller }) func approvePendingDeveloperTool(id : Text) : async Text {

    let isUserAdmin = await Backend.isPrincipalAdmin(caller);
    if (not isUserAdmin) {
      throw Error.reject("User not authorized for this action");
    };

    let pendingTool = Utils.getTool(developerTools, id);
    switch (pendingTool) {
      case (?tool) {
        let index = Utils.findIndexDevTool(developerTools, tool);
        switch (index) {
          case null {
            return "Request not found";
          };
          case (?index) {
            if (tool.status == #approved) {
              throw Error.reject("Tool Already approved");
            };

            let updatedTool = Utils.updateToolStatus(tool, #approved);
            developerTools.put(index, updatedTool);
            return "Request approved";
          };
        };
      };
      case null {
        throw Error.reject("Request not found");
      };
    };
  };

  public shared ({ caller }) func rejectDeveloperTool(id : Text) : async Text {
    let isUserAdmin = await Backend.isPrincipalAdmin(caller);
    if (not isUserAdmin) {
      throw Error.reject("User not authorized for this action");
    };

    let pendingTool = Utils.getTool(developerTools, id);
    switch (pendingTool) {
      case (?tool) {
        let index = Utils.findIndexDevTool(developerTools, tool);
        switch (index) {
          case null {
            return "Count't find pending approval";
          };
          case (?index) {
            if (tool.status == #rejected) {
              throw Error.reject("Tool already rejected");
            };

            let updatedTool = Utils.updateToolStatus(tool, #rejected);
            developerTools.put(index, updatedTool);
            return "Request rejected";
          };
        };
      };
      case null {
        throw Error.reject("Request not found");
      };
    };
  };

  public shared query ({ caller }) func getUserTools() : async [Types.DeveloperTool] {
    Utils.getUserTool(developerTools, caller);
  };

  system func preupgrade() {
    _developerTools := Buffer.toArray(developerTools);
  };

  system func postupgrade() {
    developerTools := Buffer.fromArray(_developerTools);
  };
};
