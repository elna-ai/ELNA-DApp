import { Button } from "react-bootstrap";
import { LoginButtonWrapper } from "components/common/LoginButtonWrapper";
import { useTranslation } from "react-i18next";
import NoChatWizardImg from "images/no-chatbot.png";

function NoLogin() {
    const { t } = useTranslation();

    return (
        <>
            <div className="w-100 py-5 text-center">
                <img className="d-inline" src={NoChatWizardImg} alt="no wizard" />
                <p>Not Logged in</p>
                <LoginButtonWrapper>
                    <Button variant="primary">Connect Wallet to continue</Button>
                </LoginButtonWrapper>
            </div>
        </>
    );
}

export default NoLogin;