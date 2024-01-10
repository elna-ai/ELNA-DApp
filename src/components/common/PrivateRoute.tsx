import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

type PrivateRouteProps = {
  component: React.ComponentType;
  path?: string;
  isAdmin: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: RouteComponent,
  isAdmin,
}) => {
  if (isAdmin) {
    return <RouteComponent />;
  }

  toast.error("Access denied");
  return <Navigate to="/" />;
};

export default PrivateRoute;
