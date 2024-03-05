import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { elna_RAG_backend as elnaRagBackend } from "declarations/elna_RAG_backend";
import { QUERY_KEYS } from "src/constants/query";
import { isErrGetFileNames } from "utils/ragCanister";

type useChatPayload = {
  agentId: string;
  queryText: string;
  embeddings: [number];
};
export const useChat = () =>
  useMutation({
    mutationFn: ({ agentId, queryText, embeddings }: useChatPayload) =>
      elnaRagBackend.chat(agentId, queryText, embeddings, uuidv4()),
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
    retry: 6,
  });
