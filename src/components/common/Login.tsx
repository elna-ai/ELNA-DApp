import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "stores/useUser";
import { LoginButtonWrapper } from "./LoginButtonWrapper";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Login = () => {

    const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (isUserLoggedIn) {
            navigate(location.state?.from?.pathname || "/", { replace: true });
        }
    }, [isUserLoggedIn]);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 mb-4 text-center">
            <h2 className="mb-3">Please log in to continue</h2>
            <p className="mb-4">Connect your wallet to access the application.</p>
            <LoginButtonWrapper>
                <Button variant="primary">{t("header.connectWallet")}</Button>
            </LoginButtonWrapper>
        </div>
    );
};

export default Login;
