import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { useIsDeveloper, useGetUserRequest } from "hooks/reactQuery/useDeveloper";
import { useGetUserTools } from "hooks/reactQuery/useDeveloperTools";
import { useNavigate } from "react-router-dom";

import NoTools from "./NoTools";
import NoDeveloperAccess from "./NoDeveloperAccess";
import { Button } from "react-bootstrap";

//check and make common
import ToolCard from "../../DeveloperStudio/ToolCard";
import { use } from "i18next";

function UserTools() {
  const { t } = useTranslation();
  const { data: isDeveloper, isFetching: isLoading } = useIsDeveloper();
  const { data: userRequest, isFetching: isUserRequestLoading } = useGetUserRequest();
  const { data: userTools, isFetching: isUserToolsLoading } = useGetUserTools();
  const navigate = useNavigate();

  const Title = () => {
    return (
      <div className="mytools">
        <div className="mytools__header">
          <div>
            <h5>{t("mySpace.myTools.toolsHeader")}</h5>
            <p>{t("mySpace.myTools.toolsHeaderDesc")}</p>
          </div>
          {userTools && userTools?.length > 0 && (
            <Button
              className="mytools__header__btn"
              disabled={!isDeveloper}
              onClick={() => navigate("create-tool")}
            >
              {t("developerStudio.createBanner.listATool")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderBody = () => {
    if (isLoading || isUserRequestLoading) {
      return <Spinner size="sm" />;
    }

    if (!isLoading && !isDeveloper) {
      if (!isUserRequestLoading && userRequest && userRequest?.length > 0) {
        if (Object.keys(userRequest[userRequest?.length - 1]?.status)[0] !== "approved") {
          return <NoDeveloperAccess access={Object.keys(userRequest[userRequest?.length - 1]?.status)[0]} />
        }
      }
      else return <NoDeveloperAccess />
    }

    if (userTools?.length === 0) {
      return <NoTools />;
    }

    if (userTools && userTools?.length > 0 && !isUserToolsLoading) {
      return (
        <div className="d-flex flex-wrap gap-3">
          {userTools?.map(tool => (
            <ToolCard tool={tool} key={tool.id} />
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <Title />
      {renderBody()}
    </div>
  );
}

export default UserTools;
