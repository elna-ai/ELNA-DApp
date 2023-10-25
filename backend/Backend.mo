import Text "mo:base/Text";
import Nat "mo:base/Nat";
import D "mo:base/Debug";
import Map "mo:motoko-hash-map/Map";
import { thash } "mo:motoko-hash-map/Map";
// import WizardDetails "canister:wizard_details";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";

import Types "./Types";
import Utils "./Utils";

actor class Backend(_owner : Principal) {

  private stable var owner : Principal = _owner;
  private stable var _whitelistedUsers : [Principal] = [];
  stable var userDetails = Map.new<Types.UserAddress, Types.UserDetails>();
  var whitelistedUsers = Buffer.Buffer<Principal>(5);

  public query func isUserWhitelisted(userId : Principal) : async Bool {
    Utils.isUserWhitelisted(whitelistedUsers, userId);
  };

  public shared (message) func whitelistUser(userId : Principal) : async Text {
    if (not isOwner(message.caller)) {
      return "User not authorized for this action";
    };

    let isAlreadyWhitelisted : Bool = Utils.isUserWhitelisted(whitelistedUsers, userId);
    switch (isAlreadyWhitelisted) {
      case false {
        whitelistedUsers.add(userId);
        return "User whitelisted";
      };
      case true {
        return "User already whitelisted";
      };
    };
  };

  public shared (message) func removeWhitelistedUser(userId : Principal) : async Text {
    if (not isOwner(message.caller)) {
      return "User not authorized for this action";
    };

    let userIndex : ?Nat = Buffer.indexOf(
      userId,
      whitelistedUsers,
      func(a : Principal, b : Principal) : Bool { a == b },
    );
    switch (userIndex) {
      case null {
        return "User not found";
      };
      case (?index) {
        let x = whitelistedUsers.remove(index);
        return "User removed from whitelist";
      };
    };
  };

  func isOwner(callerId : Principal) : Bool {
    callerId == owner;
  };

  system func preupgrade() {
    _whitelistedUsers := Buffer.toArray(whitelistedUsers);
  };

  system func postupgrade() {
    whitelistedUsers := Buffer.fromArray(_whitelistedUsers);
  };
};
