import { ReactNode, useState } from "react";

import Modal from "react-bootstrap/Modal";
import { useUserStore } from "stores/useUser";
import { useGetUserProfile } from "hooks/reactQuery/useUser";
import { useWallet } from "hooks/useWallet";

import CompleteProfile from "./CompleteProfile";
import CheckNameUnique from "./CheckNameUnique";
import WalletList from "../Header/WalletList";
import PageLoader from "../PageLoader";

type CheckWizardNameCreateModalProps = { children: ReactNode };

function CheckWizardNameCreateModal({
  children,
}: CheckWizardNameCreateModalProps) {
  const [isCreate, setIsCreate] = useState(false);
  const [isWalletListOpen, setIsWalletListOpen] = useState(false);

  const wallet = useWallet();
  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
  const { data: userProfile, isFetching: isUserProfileLoading } =
    useGetUserProfile(wallet?.principalId);

  const handleCreate = async () => {
    if (!isUserLoggedIn) {
      setIsWalletListOpen(true);
      return;
    }

    setIsCreate(true);
  };

  return (
    <>
      <span onClick={handleCreate}>{children}</span>
      <Modal
        className="bot-name-modal"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={isCreate}
        onHide={() => {
          !isUserProfileLoading && setIsCreate(false);
        }}
      >
        {isUserProfileLoading ? (
          <Modal.Body style={{ height: "200px" }}>
            <PageLoader />
          </Modal.Body>
        ) : userProfile ? (
          <CheckNameUnique setIsCreate={setIsCreate} />
        ) : (
          <CompleteProfile />
        )}
      </Modal>

      <WalletList
        isOpen={isWalletListOpen}
        onClose={() => setIsWalletListOpen(false)}
        onSuccess={() => setIsCreate(true)}
      />
    </>
  );
}

export default CheckWizardNameCreateModal;
