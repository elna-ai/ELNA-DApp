import { useGetAsset } from "hooks/reactQuery/useElnaImages";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import AvatarPlaceholder from "../../assets/avatar_placeholder.svg";
import classNames from "classnames";
import { useUserStore } from "stores/useUser";

interface CardProps {
  name: string;
  description: string;
  imageId?: string;
  userId?: string;
  id: string;
  isPublished?: boolean;
  messagesReplied: bigint;
  creatorName: string;
  tokenized?: boolean;
  handleDelete?: (id: string, name: string) => void;
  handlePublish?: (id: string, isPublished: boolean) => void;
  handleEdit?: (id: string) => void;
}

function Card({
  name,
  description,
  imageId,
  userId,
  id,
  isPublished,
  messagesReplied,
  creatorName,
  tokenized = false,
  handleDelete,
  handlePublish,
  handleEdit,
}: CardProps) {
  const { t } = useTranslation();
  const { data: avatarData } = useGetAsset(imageId);
  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);

  const displayAddress = (principal: string) => {
    const firstPart = principal.substring(0, 5);
    const lastPart = principal.substring(principal.length - 3);
    return `${firstPart}...${lastPart}`;
  };
  const creator = creatorName ? creatorName : displayAddress(userId || "");

  const navigate = useNavigate();

  return (
    <div className="col"
      onClick={() => {
        if (isUserLoggedIn) return;
        navigate(`/chat/${id}`);
      }}>
      <div className="card card-border contact-card elna-card">
        <div className="card-body text-center">
          <div className="d-flex">
            {tokenized ? (
              <i
                className="ri-coin-fill"
                style={{ color: "var(--elna-primary-color)" }}
              />
            ) : (
              <div style={{ minHeight: "30px" }} />
            )}
            {!!handleDelete && (
              <Dropdown className="card-body-menu">
                <Dropdown.Toggle
                  variant="dark"
                  className="card-body-menu-button"
                >
                  <i className="ri-more-line" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {handleEdit && (
                    <Dropdown.Item onClick={() => handleEdit(id)}>
                      {t("common.edit", { entity: "agent" })}
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    onClick={() => handleDelete(id, name)}
                    className="card-dropdown-delete"
                  >
                    {t("common.delete", { entity: "agent" })}
                  </Dropdown.Item>
                  {/* <Dropdown.Item
                    onClick={() =>
                      navigate(`/agents/${id}/integrations/chat-widget`)
                    }
                  >
                    {t("common.integrate", { entity: "agent" })}
                  </Dropdown.Item> */}
                  {handlePublish && (
                    <Dropdown.Item
                      onClick={() => handlePublish(id, !isPublished)}
                    >
                      {isPublished ? "Unpublish agent" : "Publish agent"}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          <div className="avatar avatar-xl avatar-rounded">
            <img
              src={avatarData?.asset || AvatarPlaceholder}
              alt="avatar image"
              className="avatar-img"
            />
          </div>
          <div className="user-name text-truncate">
            {isUserLoggedIn ? (
              <Link to={`/chat/${id}`} className="btn-link stretched-link">
                {name}
              </Link>
            ) : (
              <Link to={`/login`} className="btn-link stretched-link">
                {name}
              </Link>
            )}
          </div>
          <div className="user-desg text-truncate">{description}</div>
        </div>
        <div className="d-flex flex-wrap card-footer position-relative justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-1">
            <i className="ri-chat-4-line"></i>
            <span>{messagesReplied.toString()}</span>
          </div>
          {!!handleDelete && (
            <span
              className={classNames("badge tool-card__footer__badge mb-0 mx-2", {
                "bg-secondary": !isPublished,
                "bg-primary": isPublished,
              })}
            >
              {isPublished ? "Published" : "Unpublished"}
            </span>
          )}
          <span className="fs-7 lh-1">{creator}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
