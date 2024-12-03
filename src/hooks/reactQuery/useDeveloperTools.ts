import { useMutation, useQuery } from "@tanstack/react-query";

import {
  canisterId as DeveloperStudioId,
  idlFactory as developerStudioFactory,
  developer_studio as developerStudio,
} from "declarations/developer_studio";
import {
  DeveloperStudio,
  DeveloperTool,
} from "declarations/developer_studio/developer_studio.did";
import { useWallet } from "hooks/useWallet";
import { QUERY_KEYS } from "src/constants/query";
import queryClient from "utils/queryClient";

type useShowToolProps = string | undefined;
export const useShowTool = (toolId: useShowToolProps) =>
  useQuery({
    queryFn: () => developerStudio.getTool(toolId!),
    queryKey: [QUERY_KEYS.PUBLIC_TOOLS_LIST, toolId],
    enabled: !!toolId,
  });

export const useGetApprovedTools = () =>
  useQuery({
    queryKey: [QUERY_KEYS.APPROVED_DEVELOPER_TOOLS],
    queryFn: () => developerStudio.getApprovedTools(),
  });

export const useGetDeveloperTools = () => {
  const wallet = useWallet();

  return useQuery({
    queryKey: [QUERY_KEYS.DEVELOPER_TOOLS],
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const developerStudio: DeveloperStudio = await wallet.getCanisterActor(
        DeveloperStudioId,
        developerStudioFactory,
        false
      );
      const result = await developerStudio.getTools();
      return result;
    },
  });
};

export const useApproveTool = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (id: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const developerStudio: DeveloperStudio = await wallet.getCanisterActor(
        DeveloperStudioId,
        developerStudioFactory,
        false
      );
      const result = await developerStudio.approvePendingDeveloperTool(id);
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

      const developerStudio: DeveloperStudio = await wallet.getCanisterActor(
        DeveloperStudioId,
        developerStudioFactory,
        false
      );
      const result = await developerStudio.rejectDeveloperTool(id);
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

      const developerStudio: DeveloperStudio = await wallet.getCanisterActor(
        DeveloperStudioId,
        developerStudioFactory,
        false
      );
      const result = await developerStudio.getTools();
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

      const developerStudio: DeveloperStudio = await wallet.getCanisterActor(
        DeveloperStudioId,
        developerStudioFactory,
        false
      );
      const result = await developerStudio.requestToolSubmission(toolDetails);
      return result;
    },
  });
};
