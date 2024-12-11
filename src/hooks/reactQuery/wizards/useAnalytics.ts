import { useMutation, useQuery } from "@tanstack/react-query";
import { wizard_details as wizardDetails } from "declarations/wizard_details";
import { ONE_HOUR_STALE_TIME, QUERY_KEYS } from "src/constants/query";

export const useGetAllAnalytics = () =>
  useQuery({
    queryKey: [QUERY_KEYS.ALL_ANALYTICS],
    queryFn: () => wizardDetails.getAllAnalytics(),
    select: data => {
      const analytics: { [key: string]: { messagesReplied: bigint } } = {};
      if (data?.length === 0) {
        return analytics;
      }

      data.forEach(analytic => {
        analytics[analytic[0]] = analytic[1].v1;
      });
      return analytics;
    },
    staleTime: ONE_HOUR_STALE_TIME,
  });

export const useUpdateMessagesReplied = () =>
  useMutation({
    mutationKey: ["update-messages-replied"],
    mutationFn: (wizardId: string) =>
      wizardDetails.updateMessageAnalytics(wizardId),
    onError: error => console.error(error.message),
  });
