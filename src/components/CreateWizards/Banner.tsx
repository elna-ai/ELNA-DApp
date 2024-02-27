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
      <div className="d-flex gap-3 banner__inbox">
        <div className="banner__sns-icon">
          <i className="ri-fire-fill ri-2x"></i>
        </div>
        <div>
          <h3 className="banner__title">We are Going Live on SNS</h3>
          {isExpanded && (
            <div className="banner__description">
              Shape the revolution of community driven AI on chain. Your vote
              fuels transparency and innovation.
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="d-flex gap-2">
          <button>
            <a
              href="https://nns.ic0.app/proposal/?u=qoctq-giaaa-aaaaa-aaaea-cai&proposal=128102"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-eye-fill"></i> View SNS
            </a>
          </button>
          <button>
            <a
              href="https://nns.ic0.app/proposal/?u=qoctq-giaaa-aaaaa-aaaea-cai&proposal=128102"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-thumb-up-fill"></i> Vote SNS
            </a>
          </button>
        </div>
      )}
    </div>
  );
}

export default Banner;
