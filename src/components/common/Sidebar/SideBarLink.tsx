import classNames from "classnames";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SidebarLinkProps } from "./constant";

function SideBarLink({ link }: { link: SidebarLinkProps }) {
  const { t } = useTranslation();

  return (
    <li
      className={classNames("nav-item", {
        active: location.pathname === link.to,
      })}
    >
      <Link
        className="nav-link"
        to={(!link.isComingSoon ? link.to : "") ?? ""}
        {...link.otherParams}
      >
        <span className="nav-icon-wrap">
          <span className="svg-icon">
            <link.Icon />
          </span>
        </span>
        <span className="nav-link-text">{t(`sidebar.${link.key}`)}</span>
        {link.isBeta && (
          <span className="badge badge-sm badge-soft-pink ms-auto">
            {t("common.beta")}
          </span>
        )}
      </Link>
    </li>
  );
}

export default SideBarLink;
