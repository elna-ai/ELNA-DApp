import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { ONE_HOUR_STALE_TIME, QUERY_KEYS } from "src/constants/query";
import { isRagErr } from "utils/ragCanister";
import { _SERVICE } from "declarations/elna_RAG_backend/elna_RAG_backend.did";
import {
  elna_RAG_backend as elnaRagBackend,
  canisterId as ragId,
  idlFactory as ragFactory,
} from "declarations/elna_RAG_backend";
import { useWallet } from "hooks/useWallet";
import { convertToMotokoOptional } from "utils/index";

type useChatPayload = {
  agentId: string;
  queryText: string;
  embeddings: [number];
};
export const useChat = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async ({ agentId, queryText, embeddings }: useChatPayload) => {
      if (wallet === undefined || !wallet?.principalId) return;

      const elnaRag: _SERVICE = await wallet.getCanisterActor(
        ragId,
        ragFactory,
        false
      );
      const result = await elnaRag.chat(
        agentId,
        queryText,
        convertToMotokoOptional(embeddings),
        uuidv4()
      );

      return result;
    },
  });
};

export const useGetAgentChatHistory = (agentId: string | undefined) => {
  const wallet = useWallet();

  return useQuery({
    queryKey: [`${QUERY_KEYS.AGENT_CHATS}-${agentId}`, wallet?.principalId],
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const elnaRag: _SERVICE = await wallet.getCanisterActor(
        ragId,
        ragFactory,
        false
      );
      const result = await elnaRag.get_history(agentId!);
      return result;
    },
    staleTime: ONE_HOUR_STALE_TIME,
  });
};

export const useDeleteAgentChatHistory = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (agentId: string | undefined) => {
      if (wallet === undefined || !wallet?.principalId) return;

      const elnaRag: _SERVICE = await wallet.getCanisterActor(
        ragId,
        ragFactory,
        false
      );
      const result = await elnaRag.delete_history(agentId!);

      return result;
    },
  });
};

export const useGetFileNames = (agentId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.WIZARD_FILE_NAMES, agentId],
    queryFn: () => elnaRagBackend.get_db_file_names(agentId),
    enabled: !!agentId,
    select: response => {
      if (isRagErr(response)) {
        throw new Error(Object.keys(response.Err[0]).join());
      }

      return response.Ok;
    },
    retry: 10,
  });

export const useDeleteCollections = () =>
  useMutation({
    mutationFn: (wizardID: string) =>
      elnaRagBackend.delete_collection_from_db(wizardID),
  });
