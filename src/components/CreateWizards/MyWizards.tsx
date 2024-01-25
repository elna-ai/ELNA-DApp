import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import NoChatBotImg from "images/no-chatbot.png";
import { useWallet } from "hooks/useWallet";
import {
  useDeleteMyWizard,
  useFetchMyWizards,
  usePublishUnpublishWizard,
} from "hooks/reactQuery/wizards/useMyWizards";
import { getAvatar } from "src/utils";
import LoadingButton from "components/common/LoadingButton";

import Card from "./Card";
import { useDeleteIndex } from "hooks/reactQuery/useExternalService";

function MyWizards() {
  const [isDeleteWizard, setIsDeleteWizard] = useState(false);
  const [wizardToDelete, setWizardIdToDelete] = useState<{
    id: string;
    name: string;
  }>();

  const { t } = useTranslation();
  const wallet = useWallet();

  const {
    data: userWizards,
    isFetching: isUserWizardsLoading,
    isError,
    error,
  } = useFetchMyWizards({
    userId: wallet?.principalId,
  });
  const { mutate: deleteMyWizard, isPending: isDeletePending } =
    useDeleteMyWizard();
  const { mutate: publishUnpublishWizard } = usePublishUnpublishWizard();
  const { mutate: deleteIndex } = useDeleteIndex();

  const handleDeletePopup = (id: string, name: string) => {
    setIsDeleteWizard(true);
    setWizardIdToDelete({ id, name });
  };

  const handleDelete = async (id: string) => {
    deleteMyWizard(
      { wizardId: id },
      {
        onError: e => {
          toast.error("Unable to delete agent");
          console.error(e);
        },
        onSettled: () => {
          setWizardIdToDelete(undefined);
          setIsDeleteWizard(false);
        },
        onSuccess: () => {
          deleteIndex(id);
        },
      }
    );
  };

  useEffect(() => {
    if (!isError) return;

    toast.error(error.message);
  }, [isError]);

  return (
    <>
      <h5 className="flex gap-2">
        <span>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              d="M17.0007 1.20801 18.3195 3.68083 20.7923 4.99968 18.3195 6.31852 17.0007 8.79134 15.6818 6.31852 13.209 4.99968 15.6818 3.68083 17.0007 1.20801ZM8.00065 4.33301 10.6673 9.33301 15.6673 11.9997 10.6673 14.6663 8.00065 19.6663 5.33398 14.6663.333984 11.9997 5.33398 9.33301 8.00065 4.33301ZM19.6673 16.333 18.0007 13.208 16.334 16.333 13.209 17.9997 16.334 19.6663 18.0007 22.7913 19.6673 19.6663 22.7923 17.9997 19.6673 16.333Z"
              fill="#ffc107"
            ></path>
          </svg>
        </span>
        {t("wizards.myWizards")}
      </h5>
      {isUserWizardsLoading ? (
        <Spinner className="!flex mx-auto" />
      ) : (userWizards?.length || 0) > 0 ? (
        <div className="row gx-3 row-cols-xxl-6 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5">
          {userWizards?.map(
            ({ id, name, description, avatar, isPublished }) => (
              <div key={id} className="col">
                <Card
                  name={name}
                  description={description}
                  id={id}
                  isPublished={isPublished}
                  handlePublish={(id, shouldPublish) =>
                    publishUnpublishWizard({ wizardId: id, shouldPublish })
                  }
                  imageUrl={getAvatar(avatar)!.image}
                  handleDelete={handleDeletePopup}
                />
              </div>
            )
          )}
        </div>
      ) : (
        <div className="w-100 bg-elavate py-5 text-center rounded-3">
          <img className="d-inline" src={NoChatBotImg} alt="no wizard" />
          <p>{t("wizards.noWizards")}</p>
        </div>
      )}
      <hr />
      <Modal
        show={isDeleteWizard}
        onHide={() => {
          if (isDeletePending) return;

          setIsDeleteWizard(false);
        }}
        centered
      >
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
                entity: wizardToDelete?.name,
              }}
            />
          </div>
          <div className="mt-2 d-flex gap-2">
            <LoadingButton
              label={t("common.delete", { entity: "agent" })}
              isDisabled={isDeletePending}
              isLoading={isDeletePending}
              variant="danger"
              onClick={() => handleDelete(wizardToDelete!.id)}
            />
            <Button
              type="reset"
              variant="link"
              disabled={isDeletePending}
              onClick={() => {
                if (isDeletePending) return;

                setWizardIdToDelete(undefined);
                setIsDeleteWizard(false);
              }}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MyWizards;
