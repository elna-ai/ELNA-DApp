import { Spinner } from "react-bootstrap";

import { useGetApprovedTools } from "hooks/reactQuery/useDeveloperTools";

import ToolCard from "../ToolCard";
import Title from "./Title";

function AllTools() {
  const { data: allTools, isFetching: isToolsLoading } = useGetApprovedTools();

  if (isToolsLoading) {
    return (
      <div className="mt-5">
        <Title />
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <Title />
      <div className="d-flex flex-wrap gap-3">
        {allTools?.map(tool => (
          <ToolCard tool={tool} key={tool.id} />
        ))}
      </div>
    </div>
  );
}

export default AllTools;
