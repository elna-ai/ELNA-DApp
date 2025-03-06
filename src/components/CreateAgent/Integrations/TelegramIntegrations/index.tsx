import classNames from "classnames";
import { useState } from "react";
import { Button } from "react-bootstrap";
import TelegramIntegrationModal from "./TelegramIntegrationModal";
// import { AgentIntegrationData } from "src/types";
import { t } from "i18next";
import Telegram from "../../../../assets/telegram.svg";
import { TelegramAgentIntegrationResponse } from "src/types";

export default function TelegramIntegration({
  integrationData,
}: {
  integrationData?: TelegramAgentIntegrationResponse;
}) {
  const [telegramModalShow, setTelegramModalShow] = useState(false);
  const [telegramToggle, setTelegramToggle] = useState(
    // integrationData?.is_enabled ||
    false
  );

  return (
    <>
      <TelegramIntegrationModal
        integrationData={integrationData}
        toggleIntegration={telegramToggle}
        show={telegramModalShow}
        onHide={() => setTelegramModalShow(false)}
      />
      <div
        className="d-flex justify-content-between align-content-center w-100 rounded-3 p-3"
        style={{ backgroundColor: "#181A20" }}
      >
        <div className="d-flex flex-column justify-content-center gap-2">
          <span className="d-flex flex-wrap align-items-center gap-2">
            <img src={Telegram} style={{ width: "25px" }} alt="" />
            {t("createAgent.integrations.options.telegramLabel")}
          </span>
          {/* {integrationData?.is_enabled && (
                        <span style={{ width: "fit-content" }} className={classNames(
                            "badge tool-card__footer__badge mb-0",
                            { "bg-primary": integrationData?.is_enabled },
                        )}>{"Connected"}</span>
                    )} */}
        </div>
        <div className="d-flex align-items-center gap-3">
          {/* {integrationData?.integration_id &&
                        <div className="toggle-switch">
                            <input
                                name="is_cookie_fun_enabled"
                                checked={telegramToggle}
                                onChange={() => setTelegramToggle(!telegramToggle)}
                                type="checkbox"
                                id="telegram-integration-toggle"
                            />
                            <label htmlFor="telegram-integration-toggle">Telegram Toggle Switch</label>
                        </div>
                    } */}
          <Button
            className="btn-knowledge"
            onClick={() => setTelegramModalShow(true)}
          >
            {integrationData
              ? "Edit"
              : t("createAgent.integrations.options.connectBot")}
          </Button>
        </div>
      </div>
    </>
  );
}
