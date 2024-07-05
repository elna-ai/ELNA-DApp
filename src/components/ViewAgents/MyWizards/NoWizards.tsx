import { useTranslation } from "react-i18next";
import NoChatWizardImg from "images/no-chatbot.png";
import Title from "./Title";

function NoWizards() {
  const { t } = useTranslation();

  return (
    <>
      <Title />
      <div className="w-100 py-5 text-center">
        <img className="d-inline" src={NoChatWizardImg} alt="no wizard" />
        <p>{t("wizards.noWizards")}</p>
      </div>
    </>
  );
}

export default NoWizards;
