import Text "mo:base/Text";
import Nat "mo:base/Nat";
import D "mo:base/Debug";
import Map "mo:motoko-hash-map/Map";
import { thash } "mo:motoko-hash-map/Map";
// import WizardDetails "canister:wizard_details";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Bool "mo:base/Bool";

import Types "./Types";

actor class Backend() {

  stable var userDetails = Map.new<Types.UserAddress, Types.UserDetails>();
  stable var whitelistedUsers : [Types.UserAddress] = [
    "espul-tcuci-bsdly-lsq3g-rinm2-vl22z-fnpar-rpshl-wdsei-fe5id-dqe"
  ];

  public query func isUserWhitelisted(userId : Types.UserAddress) : async Bool {
    let isWhitelisted : ?Text = Array.find(
      whitelistedUsers,
      func(whitelistedUser : Types.UserAddress) : Bool {
        whitelistedUser == userId;
      },
    );
    switch (isWhitelisted) {
      case null { false };
      case _ { true };
    };
  };
};
