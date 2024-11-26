import WizardPlaceholder from "./WizardPlaceholder";
import PopularWizards from "./PopularWizards";
import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";

function CreateWizards() {
  // To preload all the analytics data
  useGetAllAnalytics();

  return (
    <div className="w-100">
      <WizardPlaceholder />
      <PopularWizards isHomePage={true}/>
    </div>
  );
}

export default CreateWizards;
