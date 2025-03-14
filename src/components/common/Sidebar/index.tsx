import { useEffect } from "react";

import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useIsUserAdmin } from "hooks/reactQuery/useUser";
import useIsMobileScreen from "../../../hooks/useIsMobileScreen";
// import useIsMobileScreen from "hooks/useIsMobileScreen";

import BrandSm from "images/brandSm.svg?react"
import ElanLogo from "images/logoElna.svg?react";
import ExpandButton from "./ExpandButton";
import SideBarLink from "./SideBarLink";
import {
  ADMIN_SIDEBAR_LINKS,
  SIDEBAR_LINK,
  SidebarLinkProps,
} from "./constant";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobileScreen();
  const { t } = useTranslation();
  const { data: isAdmin } = useIsUserAdmin();

  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  const handleExpand = () => setIsExpanded(prev => !prev);
  const sideBarLink =
    isAdmin && location.pathname.includes("/admin")
      ? ADMIN_SIDEBAR_LINKS
      : SIDEBAR_LINK;

  if (isMobile) {
    return (
      <>
        <div
          className="menu-header"
          style={{
            height: "65px",
            width: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            zIndex: "1035",
          }}
          onClick={handleExpand}
        >
          {isExpanded ? (
            <Modal show={true} fullscreen="xxl-down">
              <Modal.Header closeButton />
              <Modal.Body>
                <ul className="navbar-nav flex-column">
                  {sideBarLink.map(linkGroup => (
                    <div className="menu-sidebar-card">
                      {linkGroup.map((link: SidebarLinkProps) => (
                        <OverlayTrigger
                          key={link.key}
                          placement="right-end"
                          overlay={
                            link.isComingSoon ? (
                              <Tooltip className="tooltip-menu">
                                {t("common.comingSoon")}
                              </Tooltip>
                            ) : (
                              <span></span>
                            )
                          }
                        >
                          <div>
                            <SideBarLink link={link} />
                          </div>
                        </OverlayTrigger>
                      ))}
                    </div>
                  ))}
                </ul>
              </Modal.Body>
            </Modal>
          ) : (
            <i className="ri-menu-line" style={{ fontSize: "30px" }} />
          )}
        </div>
        <Link to="/" className="navbar-brand-homeBtn">
          <BrandSm className="brand-img img-fluid" style={{ height: "41px", width: "41px" }} />
        </Link>
      </>
    );
  }

  return (
    <div className="hk-menu">
      {/* Brand */}
      <div className="menu-header">
        <span>
          {/* <a
              className="navbar-brand d-flex align-items-center"
              href="index.html"
            >
              <BrandSm className="brand-img img-fluid" />
              <ElanLogo className="brand-img img-fluid" />
            </a> */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            {isExpanded ? (
              <ElanLogo
                className="brand-img img-fluid"
                style={{ width: "200px" }}
              />
            ) : <BrandSm style={{ height: "41px", width: "41px" }} />}
          </Link>
        </span>
        <ExpandButton
          {...{ handleExpand }}
          className={classNames("sidebar-button", {
            "sidebar-button--collapsed": !isExpanded,
          })}
        />
      </div>
      {/* /Brand */}
      <div>
        <div className="menu-content-wrap">
          <div className="menu-group">
            <ul className="navbar-nav flex-column">
              {sideBarLink.map(linkGroup => (
                <div className="menu-sidebar-card">
                  {linkGroup.map((link: SidebarLinkProps) => (
                    <OverlayTrigger
                      key={link.key}
                      placement="right-end"
                      overlay={
                        link.isComingSoon ? (
                          <Tooltip>{t("common.comingSoon")}</Tooltip>
                        ) : (
                          <span></span>
                        )
                      }
                    >
                      <div>
                        <SideBarLink link={link} />
                      </div>
                    </OverlayTrigger>
                  ))}
                </div>
              ))}
            </ul>
          </div>
          <div className="callout card card-flush text-center mx-auto">
            <div className="card-body">
              <h5 className="h5">
                {t("sidebar.plusHeading", {
                  name: t(`common.${import.meta.env.VITE_APP_NAME}`),
                })}
              </h5>
              <p className="p-sm card-text">{t("sidebar.plusDescription")}</p>
              <a
                href="https://hyperlaunch.fun/"
                target="_blank"
                className="btn btn-primary btn-block"
                rel="noreferrer"
              >
                <i className="ri-vip-crown-fill me-2"></i>
                {t("sidebar.upgradePlan")}
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Menu */}
    </div>
  );
}

export default Sidebar;