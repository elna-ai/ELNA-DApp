import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation, Trans } from "react-i18next";
import LoadingButton from "components/common/LoadingButton";

type DeleteWizardModalProps = {
  isOpen: boolean;
  onHide: () => void;
  wizardName: string | undefined;
  isDeleting: boolean;
  handleDelete: () => void;
};

function DeleteWizardModal({
  isOpen,
  onHide,
  wizardName,
  isDeleting,
  handleDelete,
}: DeleteWizardModalProps) {
  const { t } = useTranslation();

  return (
    <Modal show={isOpen} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("common.delete", { entity: "agent" })}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Trans
            i18nKey="common.deleteConfirmation"
            components={{
              bold: <span className="fw-bold" />,
            }}
            values={{
              entity: wizardName,
            }}
          />
        </div>
        <div className="mt-2 d-flex gap-2">
          <LoadingButton
            label={t("common.delete", { entity: "agent" })}
            isDisabled={isDeleting}
            isLoading={isDeleting}
            variant="danger"
            onClick={handleDelete}
          />
          <Button
            type="reset"
            variant="link"
            disabled={isDeleting}
            onClick={() => onHide()}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteWizardModal;
