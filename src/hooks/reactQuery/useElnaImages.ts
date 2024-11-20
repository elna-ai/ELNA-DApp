import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  elna_images_backend as elnaImagesBackend,
  canisterId as elnaImagesCanisterId,
  idlFactory as elnaImagesIdlFactory
} from "declarations/elna_images_backend";
import { _SERVICE } from "declarations/elna_images_backend/elna_images_backend.did";
import queryClient from "utils/queryClient";
import { DEFAULT_STALE_TIME, QUERY_KEYS } from "src/constants/query";
import { useWallet } from "hooks/useWallet";
import { Principal } from "@dfinity/principal";
import { toast } from "react-toastify";

type UseUploadCustomImageProps = {
  fileName: string;
  base64Image: string;
};

export const useGetAsset = (id: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEYS.AVATAR_IMAGE, id],
    queryFn: () => elnaImagesBackend.get_asset(id!),
    enabled: !!id,
    select: response => (response.length > 0 ? response[0] : undefined),
    staleTime: DEFAULT_STALE_TIME,
  });


  export const useUploadCustomImage = () => {
    const wallet = useWallet();
    return useMutation({
      mutationFn: async ({
        fileName,
        base64Image,
      }: UseUploadCustomImageProps) => {
        if (wallet === undefined) {
          throw Error("User not logged in");
        }
  
        const imageIdResponse: _SERVICE = await wallet.getCanisterActor(
          elnaImagesCanisterId,
          elnaImagesIdlFactory,
          false
        );
        const response = imageIdResponse.add_asset({
          asset: base64Image,
          owner: Principal.fromText(wallet.principalId),
          file_name: fileName,
        },[])
        return response;
      },
      onSuccess: (fileName) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVATAR_IMAGE, fileName] });
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };
  
  export const useDeleteCustomImage = () => {
    const wallet = useWallet();
    return useMutation({
      mutationFn: async (fileName: string) => {
        if (wallet === undefined) {
          throw Error("User not logged in");
        }
  
        const imageIdResponse: _SERVICE = await wallet.getCanisterActor(
          elnaImagesCanisterId,
          elnaImagesIdlFactory,
          false
        );
        const response = imageIdResponse.delete_asset(fileName);
        return response;
      },
      onSuccess: () => {
      },
      onError: error => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };
  