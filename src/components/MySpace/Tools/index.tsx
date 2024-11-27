import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { useIsDeveloper } from "hooks/reactQuery/useDeveloper";
import { useGetUserTools } from "hooks/reactQuery/useDeveloperTools";
import { useNavigate } from "react-router-dom";

import NoTools from "./NoTools";
import NoDeveloperAccess from "./NoDeveloperAccess";
import { Button } from "react-bootstrap";

//check and make common
import ToolCard from "../../DeveloperStudio/ToolCard";

function UserTools() {
  const { t } = useTranslation();
  const { data: isDeveloper, isFetching: isLoading } = useIsDeveloper();
  const { data: userTools, isFetching: isUserToolsLoading } = useGetUserTools();
  const navigate = useNavigate();

  const Title = () => {
    return (
      <div>
        <div>
          <h5>Tools</h5>
          <p>Each skilled......</p>
        </div>
        {userTools && userTools?.length > 0 && (
          <Button
            disabled={!isDeveloper}
            onClick={() => navigate("my-space/my-tools/create-tool")}
          >
            {t("developerStudio.createBanner.listATool")}
          </Button>
        )}
      </div>
    );
  };

  const renderBody = () => {
    if (isUserToolsLoading) {
      return <Spinner size="sm" />;
    }

    if (!isDeveloper) {
      return <NoDeveloperAccess />;
    }

    if (userTools?.length === 0 || !userTools) {
      return <NoTools />;
    }

    if (userTools?.length > 0 && !isUserToolsLoading) {
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
