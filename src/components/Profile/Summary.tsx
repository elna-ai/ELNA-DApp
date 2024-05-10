import { Badge, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import PageLoader from "components/common/PageLoader";
import { useIsDeveloper } from "hooks/reactQuery/useDeveloper";
import { useWallet } from "hooks/useWallet";

function Summary() {
  const wallet = useWallet();
  const { t } = useTranslation();
  const { data: isDeveloper, isFetching: isLoading } = useIsDeveloper();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <h5 className="d-flex gap-2">
        <span>
          <i className="ri-user-fill"></i>
        </span>
        {t("profile.title")}
      </h5>
      <p>{t("profile.description")}</p>
      <div className="d-flex align-items-center gap-2 mt-4">
        <p>{t("profile.principal")}</p>
        <p className="fw-semibold">{wallet?.principalId}</p>
      </div>
      <div className="d-flex align-items-center gap-2">
        <p>{t("profile.roles")}</p>
        <p className="d-flex gap-2">
          <Badge bg="secondary">{t("common.chatter")}</Badge>
          {isDeveloper && <Badge bg="success">{t("common.developer")}</Badge>}
        </p>
      </div>
      {!isDeveloper && (
        <Button variant="secondary">
          <Link to="request/developer">{t("profile.requestDevAccess")}</Link>
        </Button>
      )}
    </div>
  );
}

export default Summary;
