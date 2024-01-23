import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useIsUserAdmin } from "hooks/reactQuery/useUser";

type PrivateRouteProps = {
  component: React.ComponentType;
  path?: string;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: RouteComponent,
}) => {
  const { data: isAdmin } = useIsUserAdmin();

  if (isAdmin) {
    return <RouteComponent />;
  }

  toast.error("Access denied");
  return <Navigate to="/" />;
};

export default PrivateRoute;
