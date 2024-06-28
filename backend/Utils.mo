import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Text "mo:base/Text";

import Types "Types";

module {
  let TOKEN_EXPIERY_TIME = 120000000000; // 2min in nanoseconds


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

  public func findDeveloper(developerUsers : Buffer.Buffer<Types.Developer>, developerId : Text) : ?Types.Developer {
    Array.find(
      Buffer.toArray(developerUsers),
      func(request : Types.Developer) : Bool {
        request.id == developerId;
      },
    );
  };

  public func findDeveloperIndex(developerUsers : Buffer.Buffer<Types.Developer>, developer : Types.Developer) : ?Nat {
    Buffer.indexOf(
      developer,
      developerUsers,
      func(developer1 : Types.Developer, developer2 : Types.Developer) : Bool {
        developer1.id == developer2.id;
      },
    );
  };

  public func updateDeveloperStatus(developer : Types.Developer, status : Types.DeveloperStatus) : Types.Developer {
    {
      id = developer.id;
      alias = developer.alias;
      email = developer.email;
      github = developer.github;
      principal = developer.principal;
      status = status;
    };
  };

  public func updatePendingDeveloperStatus(request : Types.DeveloperApproval, status : Types.DeveloperApprovalStatus) : Types.DeveloperApproval {
    {
      id = request.id;
      alias = request.alias;
      email = request.email;
      github = request.github;
      description = request.description;
      principal = request.principal;
      status = status;
    };
  };

  public func isCreator(whitelistedUsers : Buffer.Buffer<Principal>, userId : Principal) : Bool {
    Buffer.contains(
      whitelistedUsers,
      userId,
      func(a : Principal, b : Principal) : Bool { a == b },
    );
  };

  public func findCreator(creatorUsers : Buffer.Buffer<Types.Creator>, creatorId : Text) : ?Types.Creator {
    Array.find(
      Buffer.toArray(creatorUsers),
      func(request : Types.Developer) : Bool {
        request.id == creatorId;
      },
    );
  };

  public func findCreatorIndex(creatorUsers : Buffer.Buffer<Types.Creator>, creator : Types.Creator) : ?Nat {
    Buffer.indexOf(
      creator,
      creatorUsers,
      func(creator1 : Types.Creator, creator2 : Types.Creator) : Bool {
        creator1.id == creator2.id;
      },
    );
  };

  public func updateCreatorStatus(creator : Types.Creator, status : Types.CreatorStatus) : Types.Creator {
    {
      id = creator.id;
      alias = creator.alias;
      email = creator.email;
      github = creator.github;
      principal = creator.principal;
      status = status;
    };
  };
};
