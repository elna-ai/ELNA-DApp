import { useState } from "react";

function Banner() {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div
      className="sticky-bottom end-0 banner__wrapper"
      style={{ width: isExpanded ? "100%" : "max-content" }}
    >
      <span
        className="banner__expand-icon"
        style={{ rotate: isExpanded ? "0deg" : "-45deg" }}
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <i
          className={
            isExpanded ? "ri-contract-up-down-fill" : "ri-expand-up-down-fill"
          }
        ></i>
      </span>
      <i className="ri-fire-fill ri-3x"></i>
      <div>
        <h3 className="banner__title">We are Going Live on SNS</h3>
        {isExpanded && (
          <div className="banner__description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            scelerisque sem id sem auctor, id blandit felis tincidunt. Nulla
            malesuada.
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="d-flex gap-1">
          <button>View SNS</button>
          <button>Vote SNS</button>
        </div>
      )}
    </div>
  );
}

export default Banner;
