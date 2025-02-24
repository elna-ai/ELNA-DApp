import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "stores/useUser";

const LoggedInRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);

    if (!isUserLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default LoggedInRoute;
