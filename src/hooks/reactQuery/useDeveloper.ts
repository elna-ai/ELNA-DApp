import { useMutation, useQuery } from "@tanstack/react-query";
import { useWallet } from "hooks/useWallet";
import { Backend, DeveloperApproval } from "declarations/backend/backend.did";
import {
  canisterId as backendId,
  idlFactory as backendFactory,
  backend,
} from "declarations/backend";
import { ONE_HOUR_STALE_TIME, QUERY_KEYS } from "src/constants/query";
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
      return result;
    },
    queryKey: [QUERY_KEYS.IS_USER_DEVELOPER, wallet?.principalId],
    enabled: !!wallet?.principalId,
    staleTime: ONE_HOUR_STALE_TIME,
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

export const useGetUserRequest = () => {
  const wallet = useWallet();

  return useQuery({
    queryKey: [QUERY_KEYS.USER_PENDING_REQUEST],
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.getUserRequests();
      return result;
    },
    staleTime: ONE_HOUR_STALE_TIME,
  });
};

export const useDisableDeveloper = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (developerId: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.revokeDeveloperAccess(developerId);
      return result;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DEVELOPERS_LIST],
      }),
  });
};

export const useEnableDeveloper = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (developerId: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.enableDeveloperAccess(developerId);
      return result;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DEVELOPERS_LIST],
      }),
  });
};
