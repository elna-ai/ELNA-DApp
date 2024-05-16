import { useMutation, useQuery } from "@tanstack/react-query";

import {
  canisterId as backendId,
  idlFactory as backendFactory,
  backend,
} from "declarations/backend";
import { Backend, DeveloperTool } from "declarations/backend/backend.did";
import { useWallet } from "hooks/useWallet";
import { QUERY_KEYS } from "src/constants/query";
import queryClient from "utils/queryClient";

export const useGetApprovedTools = () =>
  useQuery({
    queryKey: [QUERY_KEYS.APPROVED_DEVELOPER_TOOLS],
    queryFn: () => backend.getApprovedTools(),
  });

export const useGetDeveloperTools = () => {
  const wallet = useWallet();

  return useQuery({
    queryKey: [QUERY_KEYS.DEVELOPER_TOOLS],
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.getTools();
      return result;
    },
  });
};

export const useApproveTool = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (id: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.approvePendingDeveloperTool(id);
      return result;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVELOPER_TOOLS] }),
  });
};

export const useRejectTool = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (id: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.rejectDeveloperTool(id);
      return result;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVELOPER_TOOLS] }),
  });
};

export const useGetUserTools = () => {
  const wallet = useWallet();

  return useQuery({
    queryKey: [QUERY_KEYS.DEVELOPER_TOOLS, wallet?.principalId],
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.getTools();
      return result;
    },
    enabled: !!wallet?.principalId,
  });
};

export const useRequestDeveloperTool = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (toolDetails: DeveloperTool) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.requestToolSubmission(toolDetails);
      return result;
    },
  });
};
