import { Link } from "react-router-dom";

interface CardProps {
  name: string;
  description: string;
  imageUrl?: string;
  userId?: string;
  id: string;
}

function Card({ name, description, imageUrl, userId, id }: CardProps) {
  const Avatar = ({ name }: { name: string }) => (
    <div className="avatar avatar-xl avatar-soft-primary avatar-rounded bg-gray-300 text-green-700">
      <span className="initial-wrap">{name[0].toUpperCase()}</span>
    </div>
  );

  return (
    <div className="col">
      <div className="card card-border contact-card elna-card">
        <div className="card-body text-center">
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
              <span className="fs-7 lh-1">{userId}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
