import { Routes, Route } from "react-router-dom";
import { useIntegrationsLogin } from "hooks/reactQuery/wizards/useIntegrations";
import { useEffect } from "react";
import { useUserStore } from "stores/useUser";
import { useGenerateUserToken } from "hooks/reactQuery/useUser";
import Cookies from "js-cookie";
import { useWallet } from "hooks/useWallet";

import Create from "./Create";

function CreateAgent() {
  const wallet = useWallet();
  const userToken = useUserStore(state => state.userToken);
  const { mutate: generateUserToken, isPending: isGeneratingToken } =
    useGenerateUserToken();
  const { mutate: loginExternalService } = useIntegrationsLogin();

  useEffect(() => {
    if (userToken) return;
    generateUserToken();
  }, [userToken]);

  useEffect(() => {
    if (Cookies.get("integrations_token")) return;
    if (!userToken) return;
    if (!wallet?.principalId) return;
    if (isGeneratingToken) return;

    loginExternalService({ token: userToken, principalId: wallet.principalId });
  }, [userToken, wallet?.principalId, isGeneratingToken]);

  return (
    <Routes>
      <Route path="/edit/:uuid?" element={<Create />} />
    </Routes>
  );
}

export default CreateAgent;
