import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NoDevAccessImg from "images/no_developer_access.svg";

function NoDeveloperAccess({ access }: { access?: string }) {
  const { t } = useTranslation();

  const renderBody = () => {
    if (access === "pending") {
      return (
        <p>Developer access request is pending</p>
      )
    }
    if (access === "rejected") {
      return (
        <>
          <p>Developer access request has been rejected</p>
          <Button>
            <Link to="/my-space/request/developer">
              {t("profile.requestDevAccess")}
            </Link>
          </Button>
        </>
      )
    }
    else return (
      <>
        <p>{t("mySpace.myTools.noAccessDesc")}</p>
        <Button>
          <Link to="/my-space/request/developer">
            {t("profile.requestDevAccess")}
          </Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <div className="w-100 py-5 text-center">
        <img className="d-inline" src={NoDevAccessImg} alt="no wizard" />
        <h5>{t("mySpace.myTools.noAccessHeader")}</h5>
        {renderBody()}
      </div>
    </>
  );
}

export default NoDeveloperAccess;
