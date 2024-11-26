import { Routes, Route } from "react-router-dom";

import { useWallet } from "hooks/useWallet";
import { useUserStore } from "stores/useUser";
import { useGetUserProfile } from "hooks/reactQuery/useUser";

import NoLogin from "./NoLogin";
import Profile from "./Profile";
import AddDetails from "./Profile/AddDetails";
import MyWizards from "./Agents";
import UserTools from "./Tools";
import CreateTool from "./Tools/CreateTool";
import DeveloperRequest from "./DeveloperRequest";
import MySpaceMenuLink from "./MySpaceMenuLink";
import { MY_SPACE_LINK, MySpaceMenuProps } from "./constant";

function MySpace() {

    const wallet = useWallet();
    const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
    const { data: userProfile, isFetching: isUserProfileLoading } = useGetUserProfile(wallet?.principalId);

    return (
        <>
            {(!isUserLoggedIn || !userProfile) && <NoLogin />}
            <div className="d-flex align-items-top justify-content-between mt-4 mb-2">
                <div className="myspace__title">
                    <h5 className="flex gap-2">
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                            >
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                    d="M15.2238 15.5078L13.0111 20.1579C12.8687 20.4572 12.5107 20.5843 12.2115 20.4419C12.1448 20.4102 12.0845 20.3664 12.0337 20.3127L8.49229 16.574C8.39749 16.4739 8.27113 16.4095 8.13445 16.3917L3.02816 15.7242C2.69958 15.6812 2.46804 15.3801 2.51099 15.0515C2.52056 14.9782 2.54359 14.9074 2.5789 14.8425L5.04031 10.3191C5.1062 10.198 5.12839 10.0579 5.10314 9.92241L4.16 4.85979C4.09931 4.53402 4.3142 4.22074 4.63997 4.16005C4.7126 4.14652 4.78711 4.14652 4.85974 4.16005L9.92237 5.10319C10.0579 5.12843 10.198 5.10625 10.319 5.04036L14.8424 2.57895C15.1335 2.42056 15.4979 2.52812 15.6562 2.81919C15.6916 2.88409 15.7146 2.95495 15.7241 3.02821L16.3916 8.13449C16.4095 8.27118 16.4739 8.39754 16.5739 8.49233L20.3127 12.0337C20.5533 12.2616 20.5636 12.6414 20.3357 12.8819C20.2849 12.9356 20.2246 12.9794 20.1579 13.0111L15.5078 15.2238C15.3833 15.2831 15.283 15.3833 15.2238 15.5078ZM16.0206 17.4349L17.4348 16.0207L21.6775 20.2633L20.2633 21.6775L16.0206 17.4349Z"
                                    fill="#ffc107"
                                ></path>
                            </svg>
                        </span>{" "}
                        My Space
                    </h5>
                </div>
            </div>
            <ul className="navbar-nav">
                <div className="myspace__tab">
                    {MY_SPACE_LINK.map((link: MySpaceMenuProps) => (
                        <MySpaceMenuLink link={link} key={link.key} />
                    ))}
                </div>
            </ul>

            <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/add" element={<AddDetails />} />
                <Route path="/my-agents" element={<MyWizards />} />
                <Route path="/my-tools" element={<UserTools />} />
                <Route path="/my-tools/create-tool" element={<CreateTool />} />
                <Route path="/request/developer" element={<DeveloperRequest />} />
            </Routes>
        </>
    );
}

export default MySpace;