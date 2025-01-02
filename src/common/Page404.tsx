import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Image404 from "../images/404-error.webp";
import { useNavigate } from "react-router-dom";

function Page404() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="error-elna">
      <div className="error-content">
        <img src={Image404} />
        <p>{t("404Page.problem")}</p>
        <h3>
          <strong>{t("404Page.title")}</strong>
        </h3>
        <p className="lead">{t("404Page.description")}</p>

        <Button onClick={() => navigate("/")} className="btn-primary">{t("common.backToHome")}</Button>
      </div>
    </div>
  );
}

export default Page404;
