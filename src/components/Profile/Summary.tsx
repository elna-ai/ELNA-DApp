import { Badge, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import PageLoader from "components/common/PageLoader";
import {
  useGetUserRequest,
  useIsDeveloper,
} from "hooks/reactQuery/useDeveloper";
import { useWallet } from "hooks/useWallet";
import { generateTwitterShareLink } from "utils/index";

import { TWITTER_HASHTAGS, TWITTER_SHARE_CONTENT } from "./constants";

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
        <div>
          {isUserRequestLoading ? (
            <PageLoader />
          ) : (
            userRequest?.map(request => (
              <div className="user_profile__summary__req-card">
                <div>
                  <p className="fw-bold mb-0 text-white">{request.alias}</p>
                  <p className="d-flex gap-1">
                    <i className="ri-code-box-fill user_profile__summary__req-card__icon"></i>
                    <small className="user_profile__summary__req-card__developer">
                      Developer
                    </small>
                  </p>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <p
                    className={`user_profile__summary__req-card__tag ${getColor(
                      Object.keys(request.status).join(",")
                    )} `}
                  >
                    {Object.keys(request.status).join(",")}
                  </p>
                  {isDeveloper && (
                    <a
                      className="btn btn-secondary user_profile__summary__req-card__x-share"
                      href={generateTwitterShareLink(
                        TWITTER_SHARE_CONTENT,
                        TWITTER_HASHTAGS
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="user_profile__summary__req-card__x-share__svg"
                        >
                          <path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"></path>
                        </svg>
                      </span>
                      <span className="text-xs sub-title-color">Share</span>
                    </a>
                  )}
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
