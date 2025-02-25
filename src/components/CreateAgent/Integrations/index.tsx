import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
// import { useGetAgentIntegrations } from "hooks/reactQuery/useAgents";
import PageLoader from "components/common/PageLoader";

import XIntegration from "./XIntegration";
// import TelegramIntegration from "./TelegramIntegrations";
import { Button } from "react-bootstrap";
import { useShowWizard } from "hooks/reactQuery/wizards/useWizard";
import { useCreateWizardStore } from "stores/useCreateWizard";
import { XAgentIntegration } from "src/types";

const integrationData: XAgentIntegration[] = [
  {
    x_api_key: "X_api_key",
    x_api_key_secret: "X_API_SECRET",
    x_access_token: "X_ACCESS_TOKEN",
    x_access_token_secret: "X_ACCESS_TOKEN_SECRET",
    x_bearer_token: "BEARER_TOKEN",
    agent_id: "AGENT_ID",
    owner: "principal-str",
    prompt: "agent prompt",
    integration_id: "int_id",
    agent_name: "agent name"
  },
];


function Integrations() {

  const { uuid } = useParams();
  const { t } = useTranslation();
  const wizardId = useCreateWizardStore(state => state.wizardId);
  const { data: wizard, isFetching: isLoadingWizard } = useShowWizard(wizardId || uuid);
  // const { data: integrationData, isFetching: isLoadingIntegrationData } = useGetAgentIntegrations(wizard?.id);

  if (isLoadingWizard
    //  || isLoadingIntegrationData
  ) return <PageLoader />
  return (
    <div>
      <div>
        <h3 className="sub-title-bot">{t("createAgent.integrations.options.title")}</h3>
        <div className="d-flex flex-column gap-2 mt-4">
          <XIntegration integrationData={integrationData?.find(integration => 'x_api_key' in integration)} />
          {/* <TelegramIntegration integrationData={integrationData?.find(integration => integration?.integration_type === "TELEGRAM")} /> */}
        </div>
      </div>
      <div>
        <h3 className="sub-title-bot">{t("createAgent.integrations.comingSoonOptions.title")}</h3>
        <div className="d-flex flex-column gap-2 mt-4">
          <div
            className="d-flex justify-content-between align-content-center w-100 rounded-3 p-3"
            style={{ backgroundColor: "#171D36" }}
          >
            <div className="d-flex flex-column justify-content-center gap-2">
              <span className="d-flex flex-wrap align-items-center gap-2">
                {t("createAgent.integrations.options.discordLabel")}
              </span>
            </div>
            <Button className="btn-knowledge" disabled>{t("createAgent.integrations.comingSoonOptions.connectBot")}</Button>
          </div>
          <div
            className="d-flex justify-content-between align-content-center w-100 rounded-3 p-3"
            style={{ backgroundColor: "#171D36" }}
          >
            <div className="d-flex flex-column justify-content-center gap-2">
              <span className="d-flex flex-wrap align-items-center gap-2">
                {t("createAgent.integrations.options.tradingBotLabel")}
              </span>
            </div>
            <Button className="btn-knowledge" disabled>{t("createAgent.integrations.comingSoonOptions.connectBot")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Integrations;
