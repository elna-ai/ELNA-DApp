import { copyToClipBoard, generateTwitterShareLink } from "utils/index";
import { TWITTER_SHARE_CONTENT } from "../constants";
import { useTranslation } from "react-i18next";

type PersonaProps = {
  name: string;
  id: string;
};
function Persona({ name, id }: PersonaProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h5>{t("agentOverView.personaTab.directUrl")}</h5>
      <span>{t("agentOverView.personaTab.urlDescription")}</span>
      <div className="d-flex gap-2">
        <div className="wizard-modal__persona__share">
          <span>{window.location.toString()}</span>
          <span className="wizard-modal__persona__share__copy">
            <i
              className="ri-links-line"
              onClick={() =>
                copyToClipBoard({
                  text: window.location.toString(),
                  successMsg: "Copied url to clipboard",
                  errorMsg: "Failed to copy url to clipboard",
                })
              }
            ></i>
            {t("common.copy")}
          </span>
        </div>
        <a
          className="el-btn-secondary"
          href={generateTwitterShareLink(
            `${TWITTER_SHARE_CONTENT(
              name,
              `${window.location.origin}/chat/${id}`
            )}`
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ri-share-forward-fill"></i>
          <span className="text-xs sub-title-color">{t("common.share")}</span>
        </a>
      </div>
    </div>
  );
}
export default Persona;
