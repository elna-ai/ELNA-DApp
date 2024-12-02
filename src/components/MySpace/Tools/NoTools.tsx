import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NoToolImg from "images/no_tools.svg";

function NoTools() {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-100 py-5 text-center">
        <img className="d-inline" src={NoToolImg} alt="no wizard" />
        <h5>{t("mySpace.myTools.noToolsHeader")}</h5>
        <p>{t("mySpace.myTools.noToolsHeaderDesc")}</p>
        <Button variant="outline">
          <Link to="create-tool" className="profile__body__roles__button-link">
            {t("mySpace.myTools.createToolBtn")}
          </Link>
        </Button>
      </div>
    </>
  );
}

export default NoTools;
