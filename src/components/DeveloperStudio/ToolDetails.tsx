import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useShowTool } from "hooks/reactQuery/useDeveloperTools";
import NoToolImg from "images/placeholder-tools.png";
import NoToolIconImg from "images/placeholder-tool-icon.png";
import { Button } from "react-bootstrap";

import PresentationIcon from "../../assets/presentation_icon.svg?react";
import GithubIcon from "../../assets/github_icon.svg?react";

function ToolDetails() {
  const { id } = useParams();
  const {
    data: tool,
    isFetching: isLoadingTool,
    error,
    isError,
  } = useShowTool(id);

  const navigate = useNavigate();

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
            <source srcSet={tool?.icon[0]} type="image/webp" />
            <source srcSet={NoToolIconImg} type="image/webp" />
            <img src={tool?.icon[0]} className="tooldetail__header__details__img" alt="" />
          </picture>
          <div className="tooldetail__header__details__content">
            <h1>{tool?.name}</h1>
            <p className="tooldetail__header__details__content__user">
              <span>Created by</span>
              <span>
                <Link to={"/"}>@namotox</Link>
              </span>
            </p>
            <p className="tooldetail__header__details__content__category">
              <i className="ri-honour-fill me-2"></i>
              {tool?.category}
            </p>
          </div>
        </div>
        <Button
          className="tooldetail__header__demobtn"
          onClick={() => {
            if (tool?.demoUrl[0]) navigate(tool?.demoUrl[0])
          }}
          disabled={!tool?.demoUrl[0]}
          target="_blank" rel="noopener noreferrer"
        >
          Try Now
        </Button>
      </div>
      <div className="tooldetail__img">
        <picture>
          <source srcSet={tool?.coverImage[0]} type="image/webp" />
          <source srcSet={NoToolImg} type="image/webp" />
          <img className="img-fluid" src={NoToolImg} alt="no tool image" />
        </picture>
      </div>
      <div className="tooldetail__body">
        <div className="tooldetail__body__btn">
          {
            tool?.presentationUrl[0] && (
              <Link className="tooldetail__body__btn__link" to={tool?.presentationUrl[0]} target="_blank" rel="noopener noreferrer" >
                <PresentationIcon />
                Presentation Link
              </Link>
            )
          }
          {
            tool?.projectUrl && (
              <Link className="tooldetail__body__btn__link" to={tool?.projectUrl} target="_blank" rel="noopener noreferrer" >
                <GithubIcon />
                Github Link
              </Link>
            )
          }
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
