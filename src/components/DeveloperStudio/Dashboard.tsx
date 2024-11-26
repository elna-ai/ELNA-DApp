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
      <AllTools />
    </div>
  );
}

export default Dashboard;
