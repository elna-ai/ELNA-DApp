import { ReactNode, useState } from "react";

import Modal from "react-bootstrap/Modal";
import { useUserStore } from "stores/useUser";
import { useIsUserWhiteListed } from "hooks/reactQuery/useUser";

import NoPermission from "./NoPermission";
import CheckNameUnique from "./CheckNameUnique";
import WalletList from "../Header/WalletList";
import PageLoader from "../PageLoader";

type CheckWizardNameCreateModalProps = { children: ReactNode };

function CheckWizardNameCreateModal({
  children,
}: CheckWizardNameCreateModalProps) {
  const [isCreate, setIsCreate] = useState(false);
  const [isWalletListOpen, setIsWalletListOpen] = useState(false);

  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
  const { data: isUserWhitelisted, isFetching: isUserWhitelistedLoading } =
    useIsUserWhiteListed();

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
          !isUserWhitelistedLoading && setIsCreate(false);
        }}
      >
        {isUserWhitelistedLoading ? (
          <Modal.Body style={{ height: "200px" }}>
            <PageLoader />
          </Modal.Body>
        ) : isUserWhitelisted ? (
          <CheckNameUnique setIsCreate={setIsCreate} />
        ) : (
          <NoPermission />
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
