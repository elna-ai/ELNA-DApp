import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  if (isChatPage) return <></>;

  return (
    <div className="hk-footer">
      <footer className="container-fluid footer">
        <div className="row">
          <div className="col-xl-12">
            <p className="footer-text">
              <span className="copy-text">{t("footer.name")}</span>{" "}
              <a href="#" className="" target="_blank">
                {t("footer.privacyPolicy")}
              </a>
              <span className="footer-link-sep mx-2">|</span>
              <a href="#" target="_blank">
                {t("footer.t&c")}
              </a>
              <span className="footer-link-sep" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
