import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Map "mo:motoko-hash-map/Map";
import { thash } "mo:motoko-hash-map/Map";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

import Types "./Types";
import Utils "./Utils";

actor class Backend(_owner : Principal) {

  private stable var owner : Principal = _owner;
  private stable var _whitelistedUsers : [Principal] = [];
  private stable var _adminUsers : [Principal] = [];
  // TODO: check if userDetails requried?
  stable var userDetails = Map.new<Types.UserAddress, Types.UserDetails>();
  stable var _userTokens : [(Principal, Types.UserToken)] = [];
  private stable var _developerUsers : [Types.Developer] = [];
  private stable var _developerPendingApproval : [Types.DeveloperApproval] = [];
  // TODO: remove developer tools after new canister check
  private stable var _developerTools : [Types.DeveloperTool] = [];

  var whitelistedUsers = Buffer.Buffer<Principal>(5);
  var adminUsers = Buffer.Buffer<Principal>(5);
  var userTokens = HashMap.HashMap<Principal, Types.UserToken>(5, Principal.equal, Principal.hash);
  var developerUsers = Buffer.Buffer<Types.Developer>(10);
  var developerPendingApproval = Buffer.Buffer<Types.DeveloperApproval>(10);
  // TODO: remove developer tools after new canister check
  var developerTools = Buffer.Buffer<Types.DeveloperTool>(10);

  public shared query (message) func isUserWhitelisted(principalId : ?Principal) : async Bool {
    switch (principalId) {
      case null {
        return Utils.isUserWhitelisted(whitelistedUsers, message.caller);
      };
      case (?id) {
        Utils.isUserWhitelisted(whitelistedUsers, id);
      };
    };
  };

  public shared (message) func getWhitelistedUser() : async [Principal] {

    switch (Utils.isUserAdmin(adminUsers, message.caller)) {
      case false {
        throw Error.reject("User is not admin");
      };
      case true {
        return Buffer.toArray(whitelistedUsers);
      };
    };
  };

  public shared (message) func whitelistUser(userId : Principal) : async Text {
    let canUserWhitelist = isOwner(message.caller) or Utils.isUserAdmin(adminUsers, message.caller);
    if (not canUserWhitelist) {
      throw Error.reject("User not authorized for this action");
    };

    let isAlreadyWhitelisted : Bool = Utils.isUserWhitelisted(whitelistedUsers, userId);

    switch (isAlreadyWhitelisted) {
      case false {
        whitelistedUsers.add(userId);
        return "User whitelisted";
      };
      case true {
        throw Error.reject("User already whitelisted");
      };
    };
  };

  public shared (message) func removeWhitelistedUser(userId : Principal) : async Text {
    let canUserDelete = isOwner(message.caller) or Utils.isUserAdmin(adminUsers, message.caller);
    if (not canUserDelete) {
      return "User not authorized for this action";
    };

    let userIndex : ?Nat = Buffer.indexOf(
      userId,
      whitelistedUsers,
      func(a : Principal, b : Principal) : Bool { a == b },
    );
    switch (userIndex) {
      case null {
        throw Error.reject("User not found");
      };
      case (?index) {
        let x = whitelistedUsers.remove(index);
        return "User removed from whitelist";
      };
    };
  };

  public shared query (message) func isUserAdmin() : async Bool {
    Utils.isUserAdmin(adminUsers, message.caller);
  };

  // Should be used only by other canisters
  public query func isPrincipalAdmin(principalId : Principal) : async Bool {
    Utils.isUserAdmin(adminUsers, principalId);
  };

  public shared (message) func addAdmin(userId : Principal) : async Text {
    if (not isOwner(message.caller)) {
      return "User not authorized for this action";
    };

    let isAlreadyAdmin : Bool = Utils.isUserAdmin(adminUsers, userId);
    switch (isAlreadyAdmin) {
      case false {
        adminUsers.add(userId);
        return "User is an admin now";
      };
      case true {
        return "User already an admin";
      };
    };
  };

  public shared (message) func removeAdmin(userId : Principal) : async Text {
    if (not isOwner(message.caller)) {
      return "User not authorized for this action";
    };

    let userIndex : ?Nat = Buffer.indexOf(
      userId,
      adminUsers,
      func(a : Principal, b : Principal) : Bool { a == b },
    );
    switch (userIndex) {
      case null {
        return "User not found";
      };
      case (?index) {
        let x = adminUsers.remove(index);
        return "User removed from admin";
      };
    };
  };

  public shared (message) func generateUserToken() : async Text {
    switch (userTokens.get(message.caller)) {
      case null {
        let tokenDetails = await Utils.createUserToken();
        userTokens.put(message.caller, tokenDetails);

        return tokenDetails.token;
      };
      case (?tokenDetails) {
        if (tokenDetails.expireyTime < Time.now()) {
          ignore userTokens.remove(message.caller);
          let newTokenDetails = await Utils.createUserToken();
          userTokens.put(message.caller, newTokenDetails);

          return newTokenDetails.token;
        };
        return tokenDetails.token;
      };
    };
  };

  public func getUserToken(principalId : Principal) : async Text {
    switch (userTokens.get(principalId)) {
      case (?tokenDetails) {
        if (tokenDetails.expireyTime < Time.now()) {
          throw Error.reject("User token exipred");
        };
        return tokenDetails.token;
      };
      case (_) {
        throw Error.reject("User not found");
      };
    };
  };

  public shared ({ caller }) func requestDeveloperAccess(details : Types.DeveloperApproval) : async Bool {
    if (details.principal != caller) {
      throw Error.reject("Principal does not match");
    };

    developerPendingApproval.add(details);
    return true;
  };

  public shared ({ caller }) func isDeveloper() : async Bool {
    let developer = Array.find(
      Buffer.toArray(developerUsers),
      func(developer : Types.Developer) : Bool {
        developer.principal == caller;
      },
    );
    switch (developer) {
      case (?dev) { return true };
      case null { return false };
    };
  };

  public shared (message) func getPendingDevelopers() : async [Types.DeveloperApproval] {
    return Buffer.toArray(developerPendingApproval);
  };

  public shared query (message) func getDevelopers() : async [Types.Developer] {
    return Buffer.toArray(developerUsers);
  };

  public shared ({ caller }) func approvePendingDeveloper(requestId : Text) : async Text {
    let canUserApprove = isOwner(caller) or Utils.isUserAdmin(adminUsers, caller);
    if (not canUserApprove) {
      throw Error.reject("User not authorized for this action");
    };
    // TODO: check if already approved

    let pendingRequest = Array.find(
      Buffer.toArray(developerPendingApproval),
      func(request : Types.DeveloperApproval) : Bool {
        request.id == requestId;
      },
    );
    switch (pendingRequest) {
      case (?request) {
        let approvedRequest = {
          id = request.id;
          alias = request.alias;
          email = request.email;
          github = request.github;
          principal = request.principal;
          status = #approved;
        };
        developerUsers.add(approvedRequest);
        let index = Buffer.indexOf(
          request,
          developerPendingApproval,
          func(request1 : Types.DeveloperApproval, request2 : Types.DeveloperApproval) : Bool {
            request1.id == request2.id;
          },
        );
        switch (index) {
          case null {
            return "Count't update pending approval,but request approved";
          };
          case (?index) {
            let updatedDetails = {
              id = request.id;
              alias = request.alias;
              email = request.email;
              github = request.github;
              principal = request.principal;
              description = request.description;
              status = #approved;
            };
            developerPendingApproval.put(index, updatedDetails);
            return "Request approved";
          };
        };
      };
      case null {
        throw Error.reject("Request not found");
      };
    };
  };

  public shared ({ caller }) func rejectPendingDeveloper(requestId : Text) : async Text {
    let canUserApprove = isOwner(caller) or Utils.isUserAdmin(adminUsers, caller);
    if (not canUserApprove) {
      throw Error.reject("User not authorized for this action");
    };
    // TODO: check if already approved

    let pendingRequest = Array.find(
      Buffer.toArray(developerPendingApproval),
      func(request : Types.DeveloperApproval) : Bool {
        request.id == requestId;
      },
    );
    switch (pendingRequest) {
      case (?request) {
        let index = Buffer.indexOf(
          request,
          developerPendingApproval,
          func(request1 : Types.DeveloperApproval, request2 : Types.DeveloperApproval) : Bool {
            request1.id == request2.id;
          },
        );
        switch (index) {
          case null {
            return "Count't find pending approval";
          };
          case (?index) {
            let updatedDetails = {
              id = request.id;
              alias = request.alias;
              email = request.email;
              github = request.github;
              principal = request.principal;
              description = request.description;
              status = #rejected;
            };
            developerPendingApproval.put(index, updatedDetails);
            return "Request rejected";
          };
        };
      };
      case null {
        throw Error.reject("Request not found");
      };
    };
  };

  public shared query ({ caller }) func getUserRequests() : async [Types.DeveloperApproval] {
    Array.filter(
      Buffer.toArray(developerPendingApproval),
      func(request : Types.DeveloperApproval) : Bool {
        request.principal == caller;
      },
    );
  };

  public shared ({ caller }) func revokeDeveloperAccess(developerId : Text) : async Text {
    let canRevokeUser = isOwner(caller) or Utils.isUserAdmin(adminUsers, caller);
    if (not canRevokeUser) {
      throw Error.reject("User not authorized for this action");
    };

    let developer = Array.find(
      Buffer.toArray(developerUsers),
      func(request : Types.Developer) : Bool {
        request.id == developerId;
      },
    );
    switch (developer) {
      case (?developer) {
        let index = Buffer.indexOf(
          developer,
          developerUsers,
          func(developer1 : Types.Developer, develper2 : Types.Developer) : Bool {
            developer1.id == developer1.id;
          },
        );
        switch (index) {
          case null {
            throw Error.reject("Count't find developer");
          };
          case (?index) {
            if (developer.status == #disabled) {
              throw Error.reject("Developer already disabled");
            };

            let updatedDetails = {
              id = developer.id;
              alias = developer.alias;
              email = developer.email;
              github = developer.github;
              principal = developer.principal;
              status = #disabled;
            };
            developerUsers.put(index, updatedDetails);
            return "Developer disbaled";
          };
        };
      };
      case null {
        throw Error.reject("Developer not found");
      };
    };
  };

  public shared ({ caller }) func enableDeveloperAccess(developerId : Text) : async Text {
    let canRevokeUser = isOwner(caller) or Utils.isUserAdmin(adminUsers, caller);
    if (not canRevokeUser) {
      throw Error.reject("User not authorized for this action");
    };

    let developer = Array.find(
      Buffer.toArray(developerUsers),
      func(request : Types.Developer) : Bool {
        request.id == developerId;
      },
    );
    switch (developer) {
      case (?developer) {
        let index = Buffer.indexOf(
          developer,
          developerUsers,
          func(developer1 : Types.Developer, develper2 : Types.Developer) : Bool {
            developer1.id == developer1.id;
          },
        );
        switch (index) {
          case null {
            throw Error.reject("Count't find developer");
          };
          case (?index) {
            if (developer.status == #approved) {
              throw Error.reject("Developer already approved");
            };

            let updatedDetails = {
              id = developer.id;
              alias = developer.alias;
              email = developer.email;
              github = developer.github;
              principal = developer.principal;
              status = #approved;
            };
            developerUsers.put(index, updatedDetails);
            return "Developer approved";
          };
        };
      };
      case null {
        throw Error.reject("Developer not found");
      };
    };
  };

  // public query func getApprovedTools() : async [Types.DeveloperToolWithCreator] {
  //   let approvedTools = Array.filter(
  //     Buffer.toArray(developerTools),
  //     func(request : Types.DeveloperTool) : Bool {
  //       request.status == #approved;
  //     },
  //   );

  //   let developerToolsWithCreator = Buffer.map<Types.DeveloperTool, Types.DeveloperToolWithCreator>(
  //     Buffer.fromArray(approvedTools),
  //     func(devTool) {
  //       let creator = Array.find(
  //         Buffer.toArray(developerUsers),
  //         func(developer : Types.Developer) : Bool {
  //           developer.principal == devTool.principal;
  //         },
  //       );
  //       switch (creator) {
  //         case (?user) {
  //           return {
  //             creator = user.alias;
  //             id = devTool.id;
  //             name = devTool.name;
  //             description = devTool.description;
  //             projectUrl = devTool.projectUrl;
  //             category = devTool.category;
  //             status = devTool.status;
  //           };
  //         };
  //         case null {
  //           return {
  //             creator = "";
  //             id = devTool.id;
  //             name = devTool.name;
  //             description = devTool.description;
  //             projectUrl = devTool.projectUrl;
  //             category = devTool.category;
  //             status = devTool.status;
  //           };
  //         };
  //       };
  //     },
  //   );
  //   return Buffer.toArray(developerToolsWithCreator);
  // };

  // public shared ({ caller }) func getTools() : async [Types.DeveloperTool] {
  //   let canUserApprove = isOwner(caller) or Utils.isUserAdmin(adminUsers, caller);
  //   if (not canUserApprove) {
  //     throw Error.reject("User not authorized for this action");
  //   };

  //   return Buffer.toArray(developerTools);
  // };

  // public shared ({ caller }) func requestToolSubmission(tool : Types.DeveloperTool) : async Bool {
  //   if (tool.principal != caller) {
  //     throw Error.reject("Principal does not match");
  //   };

  //   developerTools.add(tool);
  //   return true;
  // };

  // public shared ({ caller }) func approvePendingDeveloperTool(id : Text) : async Text {
  //   let canUserApprove = isOwner(caller) or Utils.isUserAdmin(adminUsers, caller);
  //   if (not canUserApprove) {
  //     throw Error.reject("User not authorized for this action");
  //   };
  //   // TODO: check if already approved

  //   let pendingRequest = Array.find(
  //     Buffer.toArray(developerTools),
  //     func(request : Types.DeveloperTool) : Bool {
  //       request.id == id;
  //     },
  //   );
  //   switch (pendingRequest) {
  //     case (?request) {
  //       let index = Buffer.indexOf(
  //         request,
  //         developerTools,
  //         func(request1 : Types.DeveloperTool, request2 : Types.DeveloperTool) : Bool {
  //           request1.id == request2.id;
  //         },
  //       );
  //       switch (index) {
  //         case null {
  //           return "Request not found";
  //         };
  //         case (?index) {
  //           let updatedDetails = {
  //             id = request.id;
  //             name = request.name;
  //             description = request.description;
  //             projectUrl = request.projectUrl;
  //             principal = request.principal;
  //             category = request.category;
  //             status = #approved;
  //           };
  //           developerTools.put(index, updatedDetails);
  //           return "Request approved";
  //         };
  //       };
  //     };
  //     case null {
  //       throw Error.reject("Request not found");
  //     };
  //   };
  // };

  // public shared ({ caller }) func rejectDeveloperTool(id : Text) : async Text {
  //   let canUserApprove = isOwner(caller) or Utils.isUserAdmin(adminUsers, caller);
  //   if (not canUserApprove) {
  //     throw Error.reject("User not authorized for this action");
  //   };
  //   // TODO: check if already approved

  //   let pendingRequest = Array.find(
  //     Buffer.toArray(developerTools),
  //     func(request : Types.DeveloperTool) : Bool {
  //       request.id == id;
  //     },
  //   );
  //   switch (pendingRequest) {
  //     case (?request) {
  //       let index = Buffer.indexOf(
  //         request,
  //         developerTools,
  //         func(request1 : Types.DeveloperTool, request2 : Types.DeveloperTool) : Bool {
  //           request1.id == request2.id;
  //         },
  //       );
  //       switch (index) {
  //         case null {
  //           return "Count't find pending approval";
  //         };
  //         case (?index) {
  //           let updatedDetails = {
  //             id = request.id;
  //             name = request.name;
  //             description = request.description;
  //             projectUrl = request.projectUrl;
  //             principal = request.principal;
  //             category = request.category;
  //             status = #rejected;
  //           };
  //           developerTools.put(index, updatedDetails);
  //           return "Request rejected";
  //         };
  //       };
  //     };
  //     case null {
  //       throw Error.reject("Request not found");
  //     };
  //   };
  // };
  // public shared query ({ caller }) func getUserTools() : async [Types.DeveloperTool] {
  //   Array.filter(
  //     Buffer.toArray(developerTools),
  //     func(request : Types.DeveloperTool) : Bool {
  //       request.principal == caller;
  //     },
  //   );
  // };

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
  };

  system func preupgrade() {
    _whitelistedUsers := Buffer.toArray(whitelistedUsers);
    _adminUsers := Buffer.toArray(adminUsers);
    _userTokens := Iter.toArray(userTokens.entries());
    _developerUsers := Buffer.toArray(developerUsers);
    _developerPendingApproval := Buffer.toArray(developerPendingApproval);
    _developerTools := Buffer.toArray(developerTools);

  };

  system func postupgrade() {
    whitelistedUsers := Buffer.fromArray(_whitelistedUsers);
    adminUsers := Buffer.fromArray(_adminUsers);
    userTokens := HashMap.fromIter<Principal, Types.UserToken>(_userTokens.vals(), 5, Principal.equal, Principal.hash);
    developerUsers := Buffer.fromArray(_developerUsers);
    developerPendingApproval := Buffer.fromArray(_developerPendingApproval);
    developerTools := Buffer.fromArray(_developerTools);
  };
};
