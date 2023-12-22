import { useEffect } from "react";

import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// import useIsMobileScreen from "hooks/useIsMobileScreen";
import useIsMobileScreen from "../../../hooks/useIsMobileScreen";

import BrandSm from "images/brandSm.svg?react";
import ElanLogo from "images/logoElna.svg?react";
import { SIDEBAR_LINK } from "./constant";
import { useLocation } from "react-router-dom";
import ExpandButton from "./ExpandButton";
import { Modal } from "react-bootstrap";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobileScreen();
  const { t } = useTranslation();

  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  const handleExpand = () => setIsExpanded(prev => !prev);

  if (isMobile) {
    return (
      <div
        className="menu-header"
        style={{
          height: "65px",
          width: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: "999999",
        }}
        onClick={handleExpand}
      >
        {isExpanded ? (
          <Modal show={true} fullscreen="xxl-down">
            <Modal.Header closeButton />
            <Modal.Body>
              <ul className="navbar-nav flex-column">
                {SIDEBAR_LINK.map(
                  ({ to, Icon, isComingSoon, otherParams, key }) => (
                    <li
                      className={classNames("nav-item", {
                        active: location.pathname === to,
                      })}
                      key={key}
                    >
                      <Link
                        className="nav-link"
                        to={(!isComingSoon ? to : "") ?? ""}
                        {...otherParams}
                      >
                        <span className="nav-icon-wrap">
                          <span className="svg-icon">
                            <Icon />
                          </span>
                        </span>
                        <span className="nav-link-text">
                          {t(`sidebar.${key}`)}
                        </span>
                        {isComingSoon && (
                          <span className="badge badge-sm badge-soft-pink ms-auto">
                            {t("common.comingSoon")}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </Modal.Body>
          </Modal>
        ) : (
          <BrandSm className="brand-img img-fluid" />
        )}
      </div>
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
            <BrandSm className="brand-img img-fluid" />
            <ElanLogo className="brand-img img-fluid" />
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
              {SIDEBAR_LINK.map(
                ({ to, Icon, isComingSoon, otherParams, key }) => (
                  <li
                    className={classNames("nav-item", {
                      active: location.pathname === to,
                    })}
                    key={key}
                  >
                    <Link
                      className="nav-link"
                      to={(!isComingSoon ? to : "") ?? ""}
                      {...otherParams}
                    >
                      <span className="nav-icon-wrap">
                        <span className="svg-icon">
                          <Icon />
                        </span>
                      </span>
                      <span className="nav-link-text">
                        {t(`sidebar.${key}`)}
                      </span>
                      {isComingSoon && (
                        <span className="badge badge-sm badge-soft-pink ms-auto">
                          {t("common.comingSoon")}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="callout card card-flush bg-orange-light-5 text-center mt-5 w-220p mx-auto">
            <div className="card-body">
              <h5 className="h5">
                {t(`common.${import.meta.env.VITE_APP_NAME}`)}+
              </h5>
              <p className="p-sm card-text">{t("sidebar.plusDescription")}</p>
              <a
                href="#"
                target="_blank"
                className="btn btn-primary btn-block"
                rel="noreferrer"
              >
                {t("common.comingSoon")}
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
