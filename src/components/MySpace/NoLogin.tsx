import { Modal } from "react-bootstrap";
import { useUserStore } from "stores/useUser";
import { useWallet } from "hooks/useWallet";
import CompleteLogin from "components/common/CompleteLogin";
import CompleteProfile from "components/common/CheckWizardNameCreate/CompleteProfile";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetUserProfile } from "hooks/reactQuery/useUser";
import { Spinner } from "react-bootstrap";

function NoLogin() {
    const { t } = useTranslation();

    const wallet = useWallet();
    const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
    const { data: userProfile, isFetching: isUserProfileLoading } = useGetUserProfile(wallet?.principalId);
    const navigate = useNavigate();

    const renderBody = () => {
        if (isUserProfileLoading) return (
            <div className="ratio ratio-21x9">
                <div className="d-flex align-items-center justify-content-center">
                    <Spinner />
                </div>
            </div>
        )
        if (!isUserLoggedIn) return <CompleteLogin />;
        if (!userProfile) return <CompleteProfile />
    }

    return (
        <>
            <div className="w-100 py-5 text-center">
                <Modal
                    className="bot-name-modal"
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={!isUserLoggedIn || !userProfile}
                    onHide={() => {
                        if (userProfile && isUserLoggedIn) navigate("/my-space/profile");
                        else navigate("/");
                    }}
                >
                    {renderBody()}
                </Modal>
            </div>
        </>
    );
}

export default NoLogin;