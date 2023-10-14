import { useState } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";
import { useUserStore } from "stores/useUser";

import WalletList from "./WalletList";
import AvatarImg from "images/avatar.png";
import { UserState } from "types";
import { useWallet } from "hooks/useWallet";

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header({ isLoggedIn, setIsLoggedIn }: HeaderProps) {
  const [isWalletModelOpen, setIsWalletModelOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { t } = useTranslation();
  const wallet = useWallet();
  const setUser = useUserStore((state: UserState) => state.setUser);
  const user = useUserStore((state: UserState) => state.user);

  const handleClick = async () => {
    if (isLoggedIn) {
      setIsLoggingOut(true);
      localStorage.removeItem("dfinityWallet");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser({});
      setIsLoggedIn(!!localStorage.getItem("dfinityWallet"));
      //   await wallet.disconnect();
      setIsLoggingOut(false);
    } else {
      setIsWalletModelOpen(prev => !prev);
    }
  };

  const displayAddress = () => {
    if (!wallet?.principalId) return "user";

    const firstPart = wallet?.principalId?.substring(0, 6);
    const lastPart = wallet?.principalId?.substring(
      wallet.principalId.length - 6
    );
    return `${firstPart}...${lastPart}`;
  };

  return (
    <>
      <header className="d-flex p-2 h-12">
        <nav className="hk-navbar navbar navbar-expand-xl navbar-light fixed-top">
          <div className="container-fluid">
            {isLoggedIn ? (
              <Dropdown className="ml-auto d-flex">
                <Dropdown.Toggle
                  variant="light"
                  className="flex gap-2 items-center"
                >
                  <span>
                    <img
                      className="rounded-circle d-inline mr-2"
                      src={AvatarImg}
                      alt="profile-avatar"
                      width={40}
                    />
                  </span>
                  <span>{displayAddress()}</span>
                  {isLoggingOut && <Spinner animation="border" size="sm" />}
                </Dropdown.Toggle>
                <Dropdown.Menu className="profile-dropdown">
                  <Dropdown.Item onClick={handleClick}>
                    <span className="mr-2">
                      <svg
                        className="d-inline"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"
                          fill="rgba(0,125,136,1)"
                        ></path>
                      </svg>
                    </span>
                    {t("common.logout")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                className="ml-auto d-flex"
                onClick={handleClick}
                disabled={isLoggingOut}
              >
                <div className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      d="M22.0049 7H23.0049V17H22.0049V20C22.0049 20.5523 21.5572 21 21.0049 21H3.00488C2.4526 21 2.00488 20.5523 2.00488 20V4C2.00488 3.44772 2.4526 3 3.00488 3H21.0049C21.5572 3 22.0049 3.44772 22.0049 4V7ZM20.0049 17H14.0049C11.2435 17 9.00488 14.7614 9.00488 12C9.00488 9.23858 11.2435 7 14.0049 7H20.0049V5H4.00488V19H20.0049V17ZM21.0049 15V9H14.0049C12.348 9 11.0049 10.3431 11.0049 12C11.0049 13.6569 12.348 15 14.0049 15H21.0049ZM14.0049 11H17.0049V13H14.0049V11Z"
                      fill="rgba(255,255,255,1)"
                    ></path>
                  </svg>
                </div>
                {t("header.connectWallet")}
              </Button>
            )}
          </div>
        </nav>
      </header>
      <WalletList
        isOpen={isWalletModelOpen}
        onClose={() => setIsWalletModelOpen(false)}
        setIsLoggedIn={setIsLoggedIn}
      />
    </>
  );
}

export default Header;
