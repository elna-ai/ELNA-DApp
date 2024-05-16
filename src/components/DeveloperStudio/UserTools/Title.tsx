import { useTranslation } from "react-i18next";

function Title() {
  const { t } = useTranslation();

  return (
    <div className="mt-5">
      <h5 className="flex gap-2">
        <i className="ri-bard-fill" style={{ color: "#64CD8A" }}></i>
        <span>{t("developerStudio.myTools")}</span>
      </h5>
    </div>
  );
}
export default Title;
