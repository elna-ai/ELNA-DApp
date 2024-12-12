import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import NoAccessImage from "images/no-access.webp";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CompleteProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Modal.Header
        closeButton
        className="d-flex align-items-center justify-content-center"
      >
        <h3 className="w-100 sub-title text-center">
          {t("createAgent.completeProfile.modalTitle")}
        </h3>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img
          className="mx-auto d-block"
          src={NoAccessImage}
          alt="No-permission-Elna"
          width={180}
        />
        <p className="mb-0">{t("createAgent.completeProfile.title")}</p>
        <p>{t("createAgent.completeProfile.gainAccess")}</p>
        <Button onClick={() => navigate("/profile/add")}>
          {t("common.update", { entity: "profile" })}
        </Button>
      </Modal.Body>
    </>
  );
}

export default CompleteProfile;
