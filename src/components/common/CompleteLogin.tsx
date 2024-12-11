import Modal from "react-bootstrap/Modal";
import { LoginButtonWrapper } from "./LoginButtonWrapper";
import ConnectWalletImg from "images/connectwallet.svg";
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
          {t("completeLogin.modalHeaderTitle")}
        </h3>
      </Modal.Header>
      <Modal.Body className="text-center my-5">
        <img className="d-inline mb-3" src={ConnectWalletImg} alt="no wizard" />
        <h6 className="text-center mb-0">{t("completeLogin.modalTitle")}</h6>
        <p>{t("completeLogin.modalDesc")}</p>
        <LoginButtonWrapper>
          <Button variant="primary">{t("completeLogin.modalBtn")}</Button>
        </LoginButtonWrapper>
      </Modal.Body>
    </>
  );
}

export default CompleteProfile;
