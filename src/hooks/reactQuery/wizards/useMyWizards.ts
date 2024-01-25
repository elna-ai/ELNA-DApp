import { useMutation, useQuery } from "@tanstack/react-query";
import {
  canisterId,
  idlFactory,
  wizard_details,
} from "declarations/wizard_details";
import {
  Main,
  Response,
  WizardDetails,
} from "declarations/wizard_details/wizard_details.did";
import { QUERY_KEYS } from "src/constants/query";
import queryClient from "utils/queryClient";
import { useWallet } from "hooks/useWallet";
import { toast } from "react-toastify";

type useFetchMyWizardsProps = {
  userId: string | undefined;
};

type useDeleteMyWizardsProps = {
  wizardId: string;
};

type usePublishUnpublishWizardMutationProps = {
  wizardId: string;
  shouldPublish: boolean;
};

export const useFetchMyWizards = ({ userId }: useFetchMyWizardsProps) =>
  useQuery({
    queryKey: [QUERY_KEYS.MY_WIZARDS_LIST, userId],
    queryFn: () => wizard_details.getUserWizards(userId!),
    enabled: !!userId,
  });

export const useDeleteMyWizard = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async ({
      wizardId,
    }: useDeleteMyWizardsProps): Promise<Response | undefined> => {
      if (wallet === undefined) {
        return { status: 422n, message: "User not logged in" };
      }
      const wizardDetails = await wallet.getCanisterActor(
        canisterId,
        idlFactory,
        false
      );
      const response: Response = await wizardDetails.deleteWizard(wizardId);
      return response;
    },
    onSuccess: (response: Response | undefined) => {
      if (response === undefined) {
        toast.error("Unable to delete agent");
        return;
      }

      if (response.status !== 200n) {
        toast.error(response.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_WIZARDS_LIST] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POPULAR_WIZARDS_LIST],
      });
      toast.success(response.message);
    },
    onError: error => {
      toast.error(error.message);
      console.error(error);
    },
  });
};

export const useAddWizard = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (payload: WizardDetails) => {
      if (wallet === undefined) {
        throw Error("User not logged in");
      }

      const wizardDetails: Main = await wallet.getCanisterActor(
        canisterId,
        idlFactory,
        false
      );
      const response: Response = await wizardDetails.addWizard(payload);
      return response;
    },
    onSuccess: response => {
      if (response === undefined) {
        toast.error("Unable to delete agent");
        return;
      }

      if (response.status !== 200n) {
        toast.error(response.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_WIZARDS_LIST] });
      toast.success(response.message);
    },
    onError: error => {
      toast.error(error.message);
      console.error(error);
    },
  });
};

export const useIsWizardNameValid = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (name: string) => {
      if (wallet === undefined) {
        throw Error("User not logged in");
      }

      const wizardDetails: Main = await wallet.getCanisterActor(
        canisterId,
        idlFactory,
        false
      );

      const response = await wizardDetails.isWizardNameValid(name);
      return response;
    },
  });
};

export const usePublishUnpublishWizard = () => {
  const wallet = useWallet();
  return useMutation({
    mutationFn: async ({
      wizardId,
      shouldPublish,
    }: usePublishUnpublishWizardMutationProps) => {
      if (wallet === undefined) {
        throw Error("User not logged in");
      }

      const wizardDetails: Main = await wallet.getCanisterActor(
        canisterId,
        idlFactory,
        false
      );
      const response = shouldPublish
        ? await wizardDetails.publishWizard(wizardId)
        : await wizardDetails.unpublishWizard(wizardId);
      if (response.status !== 200n) {
        throw Error(response.message);
      }
      return response;
    },
    onSuccess: response => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POPULAR_WIZARDS_LIST],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_WIZARDS_LIST] });
    },
    onError: error => toast.error(error.message),
  });
};
