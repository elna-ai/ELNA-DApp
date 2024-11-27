import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
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
      <div>
        <div>
          <h5>Agents</h5>
          <p>
            Each skilled in their own field - a Travel Guide, a Fitness Coach, a
            Masterful Storyteller, et al.
          </p>
        </div>
        {!isUserWizardsLoading && (userWizards?.length || 0) > 0 && (
          <CheckWizardNameCreateModal>
            <Button>Create Agent</Button>
          </CheckWizardNameCreateModal>
        )}
      </div>
    );
  };

  // TODO: Refactor
  const renderBody = () => {
    if (isUserWizardsLoading) {
      return <Spinner className="!flex mx-auto" />;
    }

    if ((userWizards?.length || 0) === 0) {
      return <NoWizards />;
    }

    return (
      <>
        <div className="my-wizards__card-wrapper">
          {userWizards?.map(
            ({ id, name, description, avatar, isPublished, creatorName }) => (
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
