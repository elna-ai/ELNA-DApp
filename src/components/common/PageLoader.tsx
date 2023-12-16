import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function PageLoader() {
  const { t } = useTranslation();

  return (
    <div className="page-loader">
      <div className="page-loader__content">
        <Spinner />
        <div>{t("common.loadingPage")}</div>
      </div>
    </div>
  );
}

export default PageLoader;
