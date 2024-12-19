import WizardPlaceholder from "./WizardPlaceholder";
import PopularWizards from "./PopularWizards";
import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";
import MetaTags from "components/common/MetaHelmet";
import { useTranslation } from "react-i18next";

function CreateWizards() {
  // To preload all the analytics data
  useGetAllAnalytics();
  const { t } = useTranslation();

  return (
    <>
      <MetaTags
        title={t("meta.home.title")}
        description={t("meta.home.description")}
      />
      <div className="w-100">
        <WizardPlaceholder />
        <PopularWizards isHomePage={true} />
      </div>
    </>
  );
}

export default CreateWizards;
