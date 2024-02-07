import { useEffect } from "react";

import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// import useIsMobileScreen from "hooks/useIsMobileScreen";
import useIsMobileScreen from "../../../hooks/useIsMobileScreen";

import BrandSm from "images/brandSm.svg?react";
import ElanLogo from "images/logoElna.svg?react";
import {
  ADMIN_SIDEBAR_LINKS,
  SIDEBAR_LINK,
  SidebarLinkProps,
} from "./constant";
import { useLocation } from "react-router-dom";
import ExpandButton from "./ExpandButton";
import { useIsUserAdmin } from "hooks/reactQuery/useUser";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SideBarLink from "./SideBarLink";

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
              {sideBarLink.map(linkGroup => (
                <div style={{ marginBottom: "20px" }}>
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
          <div className="callout card card-flush bg-orange-light-5 text-center mt-5 w-220p mx-auto">
            <div className="card-body">
              <div>
                <span className="me-2 border-end p-2">
                  <span>40</span>
                  <i className="ri-shining-fill"></i>
                </span>
                <span>{t("common.free")}</span>
              </div>
              <h5 className="h5">
                {t("sidebar.plusHeading", {
                  name: t(`common.${import.meta.env.VITE_APP_NAME}`),
                })}
              </h5>
              <p className="p-sm card-text">{t("sidebar.plusDescription")}</p>
              <a
                href="#"
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
