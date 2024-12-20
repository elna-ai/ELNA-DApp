import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { elna_RAG_backend as elnaRagBackend } from "declarations/elna_RAG_backend";
import { QUERY_KEYS } from "src/constants/query";
import { isRagErr } from "utils/ragCanister";
import {
  History,
  _SERVICE,
} from "declarations/elna_RAG_backend/elna_RAG_backend.did";
import {
  canisterId as ragId,
  idlFactory as ragFactory,
} from "declarations/elna_RAG_backend";
import { useWallet } from "hooks/useWallet";

type useChatPayload = {
  agentId: string;
  queryText: string;
  embeddings: [number];
  history: [History, History][];
};
export const useChat = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async ({
      agentId,
      queryText,
      embeddings,
      history,
    }: useChatPayload) => {
      if (wallet === undefined || !wallet?.principalId) {
        return elnaRagBackend.chat(
          agentId,
          queryText,
          embeddings,
          uuidv4(),
          history
        );
      }

      const elnaRag: _SERVICE = await wallet.getCanisterActor(
        ragId,
        ragFactory,
        false
      );
      const result = await elnaRag.chat(
        agentId,
        queryText,
        embeddings,
        uuidv4(),
        history
      );

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
