import { Badge, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import PageLoader from "components/common/PageLoader";
import {
  useGetUserRequest,
  useIsDeveloper,
} from "hooks/reactQuery/useDeveloper";
import { useWallet } from "hooks/useWallet";

function Summary() {
  const wallet = useWallet();
  const { t } = useTranslation();
  const { data: isDeveloper, isFetching: isLoading } = useIsDeveloper();
  const { data: userRequest, isFetching: isUserRequestLoading } =
    useGetUserRequest();

  const getColor = (status: string) => {
    if (status === "approved") return "bg-primary";
    if (status === "rejected") return "bg-danger";
    if (status === "pending") return "bg-secondary";
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
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
      <div>
        <h5>Your Requests</h5>
        <div>
          {isUserRequestLoading ? (
            <PageLoader />
          ) : (
            userRequest?.map(request => (
              <div className="req-card">
                <div>
                  <p className="fw-bold mb-0 text-white">{request.alias}</p>
                  <p>
                    <small>Developer</small>
                  </p>
                </div>
                <div>
                  <p
                    className={`badge ${getColor(
                      Object.keys(request.status).join(",")
                    )} `}
                  >
                    {Object.keys(request.status).join(",")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Summary;
