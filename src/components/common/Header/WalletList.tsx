import { useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Trans, useTranslation } from "react-i18next";
import { useWallet } from "hooks/useWallet";

import { WALLET_LIST } from "./constants";
import { useUserStore } from "stores/useUser";

interface WalletListProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function WalletList({ isOpen, onClose, onSuccess }: WalletListProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const wallet = useWallet();
  const resetLoginState = useUserStore(state => state.resetLoggedInState);

  const handleConnection = async (id: string) => {
    try {
      setIsLoading(true);
      if (wallet === undefined) return;
      await wallet.connect(id);
      resetLoginState();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton className="wallet-list-modal-header">
        <Modal.Title>
          <div>{t("signIn.connectWallet")}</div>
          <p className="wallet-list-modal-header--title">
            <Trans
              i18nKey="signIn.walletDescription"
              components={{ a: <a href="#" /> }}
            />
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="wallet-list--modal-body">
        {WALLET_LIST.map(({ name, icon, id }) => (
          <Button
            variant="link"
            key={id}
            className="wallet-list--wallet--button"
            onClick={() => handleConnection(id)}
            disabled={isLoading}
          >
            <div className="wallet-list--wallet">
              <img
                src={icon}
                alt={name}
                className="wallet-list--wallet--image"
              />
              <span>{t(`signIn.walletList.${id}`)}</span>
            </div>
          </Button>
        ))}
      </Modal.Body>
      <Modal.Footer>
        {isLoading && (
          <div className="d-flex mx-auto gap-2 align-items-center ">
            <Spinner className="mx-auto" />
            <span>{t("signIn.connectingWallet")}</span>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default WalletList;
