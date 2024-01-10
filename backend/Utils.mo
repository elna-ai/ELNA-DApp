import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";

module {
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
};
