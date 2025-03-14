import { useMutation, useQuery } from "@tanstack/react-query";
import {
  wizard_details as wizardDetails,
  canisterId,
  idlFactory,
} from "declarations/wizard_details";
import { Main } from "declarations/wizard_details/wizard_details.did";
import { useWallet } from "hooks/useWallet";
import { QUERY_KEYS, ONE_HOUR_STALE_TIME } from "src/constants/query";
import {
  XAgentIntegrationCreate,
  XAgentIntegrationResponse,
  XAgentIntegrationUpdate,
} from "src/types";

type useShowWizardProps = string | undefined;
export const useShowWizard = (wizardId: useShowWizardProps) =>
  useQuery({
    queryFn: () => wizardDetails.getWizard(wizardId!),
    queryKey: [wizardId],
    enabled: !!wizardId,
    select: data => data[0],
    staleTime: ONE_HOUR_STALE_TIME,
  });

export const useFetchAllWizards = () => {
  const wallet = useWallet();
  return useQuery({
    queryFn: async () => {
      if (wallet === undefined) {
        throw Error("User not logged in");
      }

      const wizardDetails: Main = await wallet.getCanisterActor(
        canisterId,
        idlFactory,
        false
      );

      const response = await wizardDetails.getAllWizards();
      return response;
    },
    queryKey: [QUERY_KEYS.ALL_WIZARDS],
  });
};
