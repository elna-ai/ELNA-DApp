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
import { useUserStore } from "stores/useUser";
import CheckWizardNameCreateModal from "components/common/CheckWizardNameCreate";

import DeleteWizardModal from "./DeleteWizardModal";
import NoWizards from "./NoWizards";
import Title from "./Title";
import Card from "../Card";
import WizardPlaceholder from "../WizardPlaceholder";
import { useNavigate, useLocation } from "react-router-dom";
import { useDeleteCollections } from "hooks/reactQuery/useRag";

function MyWizards() {
  const [isDeleteWizard, setIsDeleteWizard] = useState(false);
  const [wizardToDelete, setWizardIdToDelete] = useState<{
    id: string;
    name: string;
  }>();

  const wallet = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);

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

  // TODO: Refactor
  const renderBody = () => {

    if (isUserWizardsLoading) {
      return <Spinner className="!flex mx-auto" />;
    }

    if (!isUserLoggedIn) {
      return <WizardPlaceholder />;
    }

    if ((userWizards?.length || 0) === 0) {
      return <NoWizards />;
    }

    return (
      <>
        <Title />
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
    <div className="">
      <div>
        <div>
          <h2>Agents</h2>
          <h3>Each skilled......</h3>
        </div>
        {
          !isUserWizardsLoading && ((userWizards?.length || 0) > 0) &&
          <CheckWizardNameCreateModal>
            <Button>Create Agent</Button>
          </CheckWizardNameCreateModal>
        }
      </div>
      <div className="">
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
