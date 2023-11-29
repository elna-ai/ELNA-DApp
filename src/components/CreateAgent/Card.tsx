import { useTranslation } from "react-i18next";

type BotProps = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

function Card({ bot }: { bot: BotProps }) {
  const { t } = useTranslation();

  return (
    <div className="card card-border contact-card elna-card">
      {/* <div className="hk-ribbon-type-1 overhead-center">
        <span>{bot.tag}</span>
      </div> */}
      <div className="card-img-overlay d-flex justify-content-center align-items-center coming-soon">
        <h5 className="card-title">{t("common.comingSoon")}</h5>
      </div>
      <div className="card-body text-center mt-4">
        <div className="avatar  position-relative">
          <img src={bot.imageUrl} alt="user" className="avatar-img" />
          <div className="badge-icon badge-icon-xxs text-blue position-bottom-end-overflow">
            <div className="badge-icon-wrap">
              <i className="ri-flashlight-fill"></i>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="161"
              height="176"
              viewBox="0 0 161 176"
              fill="none"
            >
              <path
                d="M62.9358 10.7231L62.9356 10.7233L22.4358 34.2232C22.4358 34.2232 22.4357 34.2232 22.4356 34.2233C17.1324 37.3001 12.7305 41.7161 9.67057 47.0291C6.61059 52.3421 4.99999 58.3658 5 64.497L5 111.748C4.99999 117.879 6.61059 123.903 9.67057 129.216C12.7305 134.529 17.1324 138.945 22.4356 142.022C22.4357 142.022 22.4358 142.022 22.4358 142.022L62.9356 165.522L62.9358 165.522C68.2717 168.618 74.3311 170.248 80.5 170.248C86.6689 170.248 92.7283 168.618 98.0642 165.522L98.0644 165.522L138.564 142.022C138.564 142.022 138.564 142.022 138.564 142.022C143.868 138.945 148.27 134.529 151.329 129.216C154.389 123.903 156 117.879 156 111.748V64.497C156 58.3658 154.389 52.3421 151.329 47.0291C148.27 41.7161 143.868 37.3001 138.564 34.2233C138.564 34.2232 138.564 34.2232 138.564 34.2232L98.0644 10.7233L98.0642 10.7231C92.7283 7.62738 86.6689 5.9969 80.5 5.9969C74.3311 5.9969 68.2717 7.62738 62.9358 10.7231Z"
                fill="currentColor"
                stroke="white"
                strokeWidth="10"
              ></path>
            </svg>
          </div>
        </div>

        <div className="user-name mt-4">
          <a
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#templateName"
            className="btn-link"
          >
            {bot.name}
          </a>
        </div>
        <div className="user-desg text-truncate">{bot.description}</div>
      </div>
      <div className="card-footer text-muted">
        <a href="#" className="d-flex align-items-center p-0">
          <button className="btn btn-success btn-animated">
            <span className="btn-text">
              {t("createAgent.templateStore.selectTemplate")}
            </span>
          </button>
        </a>
      </div>
    </div>
  );
}

// Card.propTypes = {
//   bot: PropTypes.shape({
//     id: PropTypes.string,
//     name: PropTypes.string,
//     description: PropTypes.string,
//     imageUrl: PropTypes.string,
//     tag: PropTypes.string,
//   }),
// };

export default Card;
