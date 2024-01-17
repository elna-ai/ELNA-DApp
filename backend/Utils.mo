import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Types "Types";

module {
  let TOKEN_EXPIERY_TIME = 120000000000; // 2min in nanoseconds

  public func isUserWhitelisted(whitelistedUsers : Buffer.Buffer<Principal>, userId : Principal) : Bool {
    Buffer.contains(
      whitelistedUsers,
      userId,
      func(a : Principal, b : Principal) : Bool { a == b },
    );
  };

  public func isUserAdmin(adminUsers : Buffer.Buffer<Principal>, userId : Principal) : Bool {
    Buffer.contains(
      adminUsers,
      userId,
      func(a : Principal, b : Principal) : Bool { a == b },
    );
  };

  public func createUserToken() : async Types.UserToken {
    let seed = await Random.blob();
    let token = "usr_" # Nat.toText(Random.rangeFrom(128, seed));
    let expireyTime = Time.now() + TOKEN_EXPIERY_TIME;

    { token = token; expireyTime = expireyTime };
  };
};
