import { useQuery } from "@tanstack/react-query";
import { wizard_details } from "declarations/wizard_details";
import {  QUERY_KEYS, ONE_HOUR_STALE_TIME } from "src/constants/query";

export const useFetchPublicWizards = () => useQuery({
  queryKey:[QUERY_KEYS.PUBLIC_WIZARDS_LIST],
  queryFn:() =>wizard_details.getWizards(),
  staleTime: ONE_HOUR_STALE_TIME
});
