import MyWizards from "./MyWizards";
import PopularWizards from "./PopularWizards";
import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";

function CreateWizards() {
  // To preload all the analytics data
  useGetAllAnalytics();

  return (
    <div className="w-100">
      <MyWizards />
      <PopularWizards />
    </div>
  );
}

export default CreateWizards;
