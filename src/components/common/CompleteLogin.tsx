import Modal from "react-bootstrap/Modal";
import { LoginButtonWrapper } from "./LoginButtonWrapper";
import NoChatWizardImg from "images/no-chatbot.png";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function CompleteProfile() {
    const { t } = useTranslation();

    return (
        <>
            <Modal.Header
                closeButton
                className="d-flex align-items-center justify-content-center"
            >
                <h3 className="w-100 sub-title text-center">
                    Complete Login
                </h3>
            </Modal.Header>
            <Modal.Body className="text-center">
                <img className="d-inline" src={NoChatWizardImg} alt="no wizard" />
                <p>Not Logged in</p>
                <LoginButtonWrapper>
                    <Button variant="primary">Connect Wallet to continue</Button>
                </LoginButtonWrapper>
            </Modal.Body>
        </>
    );
}

export default CompleteProfile;
