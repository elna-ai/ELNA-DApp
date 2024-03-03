import { useMutation } from "@tanstack/react-query";
import { elna_RAG_backend as elnaRagBackend } from "declarations/elna_RAG_backend";
import { v4 as uuidv4 } from "uuid";

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
