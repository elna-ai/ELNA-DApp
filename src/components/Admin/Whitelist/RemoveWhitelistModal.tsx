import { Principal } from "@dfinity/principal";
import LoadingButton from "components/common/LoadingButton";
import { useDeleteWhitelistedUser } from "hooks/reactQuery/useUser";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Trans, useTranslation } from "react-i18next";

type RemoveWhitelistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  principalId: Principal | undefined;
};

function RemoveWhitelistModal({
  isOpen,
  onClose,
  principalId,
}: RemoveWhitelistModalProps) {
  const { t } = useTranslation();
  const {
    mutate: removeWhitelistedUser,
    isPending: isRemovingWhitelistedUser,
  } = useDeleteWhitelistedUser();

  return (
    <Modal show={isOpen} onHide={onClose} centered>
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
              entity: principalId,
            }}
          />
        </div>
        <div className="mt-2 d-flex gap-2">
          <LoadingButton
            label={t("common.delete", { entity: "whitelisted user" })}
            isDisabled={isRemovingWhitelistedUser}
            isLoading={isRemovingWhitelistedUser}
            variant="danger"
            onClick={() => {
              principalId &&
                removeWhitelistedUser(principalId, {
                  onSuccess: () => onClose(),
                });
            }}
          />
          <Button
            type="reset"
            variant="link"
            disabled={isRemovingWhitelistedUser}
            onClick={() => {
              if (isRemovingWhitelistedUser) return;

              onClose();
            }}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default RemoveWhitelistModal;
