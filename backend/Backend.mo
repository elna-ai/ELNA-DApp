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

  var whitelistedUsers = Buffer.Buffer<Principal>(5);
  var adminUsers = Buffer.Buffer<Principal>(5);
  var userTokens = HashMap.HashMap<Principal, Types.UserToken>(5, Principal.equal, Principal.hash);
  var developerUsers = Buffer.Buffer<Types.Developer>(10);
  var developerPendingApproval = Buffer.Buffer<Types.DeveloperApproval>(10);

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

  public shared (message) func getDevelopers() : async [Types.Developer] {
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

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
  };

  system func preupgrade() {
    _whitelistedUsers := Buffer.toArray(whitelistedUsers);
    _adminUsers := Buffer.toArray(adminUsers);
    _userTokens := Iter.toArray(userTokens.entries());
    _developerUsers := Buffer.toArray(developerUsers);
    _developerPendingApproval := Buffer.toArray(developerPendingApproval);

  };

  system func postupgrade() {
    whitelistedUsers := Buffer.fromArray(_whitelistedUsers);
    adminUsers := Buffer.fromArray(_adminUsers);
    userTokens := HashMap.fromIter<Principal, Types.UserToken>(_userTokens.vals(), 5, Principal.equal, Principal.hash);
    developerUsers := Buffer.fromArray(_developerUsers);
    developerPendingApproval := Buffer.fromArray(_developerPendingApproval);
  };
};
