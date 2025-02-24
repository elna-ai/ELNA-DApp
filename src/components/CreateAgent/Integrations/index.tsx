import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
// import { useGetAgentIntegrations } from "hooks/reactQuery/useAgents";
import PageLoader from "components/common/PageLoader";

import XIntegration from "./XIntegration";
import TelegramIntegration from "./TelegramIntegrations";
import { Button } from "react-bootstrap";
import { useShowWizard } from "hooks/reactQuery/wizards/useWizard";
import { useCreateWizardStore } from "stores/useCreateWizard";
import { AgentIntegrationData } from "src/types";

const integrationData: AgentIntegrationData[] = [
  {
    credentials: {
      x_api_key: "abc123",
      x_access_token: "def456",
      x_api_key_secret: "ghi789",
      x_access_token_secret: "jkl012",
      x_bearer_token: "mno345",
      user_id: "user_1",
    },
    agent_owner: "owner_1",
    agent_name: "X Agent 1",
    agent_prompt: "This is the first X integration",
    is_enabled: true,
    integration_type: "X",
    integration_id: "integration_x_1",
  },
  {
    credentials: {
      x_api_key: "xyz987",
      x_access_token: "uvw654",
      x_api_key_secret: "rst321",
      x_access_token_secret: "opq000",
      x_bearer_token: "lmn111",
      user_id: "user_2",
    },
    agent_owner: "owner_2",
    agent_name: "X Agent 2",
    agent_prompt: "Another X integration",
    is_enabled: false,
    integration_type: "X",
    integration_id: "integration_x_2",
  },
  {
    credentials: {
      telegram_api_key: "telegram_abc123",
    },
    agent_owner: "owner_3",
    agent_name: "Telegram Agent 1",
    agent_prompt: "This is a Telegram bot integration",
    is_enabled: true,
    integration_type: "TELEGRAM",
    integration_id: "integration_telegram_1",
  },
  {
    credentials: {
      telegram_api_key: "telegram_xyz789",
    },
    agent_owner: "owner_4",
    agent_name: "Telegram Agent 2",
    agent_prompt: "Another Telegram bot integration",
    is_enabled: true,
    integration_type: "TELEGRAM",
    integration_id: "integration_telegram_2",
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
          <XIntegration integrationData={integrationData?.find(integration => integration?.integration_type === "X")} />
          <TelegramIntegration integrationData={integrationData?.find(integration => integration?.integration_type === "TELEGRAM")} />
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
