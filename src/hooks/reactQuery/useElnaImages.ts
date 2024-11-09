import { useQuery } from "@tanstack/react-query";
import { elna_images_backend as elnaImagesBackend } from "declarations/elna_images_backend";
import { DEFAULT_STALE_TIME, QUERY_KEYS } from "src/constants/query";

export const useGetAsset = (id: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEYS.AVATAR_IMAGE, id],
    queryFn: () => elnaImagesBackend.get_asset(id!),
    enabled: !!id,
    select: response => (response.length > 0 ? response[0] : undefined),
    staleTime: DEFAULT_STALE_TIME,
  });
