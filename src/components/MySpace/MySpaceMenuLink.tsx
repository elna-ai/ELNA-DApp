import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { MySpaceMenuProps } from "./constant";

function MySpaceMenuLink({ link }: { link: MySpaceMenuProps }) {

    const location = useLocation();
    return (
        <Link className={classNames("myspace__tab__navlink", {
            "myspace__tab__navlink--active": location.pathname === link.to,
        })} to={link.to}>
            <span className="mr-1">{link.key}</span>
        </Link>
    );
}

export default MySpaceMenuLink;