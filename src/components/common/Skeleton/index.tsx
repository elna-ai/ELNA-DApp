import style from "./Sekeleton.module.scss";

import { SkeletonText } from "../SkeletonText";
export const Skeleton: React.FC = () => {
  return (
    <div className="col">
      <div className={"card card-border contact-card elna-card " + style.card}>
        <div className="card-body text-center">
          <div className="d-flex">
            <div style={{ minHeight: "30px" }} />
          </div>
          <div
            className="avatar avatar-lg avatar-rounded"
            style={{ width: 80, height: 80 }}
          >
            <SkeletonText
              style={{
                width: 80,
                height: 80,
                display: "inline-block",
                borderRadius: "50%",
              }}
            />
          </div>
          <div
            className="user-name text-truncate"
            style={{ textAlign: "center", marginTop: 8 }}
          >
            <SkeletonText
              style={{ height: 8, width: 80, display: "inline-block" }}
            />
          </div>
          <div
            className="user-desg text-truncate"
            style={{ textAlign: "center" }}
          >
            <SkeletonText
              style={{ height: 8, width: 50, display: "inline-block" }}
            />
          </div>
        </div>
        <div className="d-flex flex-wrap card-footer position-relative justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-1">
            <SkeletonText
              style={{ height: 8, width: 30, display: "inline-block" }}
            />
          </div>

          <span className="fs-7 lh-1">
            <SkeletonText
              style={{ height: 8, width: 20, display: "inline-block" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};
