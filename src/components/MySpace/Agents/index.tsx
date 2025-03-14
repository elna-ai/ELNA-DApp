import PageLoader from "components/common/PageLoader";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useWallet } from "hooks/useWallet";
import {
  useDeleteMyWizard,
  useFetchMyWizards,
  usePublishUnpublishWizard,
} from "hooks/reactQuery/wizards/useMyWizards";
import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";
import CheckWizardNameCreateModal from "components/common/CheckWizardNameCreate";

//check if these should be moved to common
import DeleteWizardModal from "./DeleteWizardModal";
import NoWizards from "./NoWizards";
import Card from "../../ViewAgents/Card";
import { useNavigate } from "react-router-dom";
import { useDeleteCollections } from "hooks/reactQuery/useRag";
import { t } from "i18next";
import { useDeleteCustomImage } from "hooks/reactQuery/useElnaImages";

function MyWizards() {
  const [isDeleteWizard, setIsDeleteWizard] = useState(false);
  const [wizardToDelete, setWizardIdToDelete] = useState<{
    id: string;
    name: string;
  }>();

  const wallet = useWallet();
  const navigate = useNavigate();

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
  const { mutate: deleteIndex } = useDeleteCollections();
  const { data: analytics } = useGetAllAnalytics();
  const { mutate: deleteCustomImage, isPending: isDeletingCustomImage } =
    useDeleteCustomImage();

  const handleDeletePopup = (id: string, name: string) => {
    setIsDeleteWizard(true);
    setWizardIdToDelete({ id, name });
  };

  const handleDelete = async (id: string) => {
    const wizard = userWizards?.find(wizard => wizard.id === id);
    if (!wizard) throw new Error("Wizard not found");
    deleteCustomImage(wizard.avatar, {
      onSuccess: data => {
        if ("Err" in data) {
          console.error(data.Err);
          toast.error("Unable to delete avatar");
        }
      },
      onError: e => {
        toast.error("Unable to delete avatar");
        console.error(e);
      },
    });
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

  const handleOnHide = () => {
    if (isDeletePending) return;

    setWizardIdToDelete(undefined);
    setIsDeleteWizard(false);
  };

  const handleEdit = (id: string) => {
    navigate(`/create-agent/edit/${id}`);
  };

  const Title = () => {
    return (
      <div className="myagents">
        <div className="myagents__header">
          <div>
            <h5>{t("mySpace.myAgents.agentsHeader")}</h5>
            <p>{t("mySpace.myAgents.agentsHeaderDesc")}</p>
          </div>
          {!isUserWizardsLoading && (userWizards?.length || 0) > 0 && (
            <CheckWizardNameCreateModal>
              <Button className="myagents__header__btn">Create Agent</Button>
            </CheckWizardNameCreateModal>
          )}
        </div>
      </div>
    );
  };

  // TODO: Refactor
  const renderBody = () => {
    if (isUserWizardsLoading) {
      return <PageLoader />;
    }

    if ((userWizards?.length || 0) === 0) {
      return <NoWizards />;
    }

    return (
      <>
        <div className="row gx-3 row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mt-4 mb-5">
          {userWizards?.map(
            ({
              id,
              name,
              description,
              avatar,
              isPublished,
              creatorName,
              tokenAddress,
              poolAddress,
            }) => (
              <div key={id} className="col">
                <Card
                  name={name}
                  description={description}
                  id={id}
                  isPublished={isPublished}
                  handlePublish={(id, shouldPublish) =>
                    publishUnpublishWizard({ wizardId: id, shouldPublish })
                  }
                  imageId={avatar}
                  handleDelete={handleDeletePopup}
                  messagesReplied={analytics?.[id]?.messagesReplied || 0n}
                  handleEdit={handleEdit}
                  creatorName={creatorName}
                  tokenized={!!tokenAddress.length || !!poolAddress.length}
                />
              </div>
            )
          )}
        </div>
      </>
    );
  };

  useEffect(() => {
    if (!isError) return;

    toast.error(error.message);
  }, [isError]);

  return (
    <div>
      <Title />
      <div>
        {renderBody()}
        <DeleteWizardModal
          isDeleting={isDeletePending}
          isOpen={isDeleteWizard}
          wizardName={wizardToDelete?.name}
          onHide={handleOnHide}
          handleDelete={() => handleDelete(wizardToDelete!.id)}
        />
      </div>
    </div>
  );
}

export default MyWizards;
