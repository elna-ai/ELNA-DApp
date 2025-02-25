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
import { XAgentIntegration, XAgentIntegrationResponse } from "src/types";

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
        `https://ldlm4nwk5yh6i3zeunvst46shu0rtmxs.lambda-url.eu-north-1.on.aws/integrate/x/${agent_id}`
      ),
    select: response => response.data,
    enabled: !!agent_id,
    staleTime: ONE_HOUR_STALE_TIME,
  });

export const useAddAgentIntegration = () =>
  useMutation({
    mutationFn: (payload: XAgentIntegration) =>
      axios.post<XAgentIntegration>(
        `https://ldlm4nwk5yh6i3zeunvst46shu0rtmxs.lambda-url.eu-north-1.on.aws/integrate/x`,
        // `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/create-agent`,
        payload
      ),
  });

// export const useUpdateAgentIntegration = () =>
//   useMutation({
//     mutationFn: (payload: UpdateAgentIntegrationRequest) =>
//       apiConfig({
//         data: payload,
//         includeAuth: true,
//         method: "POST",
//         url: "/update-agent-integration",
//       }),
//   });
