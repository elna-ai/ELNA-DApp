import HomePageWizardPlaceholder from "./HomePageWizardPlaceholder";
import PopularWizards from "./PopularWizards";
import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";

function CreateWizards() {
  // To preload all the analytics data
  useGetAllAnalytics();

  return (
    <div className="w-100">
      <HomePageWizardPlaceholder />
      <PopularWizards isHomePage={true}/>
    </div>
  );
}

export default CreateWizards;
