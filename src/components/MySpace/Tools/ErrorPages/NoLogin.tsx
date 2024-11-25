import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NoChatWizardImg from "images/no-chatbot.png";

function NoLogin() {
    const { t } = useTranslation();

    return (
        <>
            <div className="w-100 py-5 text-center">
                <img className="d-inline" src={NoChatWizardImg} alt="no wizard" />
                <p>Not Logged in</p>
                <p>Connect wallet and login to continue</p>
            </div>
        </>
    );
}

export default NoLogin;
