import { useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Trans, useTranslation } from "react-i18next";
import { useWallet } from "hooks/useWallet";

import { WALLET_LIST } from "./constants";

interface WalletListProps {
  isOpen: boolean,
  onClose: () => void,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function WalletList({ isOpen, onClose, setIsLoggedIn }: WalletListProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const wallet = useWallet();

  const handleConnection = async (id: string) => {
    try {
      setIsLoading(true);
      await wallet.connect(id);

      setIsLoggedIn(!!localStorage.getItem("dfinityWallet"));
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton className="align-items-start">
        <Modal.Title>
          <div>{t("signIn.connectWallet")}</div>
          <p className=" font-normal text-gray-700 text-sm">
            <Trans
              i18nKey="signIn.walletDescription"
              components={{ a: <a href="#" /> }}
            />
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-2">
        {WALLET_LIST.map(({ name, icon, id }) => (
          <Button
            variant="link"
            key={name}
            className="rounded-sm !no-underline"
            onClick={() => handleConnection(id)}
            disabled={isLoading}
          >
            <div className="flex items-center gap-3 p-2 hover:bg-gray-100">
              <img src={icon} alt={name} className="h-8 w-8 object-cover" />
              <span>{name}</span>
            </div>
          </Button>
        ))}
      </Modal.Body>
      <Modal.Footer>
        {isLoading && (
          <div className="flex mx-auto gap-2 items-center ">
            <Spinner className="mx-auto" />
            <span>{t("signIn.connectingWallet")}</span>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default WalletList;
