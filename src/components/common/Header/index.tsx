import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import WalletList from "./WalletList";
import AvatarImg from "images/avatar.png";
import { useWallet } from "hooks/useWallet";
import { useUserStore } from "stores/useUser";
import { useGetUserProfile, useIsUserAdmin } from "hooks/reactQuery/useUser";

import useAuth from "stores/auth";
import { trim } from "utils/trim";

function Header() {
  const [isWalletModelOpen, setIsWalletModelOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { t } = useTranslation();
  const resetUserToken = useUserStore(state => state.resetToken);
  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
  const resetLoggedInState = useUserStore(state => state.resetLoggedInState);
  const wallet = useWallet();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: isAdmin } = useIsUserAdmin();
  const { update, isConnected, principalId, isConnecting } = useAuth();
  useGetUserProfile(wallet?.principalId);
  // const timer = useRef<NodeJS.Timeout | null>(null);

  const clearAuth = useCallback(() => {
    update({
      isConnected: !1,
      accountId: null,
      principalId: null,
      isConnecting: !1,
    });
  }, [update]);
  useEffect(() => {
    if (!wallet || isConnected) {
      return;
    }

    const autoLogin = async () => {
      if (wallet && wallet?.autoConnect) {
        try {
          update({
            isConnecting: !0,
          });
          const principal = await wallet.autoConnect();
          if (principal && typeof principal === "string") {
            update({
              isConnected: true,
              principalId: principal,
              accountId: wallet.accountId,
              isConnecting: !1,
            });
          } else {
            clearAuth();
          }
        } catch (e) {
          clearAuth();
        }
      }
    };
    // const onLoad = () => {
    //   timer.current = setTimeout(autoLogin, 1000);
    // };
    // window.addEventListener("load", onLoad);
    // return () => {
    //   window.removeEventListener("load", onLoad);
    //   if (timer.current) {
    //     clearTimeout(timer.current);
    //   }
    // };
    autoLogin();
  }, [wallet, isConnected, update, clearAuth]);

  const handleLoginLogout = useCallback(async () => {
    if (isUserLoggedIn) {
      setIsLoggingOut(true);
      localStorage.removeItem("dfinityWallet");
      resetUserToken();
      resetLoggedInState();
      //   await wallet.disconnect();
      setIsLoggingOut(false);
      clearAuth();
      if (location.pathname.includes("/my-space")) navigate("/");
    } else {
      setIsWalletModelOpen(prev => !prev);
    }
  }, [
    clearAuth,
    isUserLoggedIn,
    location.pathname,
    navigate,
    resetLoggedInState,
    resetUserToken,
  ]);

  const copyToClipBoard = useCallback(async () => {
    try {
      if (wallet === undefined) {
        toast.error("Failed to copy Principal Id");
        return;
      }

      await navigator.clipboard.writeText(principalId ?? "");
      toast.success("Principal Id copied");
    } catch (err) {
      toast.error("Failed to copy Principal Id");
    }
  }, [principalId, wallet]);

  const menus = useMemo(
    () => [
      {
        icon: () => <MdContentCopy />,
        label: "Principal ID",
        id: "principalId",
        onClick: copyToClipBoard,
      },
      {
        icon: () => <FiUser />,
        label: "User profile",
        id: "profile",
        onClick: () => navigate("/my-space/profile"),
      },
      {
        icon: () => <RiAdminLine />,
        label: "Admin",
        id: "admin",
        hide: !isAdmin,
        onClick: () => navigate("/admin"),
      },
      {
        icon: () => <IoLogOutOutline />,
        label: "Logout",
        id: "logout",
        onClick: handleLoginLogout,
      },
    ],
    [copyToClipBoard, handleLoginLogout, isAdmin, navigate]
  );

  const onClickHandler = (callback?: () => void) => {
    if (typeof callback === "function") {
      callback();
    }
  };
  return (
    <>
      {JSON.stringify(menus)}
      <header className="d-flex p-2 h-12">
        <nav className="hk-navbar navbar navbar-expand-xl fixed-top">
          <div className="container-fluid justify-content-end">
            {isConnected ? (
              <Dropdown className="ml-auto d-flex">
                <Dropdown.Toggle
                  variant="dark"
                  className="flex gap-2 items-center"
                >
                  <span>
                    <img
                      className="rounded-circle d-inline me-2"
                      src={AvatarImg}
                      alt="profile-avatar"
                      width={32}
                    />
                  </span>
                  <span>{trim(principalId ?? "")}</span>
                  {isLoggingOut && <Spinner animation="border" size="sm" />}
                </Dropdown.Toggle>
                <Dropdown.Menu className="profile-dropdown">
                  {menus.map(item => {
                    if (item.hide) {
                      return null;
                    }
                    return (
                      <Dropdown.Item
                        key={item.id}
                        onClick={() => onClickHandler(item.onClick)}
                      >
                        {item.icon()}
                        {item.label}
                      </Dropdown.Item>
                    );
                  })}
                  {isAdmin && (
                    <Dropdown.Item
                      style={{
                        backgroundColor: "red !important",
                        opacity: 0.5,
                      }}
                    >
                      <Link to="/admin">Admin dashboard</Link>
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                className="ml-auto d-flex"
                style={{ marginRight: "0.75rem" }}
                onClick={handleLoginLogout}
                disabled={isLoggingOut}
              >
                <div className="me-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      d="M22.0049 7H23.0049V17H22.0049V20C22.0049 20.5523 21.5572 21 21.0049 21H3.00488C2.4526 21 2.00488 20.5523 2.00488 20V4C2.00488 3.44772 2.4526 3 3.00488 3H21.0049C21.5572 3 22.0049 3.44772 22.0049 4V7ZM20.0049 17H14.0049C11.2435 17 9.00488 14.7614 9.00488 12C9.00488 9.23858 11.2435 7 14.0049 7H20.0049V5H4.00488V19H20.0049V17ZM21.0049 15V9H14.0049C12.348 9 11.0049 10.3431 11.0049 12C11.0049 13.6569 12.348 15 14.0049 15H21.0049ZM14.0049 11H17.0049V13H14.0049V11Z"
                      fill="var(--elna-primary-text-color)"
                    ></path>
                  </svg>
                </div>

                {isConnecting
                  ? t("header.connectingWallet")
                  : t("header.connectWallet")}
              </Button>
            )}
          </div>
        </nav>
      </header>
      <WalletList
        isOpen={isWalletModelOpen}
        onClose={() => setIsWalletModelOpen(false)}
      />
    </>
  );
}

export default Header;
