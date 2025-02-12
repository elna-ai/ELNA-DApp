import { useMutation, useQuery } from "@tanstack/react-query";
import { wizard_details as wizardDetails } from "declarations/wizard_details";
import { Analytics_V2_External } from "declarations/wizard_details/wizard_details.did";
import { useWallet } from "hooks/useWallet";
import { canisterId, idlFactory } from "declarations/wizard_details";
import { Main } from "declarations/wizard_details/wizard_details.did";

import { ONE_HOUR_STALE_TIME, QUERY_KEYS } from "src/constants/query";

export const useGetAllAnalytics = () =>
  useQuery({
    queryKey: [QUERY_KEYS.ALL_ANALYTICS],
    queryFn: () => wizardDetails.getAllAnalytics(),
    select: data => {
      const analytics: { [key: string]: Analytics_V2_External } = {};
      if (data?.length === 0) {
        return analytics;
      }

      data.forEach(analytic => {
        analytics[analytic[0]] = analytic[1];
      });
      return analytics;
    },
    staleTime: ONE_HOUR_STALE_TIME,
  });

export const useUpdateMessagesReplied = () => {
  const wallet = useWallet();

  return useMutation({
    mutationKey: ["update-messages-replied"],
    mutationFn: async (wizardId: string) => {
      if (wallet === undefined) {
        throw Error("User not logged in");
      }

      const wizardDetails: Main = await wallet.getCanisterActor(
        canisterId,
        idlFactory,
        false
      );
      const response = await wizardDetails.updateMessageAnalytics(wizardId);
      return response;
    },
    onError: error => console.error(error.message),
  });
};
