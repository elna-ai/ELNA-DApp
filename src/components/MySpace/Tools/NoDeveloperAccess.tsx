import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NoChatWizardImg from "images/no-chatbot.png";

function NoDeveloperAccess() {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-100 py-5 text-center">
        <img className="d-inline" src={NoChatWizardImg} alt="no wizard" />
        <h5>No access</h5>
        <p>
          Complete Developer Profile and upload your tools <br /> and integrate
          with agents
        </p>
        <Button>
          <Link to="/my-space/request/developer">
            {t("profile.requestDevAccess")}
          </Link>
        </Button>
      </div>
    </>
  );
}

export default NoDeveloperAccess;
