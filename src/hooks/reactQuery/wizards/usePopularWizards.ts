import { useQuery } from "@tanstack/react-query";
import { wizard_details } from "declarations/wizard_details";
import {  QUERY_KEYS } from "src/constants/query";



export const useFetchPopularWizards = () => useQuery({
  queryKey:[QUERY_KEYS.POPULAR_WIZARDS_LIST],
  queryFn:() =>wizard_details.getWizards(),
});
