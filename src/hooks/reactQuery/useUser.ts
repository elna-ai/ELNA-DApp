import { Principal } from "@dfinity/principal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUserStore } from "stores/useUser";
import { ONE_HOUR_STALE_TIME, QUERY_KEYS } from "src/constants/query";
import { useWallet } from "hooks/useWallet";
import { Backend, UserProfile } from "declarations/backend/backend.did";
import {
  canisterId as backendId,
  idlFactory as backendFactory,
  backend,
} from "declarations/backend";
import queryClient from "utils/queryClient";

export const useGenerateUserToken = () => {
  const wallet = useWallet();
  const saveUserToken = useUserStore(state => state.setUserToken);

  return useMutation({
    mutationFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const token: string = await backend.generateUserToken();
      return token;
    },
    onSuccess: (token: string) => {
      saveUserToken(token);
    },
    onError: e => {
      console.error(e);
      toast.error(e.message);
    },
  });
};

export const useGetWhitelistedUsers = () => {
  const wallet = useWallet();

  return useQuery({
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );

      const whitelistedUsers = await backend.getWhitelistedUser();
      return whitelistedUsers;
    },
    queryKey: [QUERY_KEYS.WHITELISTED_USERS],
  });
};

export const useDeleteWhitelistedUser = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (principalId: Principal) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const response = await backend.removeWhitelistedUser(principalId);
      return response;
    },
    onSuccess: response => {
      toast.success(response);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WHITELISTED_USERS],
      });
    },
    onError: error => {
      toast.error(error.message);
    },
  });
};

export const useAddWhitelistedUser = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (principalId: Principal) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const response = await backend.whitelistUser(principalId);
      return response;
    },
    onSuccess: response => {
      toast.success(response);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WHITELISTED_USERS],
      });
    },
    onError: error => {
      toast.error(error.message);
    },
  });
};

export const useIsUserAdmin = () => {
  const wallet = useWallet();

  return useQuery({
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const response = await backend.isUserAdmin();
      return response;
    },
    queryKey: [wallet?.principalId, QUERY_KEYS.IS_USER_ADMIN],
    enabled: !!wallet?.principalId,
  });
};

export const useGetUserProfile = (principal?: string) =>
  useQuery({
    queryFn: () => {
      if (!principal) {
        throw new Error("principal not available");
      }

      return backend.getUserProfile(Principal.fromText(principal));
    },
    queryKey: [QUERY_KEYS.USER_PROFILE, principal],
    enabled: !!principal,
    retry: false,
    staleTime: ONE_HOUR_STALE_TIME,
  });

export const useAddUserProfile = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (payload: UserProfile) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const response = await backend.addUserProfile(payload);
      return response;
    },
  });
};

export const useUpdateUserProfile = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (payload: UserProfile) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const response = await backend.updateUserProfile(payload);
      return response;
    },
  });
};
