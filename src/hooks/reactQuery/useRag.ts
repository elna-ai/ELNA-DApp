import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { elna_RAG_backend as elnaRagBackend } from "declarations/elna_RAG_backend";
import { QUERY_KEYS } from "src/constants/query";
import { isErrGetFileNames } from "utils/ragCanister";
import { History } from "declarations/elna_RAG_backend/elna_RAG_backend.did";

type useChatPayload = {
  agentId: string;
  queryText: string;
  embeddings: [number];
  history: History[];
};
export const useChat = () =>
  useMutation({
    mutationFn: ({ agentId, queryText, embeddings, history }: useChatPayload) =>
      elnaRagBackend.chat(agentId, queryText, embeddings, uuidv4(), history),
  });

export const useGetFileNames = (agentId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.WIZARD_FILE_NAMES, agentId],
    queryFn: () => elnaRagBackend.get_file_names(agentId),
    enabled: !!agentId,
    select: response => {
      if (isErrGetFileNames(response)) {
        throw new Error(Object.keys(response.Err[0]).join());
      }

      return response.Ok;
    },
    retry: 10,
  });

export const useDeleteCollections = () =>
  useMutation({
    mutationFn: (wizardID: string) =>
      elnaRagBackend.delete_collections_(wizardID),
  });
