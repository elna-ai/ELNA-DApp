import PageLoader from "components/common/PageLoader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShowTool } from "hooks/reactQuery/useDeveloperTools";
import NoToolImg from "images/placeholder-tools.webp";
import NoToolIconImg from "images/placeholder-tool-icon.webp";
import { Button } from "react-bootstrap";
import { useGetAsset } from "hooks/reactQuery/useElnaImages";

function ToolDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tool, isFetching: isLoadingTool } = useShowTool(id);
  const { data: icon } = useGetAsset(tool?.icon[0]);
  const { data: cover } = useGetAsset(tool?.coverImage[0]);

  if (isLoadingTool) {
    return <PageLoader />;
  }

  if (isLoadingTool) {
    return <PageLoader />;
  }
  return (
    <div className="tooldetail">
      <div className="tooldetail__back">
        <Button
          className="tooldetail__back__btn"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <i className="ri-arrow-left-s-line"></i>
          Back
        </Button>
      </div>
      <div className="tooldetail__header">
        <div className="tooldetail__header__details">
          <picture>
            <source srcSet={icon?.asset} type="image/webp" />
            <source srcSet={NoToolIconImg} type="image/webp" />
            <img
              src={icon?.asset}
              className="tooldetail__header__details__img"
              alt=""
            />
          </picture>
          <div className="tooldetail__header__details__content">
            <h1>{tool?.name}</h1>
            <p className="tooldetail__header__details__content__user">
              <span>Created by</span>
              <span style={{ color: "var(--elna-primary-color)" }}>
                &nbsp;@{tool?.creator}
              </span>
            </p>
            <p className="tooldetail__header__details__content__category">
              <i className="ri-honour-fill me-2"></i>
              {tool?.category}
            </p>
          </div>
        </div>
        {tool?.demoUrl[0] && (
          <Button
            className="tooldetail__header__demobtn"
            onClick={() => {
              if (tool?.demoUrl[0]) window.open(tool?.demoUrl[0]);
            }}
            disabled={!tool?.demoUrl[0]}
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Now
          </Button>
        )}
      </div>
      <div className="tooldetail__img">
        <img
          className="img-fluid"
          src={cover?.asset || NoToolImg}
          alt="no tool image"
        />
      </div>
      <div className="tooldetail__body">
        <div className="tooldetail__body__btn">
          {tool?.presentationUrl[0] && (
            <Link
              className="tooldetail__body__btn__link"
              to={tool?.presentationUrl[0]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-slideshow-3-fill"></i>
              Presentation Link
            </Link>
          )}
          {tool?.projectUrl && (
            <Link
              className="tooldetail__body__btn__link"
              to={tool?.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-github-fill"></i>
              Github Link
            </Link>
          )}
        </div>

        <div>
          <h4>Description</h4>
          <p>{tool?.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ToolDetails;
