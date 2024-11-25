import CheckWizardNameCreateModal from "components/common/CheckWizardNameCreate";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NoChatWizardImg from "images/no-chatbot.png";

function NoWizards() {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-100 py-5 text-center">
        <img className="d-inline" src={NoChatWizardImg} alt="no wizard" />
        <p>{t("wizards.noWizards")}</p>
        <p>craft and fine tune...</p>
        <CheckWizardNameCreateModal>
          <Button>Create Agent</Button>
        </CheckWizardNameCreateModal>
      </div>
    </>
  );
}

export default NoWizards;
