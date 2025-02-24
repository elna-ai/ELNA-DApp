// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type DetailValue = {
    #I64 : Int64;
    #U64 : Nat64;
    #Vec : [DetailValue];
    #Slice : Blob;
    #Text : Text;
    #True;
    #False;
    #Float : Float;
    #Principal : Principal;
  };
  public type InitalArgs = { owner : Principal; canisterId : Principal };
  public type Log = actor {
    addRecord : shared (Principal, Text, [(Text, DetailValue)]) -> async ();
    getWhitelistedUser : shared () -> async [Principal];
    removeWhitelistedUser : shared Principal -> async Text;
    whitelistUser : shared Principal -> async Text;
  };
  public type Self = InitalArgs -> async Log
}
