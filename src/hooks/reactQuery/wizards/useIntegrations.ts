import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { QUERY_KEYS, ONE_HOUR_STALE_TIME } from "src/constants/query";
import {
  TelegramAgentIntegrationResponse,
  TelegramIntegrationCreate,
  XAgentIntegrationCreate,
  XAgentIntegrationResponse,
  XAgentIntegrationUpdate,
} from "src/types";

type useLoginMutationProps = {
  token: string;
  principalId: string;
};

type IntegrationAPIError = AxiosError<{ error?: string }>;

export const useGetAgentXIntegrations = (agent_id?: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS, agent_id],
    queryFn: () =>
      axios.get<any, AxiosResponse<XAgentIntegrationResponse>>(
        `${import.meta.env.VITE_INTEGRATIONS_BASE}/integrate/x/${agent_id}`,
        { headers: { Authorization: Cookies.get("integrations_token") } }
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
        payload,
        { headers: { Authorization: Cookies.get("integrations_token") } }
      ),
  });
export const useUpdateAgentXIntegration = () =>
  useMutation({
    mutationFn: (payload: XAgentIntegrationUpdate) =>
      axios.put<XAgentIntegrationUpdate>(
        `${import.meta.env.VITE_INTEGRATIONS_BASE}/integrate/x`,
        payload,
        { headers: { Authorization: Cookies.get("integrations_token") } }
      ),
  });

export const useAddTelegramIntegration = () =>
  useMutation({
    mutationFn: (payload: TelegramIntegrationCreate) =>
      axios.post<TelegramIntegrationCreate>(
        `${import.meta.env.VITE_TELEGRAM_INTEGRATIONS}/integrate/telegram`,
        payload,
        { headers: { Authorization: Cookies.get("integrations_token") } }
      ),
    onError: (error: AxiosError<{ error?: string }>) => {
      const errorMsg =
        error.response?.data.error || error.message || "Something went wrong";
      console.log(error);
      toast.error(errorMsg);
    },
  });

export const useGetTelegramIntegration = (agentId?: string) =>
  useQuery({
    queryFn: () =>
      axios.get<any, AxiosResponse<TelegramAgentIntegrationResponse>>(
        `${
          import.meta.env.VITE_TELEGRAM_INTEGRATIONS
        }/integrate/telegram/${agentId}`,
        { headers: { Authorization: Cookies.get("integrations_token") } }
      ),
    queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS_TELEGRAM, agentId],
    enabled: !!agentId,
    select: response => {
      const { integrations, ...data } = response.data;
      let telegram = integrations?.find(
        integration => integration.integration_type === "TELEGRAM"
      );
      return { ...data, integration_id: telegram?.integration_id };
    },
  });

export const useUpdateTelegramIntegration = () =>
  useMutation({
    mutationFn: ({
      integrationId,
      payload,
    }: {
      integrationId: string;
      payload: { telegram_api_key: string; agent_id: string };
    }) =>
      axios.put(
        `${
          import.meta.env.VITE_TELEGRAM_INTEGRATIONS
        }/integrate/telegram/${integrationId}`,
        payload,
        { headers: { Authorization: Cookies.get("integrations_token") } }
      ),
    onError: (error: IntegrationAPIError) => {
      const errorMsg =
        error.response?.data.error || error.message || "Something went wrong";
      console.error(error);
      toast.error(errorMsg);
    },
  });

export const useIntegrationsLogin = () =>
  useMutation({
    mutationFn: ({ token, principalId }: useLoginMutationProps) => {
      return axios.post(`${import.meta.env.VITE_INTEGRATIONS_BASE}/login`, {
        principal_id: principalId,
        user_token: token,
      });
    },
    onSuccess: ({ data }) =>
      Cookies.set("integrations_token", data.token, { secure: true }),
    onError: (error: IntegrationAPIError) => {
      const errorMsg =
        error.response?.data.error || error.message || "Something went wrong";
      console.error(error);
      toast.error(errorMsg);
    },
  });
