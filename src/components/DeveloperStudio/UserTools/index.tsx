import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { useGetUserTools } from "hooks/reactQuery/useDeveloperTools";
import { useUserStore } from "stores/useUser";

import Title from "./Title";
import ToolCard from "../ToolCard";

function UserTools() {
  const { t } = useTranslation();
  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
  const { data: userTools, isFetching: isUserToolsLoading } = useGetUserTools();

  if (!isUserLoggedIn) {
    return <></>;
  }

  if (isUserToolsLoading) {
    return (
      <div className="mt-5">
        <Title />
        <Spinner size="sm" />
      </div>
    );
  }

  if (userTools?.length === 0) {
    return (
      <div>
        <Title />
        <div>{t("developerStudio.noTools")}</div>
      </div>
    );
  }

  return (
    <div>
      <Title />
      <div className="d-flex flex-wrap gap-3">
        {userTools?.map(tool => (
          <ToolCard tool={tool} key={tool.id} />
        ))}
      </div>
    </div>
  );
}

export default UserTools;
