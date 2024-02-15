import useGetDisplayAddress from "hooks/useGetDisplayAddress";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface CardProps {
  name: string;
  description: string;
  imageUrl?: string;
  userId?: string;
  id: string;
  isPublished?: boolean;
  messagesReplied: bigint;
  handleDelete?: (id: string, name: string) => void;
  handlePublish?: (id: string, isPublished: boolean) => void;
}

function Card({
  name,
  description,
  imageUrl,
  userId,
  id,
  isPublished,
  messagesReplied,
  handleDelete,
  handlePublish,
}: CardProps) {
  const { t } = useTranslation();

  const displayAddress = (principal: string) => {
    const firstPart = principal.substring(0, 5);
    const lastPart = principal.substring(principal.length - 3);
    return `${firstPart}...${lastPart}`;
  };

  const Avatar = ({ name }: { name: string }) => (
    <div className="avatar avatar-xl avatar-soft-primary avatar-rounded bg-gray-300 text-green-700">
      <span className="initial-wrap">{name[0].toUpperCase()}</span>
    </div>
  );

  return (
    <div className="col">
      <div className="card card-border contact-card elna-card">
        <div className="card-body text-center">
          {!!handleDelete && (
            <Dropdown className="card-body-menu">
              <Dropdown.Toggle variant="dark" className="card-body-menu-button">
                <i className="ri-more-line" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
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
          <div className="avatar avatar-xl avatar-rounded">
            {imageUrl ? (
              <img src={imageUrl} alt="user" className="avatar-img" />
            ) : (
              <Avatar {...{ name }} />
            )}
          </div>
          <div className="user-name text-truncate">
            <Link to={`/chat/${id}`} className="btn-link stretched-link">
              {name}
            </Link>
          </div>
          <div className="user-desg text-truncate">{description}</div>
        </div>
        {userId && (
          <div className="card-footer text-muted position-relative">
            <a href="#" className="d-flex align-items-center p-0">
              <span className="fs-7 lh-1">{displayAddress(userId)}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
