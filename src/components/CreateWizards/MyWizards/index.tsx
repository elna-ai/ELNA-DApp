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
import { getAvatar } from "src/utils";
import { useDeleteIndex } from "hooks/reactQuery/useExternalService";
import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";
import { useUserStore } from "stores/useUser";
import CheckWizardNameCreateModal from "components/common/CheckWizardNameCreate";

import DeleteWizardModal from "./DeleteWizardModal";
import NoWizards from "./NoWizards";
import Title from "./Title";
import Card from "../Card";
import WizardNotLoggedIn from "./WizardNotLoggedIn";

function MyWizards() {
  const [isDeleteWizard, setIsDeleteWizard] = useState(false);
  const [wizardToDelete, setWizardIdToDelete] = useState<{
    id: string;
    name: string;
  }>();

  const wallet = useWallet();
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
  const { mutate: deleteIndex } = useDeleteIndex();
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
  // TODO: Refactor
  const renderBody = () => {
    if (isUserWizardsLoading) {
      return <Spinner className="!flex mx-auto" />;
    }
    if (!isUserLoggedIn) {
      return <WizardNotLoggedIn />;
    }

    if ((userWizards?.length || 0) === 0) {
      return <NoWizards />;
    }

    return (
      <>
        <Title />
        <div className="my-wizards__card-wrapper">
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
                  messagesReplied={analytics?.[id]?.messagesReplied || 0n}
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
    <div className="my-wizards__wrapper">
      {renderBody()}
      <div className="my-wizards__footer">
        <div>
          <div className="my-wizards__footer__title">Create an Ai Agent</div>
          <div className="my-wizards__footer__description">
            Craft and fine tune your agent
          </div>
        </div>
        <CheckWizardNameCreateModal>
          <Button>Create Agent</Button>
        </CheckWizardNameCreateModal>
      </div>
      <DeleteWizardModal
        isDeleting={isDeletePending}
        isOpen={isDeleteWizard}
        wizardName={wizardToDelete?.name}
        onHide={handleOnHide}
        handleDelete={() => handleDelete(wizardToDelete!.id)}
      />
    </div>
  );
}

export default MyWizards;
