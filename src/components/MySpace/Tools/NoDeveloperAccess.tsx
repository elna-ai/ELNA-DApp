import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NoDevAccessImg from "images/no_developer_access.svg";

function NoDeveloperAccess() {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-100 py-5 text-center">
        <img className="d-inline" src={NoDevAccessImg} alt="no wizard" />
        <h5>{t("mySpace.myTools.noAccessHeader")}</h5>
        <p>{t("mySpace.myTools.noAccessDesc")}</p>
        <Button>
          <Link to="/my-space/request/developer">
            {t("profile.requestDevAccess")}
          </Link>
        </Button>
      </div>
    </>
  );
}

export default NoDeveloperAccess;
