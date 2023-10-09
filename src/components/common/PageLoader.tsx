import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function PageLoader() {
  const { t } = useTranslation();

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="flex flex-col items-center">
        <Spinner />
        <div>{t("common.loadingPage")}</div>
      </div>
    </div>
  );
}

export default PageLoader;
