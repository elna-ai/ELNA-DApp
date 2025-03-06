import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { QUERY_KEYS, ONE_HOUR_STALE_TIME } from "src/constants/query";
import {
  TelegramIntegrationCreate,
  XAgentIntegrationCreate,
  XAgentIntegrationResponse,
  XAgentIntegrationUpdate,
} from "src/types";

export const useGetAgentXIntegrations = (agent_id?: string) =>
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

export const useAddAgentXIntegration = () =>
  useMutation({
    mutationFn: (payload: XAgentIntegrationCreate) =>
      axios.post<XAgentIntegrationCreate>(
        `${import.meta.env.VITE_INTEGRATIONS_BASE}/integrate/x`,
        payload
      ),
  });
export const useUpdateAgentXIntegration = () =>
  useMutation({
    mutationFn: (payload: XAgentIntegrationUpdate) =>
      axios.put<XAgentIntegrationUpdate>(
        `${import.meta.env.VITE_INTEGRATIONS_BASE}/integrate/x`,
        payload
      ),
  });

export const useAddTelegramIntegration = () =>
  useMutation({
    mutationFn: (payload: TelegramIntegrationCreate) =>
      axios.post<TelegramIntegrationCreate>(
        `${import.meta.env.VITE_TELEGRAM_INTEGRATIONS}/integrate/telegram`,
        payload
      ),
  });
