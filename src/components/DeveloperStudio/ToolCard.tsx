import classNames from "classnames";

import {
  DeveloperToolStatus,
  DeveloperTool,
  DeveloperToolWithCreator,
} from "declarations/developer_studio/developer_studio.did";
import { ExtractKeysFromVariant } from "src/types";

function ToolCard({
  tool,
}: {
  tool: DeveloperToolWithCreator | DeveloperTool;
}) {
  const isDeveloperToolWithCreator = (
    tool: DeveloperTool | DeveloperToolWithCreator
  ): tool is DeveloperToolWithCreator => {
    return (tool as DeveloperToolWithCreator).creator !== undefined;
  };

  const getStatusColor = (
    status: ExtractKeysFromVariant<DeveloperToolStatus>
  ) => {
    switch (status) {
      case "pending":
        return "bg-secondary";
      case "approved":
        return "bg-primary";
      case "disabled":
        return "bg-warning";
      case "rejected":
        return "bg-danger";
      default:
        // check if switch exhaustive in comment to this answer(https://stackoverflow.com/a/58009992/7157529)
        status satisfies never;
        throw new Error(`Unhandled  case: ${status}`);
    }
  };

  const isUserTool = !isDeveloperToolWithCreator(tool);
  const status = Object.keys(
    tool.status
  )[0] as ExtractKeysFromVariant<DeveloperToolStatus>;

  return (
    <div className="tool-card">
      <div></div>
      <p className="text-center">{tool.name}</p>
      <div className="tool-card__footer">
        {isUserTool ? (
          <p className={classNames("badge", getStatusColor(status))}>
            {status}
          </p>
        ) : (
          <p>{tool.creator}</p>
        )}
        <p>{tool.category}</p>
      </div>
    </div>
  );
}

export default ToolCard;
