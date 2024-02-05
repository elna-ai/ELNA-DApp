import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

type CardProps = {
  title: string;
  isLearning: boolean;
};

function Card({ title, isLearning }: CardProps) {
  const { t } = useTranslation();

  return (
    <div className="col">
      <div className="card card-border contact-card elna-card p-4 max-h-80">
        <h3 className="sub-title-bot mt-0 d-flex mt-2 gap-1 align-items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="flex-shrink-0"
          >
            <path
              d="M5 4H15V8H19V20H5V4ZM3.9985 2C3.44749 2 3 2.44405 3 2.9918V21.0082C3 21.5447 3.44476 22 3.9934 22H20.0066C20.5551 22 21 21.5489 21 20.9925L20.9997 7L16 2H3.9985ZM10.4999 7.5C10.4999 9.07749 10.0442 10.9373 9.27493 12.6534C8.50287 14.3757 7.46143 15.8502 6.37524 16.7191L7.55464 18.3321C10.4821 16.3804 13.7233 15.0421 16.8585 15.49L17.3162 13.5513C14.6435 12.6604 12.4999 9.98994 12.4999 7.5H10.4999ZM11.0999 13.4716C11.3673 12.8752 11.6042 12.2563 11.8037 11.6285C12.2753 12.3531 12.8553 13.0182 13.5101 13.5953C12.5283 13.7711 11.5665 14.0596 10.6352 14.4276C10.7999 14.1143 10.9551 13.7948 11.0999 13.4716Z"
              fill="rgba(0,125,136,1)"
            ></path>
          </svg>
          <span className="text-truncate">{title}</span>
        </h3>
        <hr className="mt-1 mb-1" />
        {isLearning ? (
          <div className="d-flex mt-2 gap-1 align-items-center">
            <div className="lds-elna">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span className="text-xs sub-title-color">
              {t("common.learning")}
            </span>
          </div>
        ) : (
          <div className="d-flex mt-2 gap-1 align-items-center">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM11.2929 12.1213L8.81802 9.64645L7.40381 11.0607L11.2929 14.9497L16.9497 9.29289L15.5355 7.87868L11.2929 12.1213Z"
                  fill="rgba(28,160,89,1)"
                ></path>
              </svg>
            </span>
            <span className="text-xs sub-title-color">
              {t("common.learned")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  isLearning: PropTypes.bool,
};

export default Card;
