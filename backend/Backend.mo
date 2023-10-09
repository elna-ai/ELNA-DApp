import Text "mo:base/Text";
import Nat "mo:base/Nat";
import D "mo:base/Debug";
import Map "mo:motoko-hash-map/Map";
import { thash } "mo:motoko-hash-map/Map";

import Option "mo:base/Option";

actor class Backend() {
  type UserAddress = Text;
  type UserDetails = {
    count: Nat;
  };

  stable var userDetails = Map.new<UserAddress,UserDetails>();

 func displayUsers () {
  D.print("\n\n Start display");
  D.print(debug_show(userDetails));
  D.print("End Display \n\n");
 };

 func displayUserCount(userId: UserAddress) {
  D.print(debug_show(Map.get(userDetails,thash,userId)));
 };

  public query func get(userId: UserAddress) : async Nat {
    switch(Map.get(userDetails,thash,userId)) {
      case null { return 0 };
      case (?details) { return details.count};
    };
    // let details: ?UserDetails = Map.get(userDetails,thash,userId);
    // let count: UserDetails = Option.get(user, {count=0});

  };

  public func inc(userId: UserAddress) : async () {
    switch (Map.get(userDetails,thash,userId)) {
      case null { Map.set(userDetails, thash, userId, {count=1}); };
      case (?details) { Map.set(userDetails, thash, userId, {count = details.count +1}); };
    };
  };
};
