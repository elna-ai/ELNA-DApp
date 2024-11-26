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
                <p>No access</p>
                <p>desc...</p>
                <Button variant="outline">
                    <Link
                        to="/my-space/request/developer"
                        className="profile__body__roles__button-link"
                    >
                        <i className="ri-code-box-fill"></i>
                        {t("profile.requestDevAccess")}
                    </Link>
                </Button>
            </div>
        </>
    );
}

export default NoDeveloperAccess;
