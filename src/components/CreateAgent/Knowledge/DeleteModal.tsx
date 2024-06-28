import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation, Trans } from "react-i18next";
import { toast } from "react-toastify";

import LoadingButton from "components/common/LoadingButton";
import queryClient from "utils/queryClient";
import { QUERY_KEYS } from "src/constants/query";
import { useDeleteCollections } from "hooks/reactQuery/useRag";

type DeleteKnowledgeModalProps = {
  isOpen: boolean;
  onHide: () => void;
  wizardId: string;
};

function DeleteKnowledgeModal({
  isOpen,
  onHide,
  wizardId,
}: DeleteKnowledgeModalProps) {
  const { t } = useTranslation();
  const { mutate: deleteIndex, isPending: isDeleting } = useDeleteCollections();

  const handleDelete = () => {
    deleteIndex(wizardId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.WIZARD_FILE_NAMES, wizardId],
        });
        toast.success("Knowledge deleted successfully");
        onHide();
      },
      onError: error => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  return (
    <Modal show={isOpen} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("common.delete", { entity: "knowledge" })}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Trans
            i18nKey="common.deleteConfirmation"
            components={{
              bold: <span className="fw-bold" />,
            }}
            values={{
              entity: "all knowledge",
            }}
          />
        </div>
        <div className="mt-2 d-flex gap-2">
          <LoadingButton
            label={t("common.delete", { entity: "all knowledge" })}
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

export default DeleteKnowledgeModal;
