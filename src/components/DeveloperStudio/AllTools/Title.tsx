import { useTranslation } from "react-i18next";

function Title() {
  const { t } = useTranslation();

  return (
    <div>
      <h5 className="flex gap-2">
        <i className="ri-paint-brush-fill" style={{ color: "#64CD8A" }}></i>
        <span>{t("developerStudio.toolsMarketplace")}</span>
      </h5>
      <p>{t("developerStudio.toolsMarketplaceDesc")}</p>
    </div>
  );
}

export default Title;
