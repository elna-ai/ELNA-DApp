import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "Types";

module {
  public func updateModificationAnalytics(wizardId : Text, changesCount : Nat, analytics : HashMap.HashMap<Text, Types.Analytics>) {
    switch (analytics.get(wizardId)) {
      case (?analytic) {
        switch (analytic) {
          case (#v1(data)) {
            analytics.put(
              wizardId,
              #v2 {
                messagesReplied = data.messagesReplied;
                uniqueUsers = [];
                modificationCount = changesCount;
              },
            );
          };
          case (#v2(data)) {
            analytics.put(
              wizardId,
              #v2 {
                data with
                modificationCount = data.modificationCount + changesCount;
              },
            );
          };
        };
      };
      case (null) {
        analytics.put(
          wizardId,
          #v2 {
            messagesReplied = 0;
            uniqueUsers = [];
            modificationCount = changesCount;
          },
        );
      };
    };
  };

  public func logCycleUsage({
    initial : Nat;
    final : Nat;
    functionName : Text;
    agentId : Text;
    caller : Principal;
    benchmark : [Types.Benchmark];
  }) : [Types.Benchmark] {
    let cyclesUsed : Nat = initial - final;
    let finalMessage = "fn:" # debug_show (functionName) # "amount: " # debug_show (cyclesUsed) # ".message:";
    Debug.print("CYCLES USED: " # finalMessage);
    let newBenchmark : Types.Benchmark = {
      agentId;
      functionName;
      caller;
      cyclesUsed;
      timeStamp = Time.now();
    };
    return Array.append(benchmark, [newBenchmark]);

  };
};
