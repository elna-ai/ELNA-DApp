import { useMutation, useQuery } from "@tanstack/react-query";
import { useWallet } from "hooks/useWallet";
import { Backend, DeveloperApproval } from "declarations/backend/backend.did";
import {
  canisterId as backendId,
  idlFactory as backendFactory,
  backend,
} from "declarations/backend";
import { QUERY_KEYS } from "src/constants/query";
import queryClient from "utils/queryClient";

export const useIsDeveloper = () => {
  const wallet = useWallet();

  return useQuery({
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.isDeveloper();
      console.log({ result });
      return result;
    },
    queryKey: [QUERY_KEYS.IS_USER_DEVELOPER, wallet?.principalId],
    enabled: !!wallet?.principalId,
  });
};

export const useRequestDeveloperAccess = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (details: DeveloperApproval) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.requestDeveloperAccess(details);
      console.log({ result });
      return result;
    },
  });
};

export const useGetPendingDeveloperRequest = () =>
  // TODO: only admin should be able to view this endpoint
  useQuery({
    queryFn: () => backend.getPendingDevelopers(),
    queryKey: [QUERY_KEYS.PENDING_DEVELOPER_REQUEST],
  });

export const useApproveDeveloper = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (requestId: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.approvePendingDeveloper(requestId);
      console.log({ result });
      return result;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PENDING_DEVELOPER_REQUEST],
      }),
  });
};

export const useRejectDeveloper = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (requestId: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.rejectPendingDeveloper(requestId);
      console.log({ result });
      return result;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PENDING_DEVELOPER_REQUEST],
      }),
  });
};

export const useGetDevelopers = () =>
  useQuery({
    queryFn: () => backend.getDevelopers(),
    queryKey: [QUERY_KEYS.DEVELOPERS_LIST],
  });
