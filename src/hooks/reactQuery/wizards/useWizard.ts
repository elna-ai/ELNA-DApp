import { useQuery } from "@tanstack/react-query";
import { wizard_details as wizardDetails } from "declarations/wizard_details";
import { QUERY_KEYS } from "src/constants/query";

type useShowWizardProps = string | undefined;
export const useShowWizard = (wizardId: useShowWizardProps) =>
  useQuery({
    queryFn: () => wizardDetails.getWizard(wizardId!),
    queryKey: [QUERY_KEYS.POPULAR_WIZARDS_LIST, wizardId],
    enabled: !!wizardId,
    select: data => data[0],
  });
