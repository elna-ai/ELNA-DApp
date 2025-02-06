// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type Asset = { asset : Text; owner : Principal; file_name : Text };
  public type Error = {
    #UnableToReadLastId;
    #NotFound;
    #Unauthorized;
    #UnableToDelete;
    #UnableToUpdate;
    #UploaderMismatch;
  };
  public type Result = { #Ok : Text; #Err : Error };
  public type Result_1 = { #Ok : [(Text, Asset)]; #Err : Error };
  public type Result_2 = { #Ok : Nat64; #Err : Error };
  public type Self = Principal -> async actor {
    add_asset : shared (Asset, ?Text) -> async Result;
    delete_asset : shared Text -> async Result;
    get_all_assets : shared query () -> async Result_1;
    get_asset : shared query Text -> async ?Asset;
    get_assets_length : shared query () -> async Result_2;
    get_last_id : shared query () -> async Result;
    get_owner : shared query () -> async Text;
    set_last_id : shared Text -> async Result;
  }
}
