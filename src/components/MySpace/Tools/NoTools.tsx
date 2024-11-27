import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NoChatWizardImg from "images/no-chatbot.png";

function NoTools() {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-100 py-5 text-center">
        <img className="d-inline" src={NoChatWizardImg} alt="no wizard" />
        <h5>{t("wizards.noWizards")}</h5>
        <p>craft and fine tune...</p>
        <Button variant="outline">
          <Link
            to="/my-space/my-tools/create-tool"
            className="profile__body__roles__button-link"
          >
            List a Tool
          </Link>
        </Button>
      </div>
    </>
  );
}

export default NoTools;
