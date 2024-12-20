import { useGetAsset } from "hooks/reactQuery/useElnaImages";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AvatarPlaceholder from "../../assets/avatar_placeholder.svg"

interface CardProps {
  name: string;
  description: string;
  imageId?: string;
  userId?: string;
  id: string;
  isPublished?: boolean;
  messagesReplied: bigint;
  creatorName: string;
  price?: number;
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
  price = 0,
  handleDelete,
  handlePublish,
  handleEdit,
}: CardProps) {
  const { t } = useTranslation();
  const { data: avatarData } = useGetAsset(imageId);

  const displayAddress = (principal: string) => {
    const firstPart = principal.substring(0, 5);
    const lastPart = principal.substring(principal.length - 3);
    return `${firstPart}...${lastPart}`;
  };
  const creator = creatorName ? creatorName : displayAddress(userId || "");

  return (
    <div className="d-flex justify-content-center align-content-center">
      <div className="card card-border contact-card elna-card w-100">
        <div className="card-body text-center">
          <div className="d-flex">
            <div className="card-body__price">
              {!price ? t("common.free") : price}
            </div>
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
            <Link to={`/chat/${id}`} className="btn-link stretched-link">
              {name}
            </Link>
          </div>
          <div className="user-desg text-truncate">{description}</div>
        </div>
        <div className="d-flex card-footer position-relative align-items-center">
          <div className="d-flex align-items-center gap-1">
            <i className="ri-chat-4-line"></i>
            <span>{messagesReplied.toString()}</span>
          </div>
          <span className="fs-7 ms-auto lh-1">{creator}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
