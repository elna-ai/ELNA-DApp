import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageLoader from "components/common/PageLoader";
import { useIsDeveloper } from "hooks/reactQuery/useDeveloper";

import UserTools from "./UserTools";
import AllTools from "./AllTools";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: isDeveloper, isFetching: isLoading } = useIsDeveloper();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      {isDeveloper && (
        <div className="d-flex justify-content-between align-items-center list-tool">
          <div>
            <h5 className="mb-0">{t("developerStudio.createBanner.title")}</h5>
            <p className="mb-0" style={{ color: "#E0E0E1" }}>
              {t("developerStudio.createBanner.description")}
            </p>
          </div>
          <Button
            disabled={!isDeveloper}
            onClick={() => navigate("/developer-studio/create-tool")}
          >
            {t("developerStudio.createBanner.listATool")}
          </Button>
        </div>
      )}
      <UserTools />
      <AllTools />
    </div>
  );
}

export default Dashboard;
