import { ReactNode, useState } from "react";

import { useUserStore } from "stores/useUser";
import WalletList from "./Header/WalletList";
import { useNavigate } from "react-router-dom";

type LoginButtonWrapperProps = { children: ReactNode };

export function LoginButtonWrapper({
  children,
}: LoginButtonWrapperProps) {

  const [isWalletListOpen, setIsWalletListOpen] = useState(false);
  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!isUserLoggedIn) {
      setIsWalletListOpen(true);
      return;
    }
  };

  return (
    <>
      <span onClick={handleLogin}>{children}</span>

      <WalletList
        isOpen={isWalletListOpen}
        onClose={() => setIsWalletListOpen(false)}
        onSuccess={() => navigate("/my-space/profile")}
      />
    </>
  );
}