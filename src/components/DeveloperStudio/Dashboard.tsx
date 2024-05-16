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
        <div
          className="d-flex justify-content-between align-items-center p-2"
          style={{
            background:
              "linear-gradient(272deg, #276E4C 49.81%, #266E4B 73.5%, #3D956A 97.18%)",
            boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.08)",
            borderRadius: "1rem",
          }}
        >
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
