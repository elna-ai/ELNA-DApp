import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useShowTool } from "hooks/reactQuery/useDeveloperTools";
import classNames from "classnames";
import NoToolImg from "images/no-tool.png";
import { Button } from "react-bootstrap";

function ToolDetails() {

    const { id } = useParams();
    const {
        data: tool,
        isFetching: isLoadingTool,
        error,
        isError,
      } = useShowTool(id);

    const navigate = useNavigate();

    console.log(tool)


  return (
    <div className="d-flex flex-column">
        <Button onClick={() => navigate(-1)}>Back</Button>
        <div className="d-flex justify-content-between">
            <div className="d-flex">
                <img className="w-25" src={NoToolImg} alt="" />
                <div>
                    <h1>Nordpass</h1>
                    <h2>
                        Created by
                        <p>@namotox</p>
                    </h2>
                </div>
            </div>
            <Button onClick={() => navigate(-1)}>Try Now</Button>
        </div>

        <img
          className="tool-card__cover__img img-fluid"
          src={NoToolImg}
          alt="no tool image"
        />

        <div className="d-flex justify-content-center align-items-center">
            <Link to={"/"}>Presentation Link</Link>
            <Link to={"/"}>Github Link</Link>
        </div>

        <div>
            <h2>Description</h2>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                pariatur, eum quae quia quod, voluptate quibusdam voluptas
            </p>
        </div>
    </div>
  );
}

export default ToolDetails;
