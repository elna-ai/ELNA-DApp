import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
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
};
