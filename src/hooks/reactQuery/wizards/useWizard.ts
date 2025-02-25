import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
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

export const useGetAgentIntegrations = (agent_id?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS, agent_id],
    queryFn: () =>
      axios.get<any, AxiosResponse<XAgentIntegrationResponse>>(
        `${import.meta.env.VITE_INTEGRATIONS_BASE}/integrate/x/${agent_id}`
      ),
    select: response => response.data,
    enabled: !!agent_id,
    staleTime: ONE_HOUR_STALE_TIME,
    retry: 0,
  });

export const useAddAgentIntegration = () =>
  useMutation({
    mutationFn: (payload: XAgentIntegrationCreate) =>
      axios.post<XAgentIntegrationCreate>(
        `${import.meta.env.VITE_INTEGRATIONS_BASE}/integrate/x`,
        payload
      ),
  });
export const useUpdateAgentIntegration = () =>
  useMutation({
    mutationFn: (payload: XAgentIntegrationUpdate) =>
      axios.put<XAgentIntegrationUpdate>(
        `${import.meta.env.VITE_INTEGRATIONS_BASE}/integrate/x`,
        payload
      ),
  });
