import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import classNames from "classnames";
import NoToolImg from "images/no-tool.png";

import {
  DeveloperToolStatus,
  DeveloperTool,
  DeveloperToolWithCreator,
} from "declarations/developer_studio/developer_studio.did";
import { VariantKeys } from "src/types";

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
  const navigate = useNavigate();
  const getStatusColor = (
    status: VariantKeys<DeveloperToolStatus>
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
  )[0] as VariantKeys<DeveloperToolStatus>;

  return (
    <div
      onClick={() => navigate(`/tool-details/${tool.id}`)}
      className="tool-card"
    >
      <div className="tool-card__cover">
        <img
          className="tool-card__cover__img img-fluid"
          src={ tool.coverImage[0] || NoToolImg }
          alt="no tool image"
        />
      </div>
      <p className="tool-card__title text-left text-truncate">{tool.name}</p>
      <p className="tool-card__desc text-left text-truncate">
        {tool.description}
      </p>
      <p className="tool-card__footer__url text-truncate mb-0">
        <a href={tool.projectUrl} target="_blank" rel="noopener noreferrer">
          <i className="ri-external-link-fill me-2"></i> {tool.projectUrl}
        </a>
      </p>
      <hr />
      <div className="tool-card__footer">
        {isUserTool ? (
          <p
            className={classNames(
              "badge",
              "tool-card__footer__badge",
              "mb-0",
              getStatusColor(status)
            )}
          >
            {status}
          </p>
        ) : (
          <p className="tool-card__footer__creator">
            <i className="ri-at-fill"></i> {tool.creator}
          </p>
        )}
        <p className="tool-card__footer__category">
          <i className="ri-honour-fill me-2"></i>
          {tool.category}
        </p>
      </div>
    </Link>
  );
}

export default ToolCard;
