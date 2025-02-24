import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
// import { useCreateBeastStore } from "stores/useCreateBeast";
import { ChangeEvent, useState } from "react";
import XIntegrationModal from "./XIntegrationModal";
// import {
//   useGetAgent,
//   useGetAgentIntegrations,
// } from "hooks/reactQuery/useAgents";
import PageLoader from "components/common/PageLoader";
import classNames from "classnames";

function Integrations() {
  const [xModalShow, setXModalShow] = useState(false);
  const [xIsConnected, setXIsConnected] = useState(true);
  const { beastId } = useParams();
  const { t } = useTranslation();

  // const { id } = useCreateBeastStore();
  // const { data: beast, isFetching: isLoadingBeast } = useGetAgent(
  //   beastId || id
  // );
  // const { data: integrationData, isFetching: isLoadingIntegrationData } =
  //   useGetAgentIntegrations(beast?.integration_id);

  // if (isLoadingBeast || isLoadingIntegrationData) return <PageLoader />;
  const handleConnectDisconnect = (e: ChangeEvent<HTMLInputElement>) => {
    const toConnect = e.target.checked;
    setXIsConnected(toConnect);
  };
  return (
    <>
      <XIntegrationModal
        show={xModalShow}
        onHide={() => setXModalShow(false)}
      />
      <div>
        <div>
          <h3 className="sub-title-bot">
            {t("createAgent.integrations.options.title")}
          </h3>
          <div className="gap-2 mt-4">
            <div
              className="d-flex justify-content-between align-content-center w-100 rounded-3 p-3"
              style={{ backgroundColor: "#171D36" }}
            >
              <div className="d-flex flex-column justify-content-center gap-2">
                <span className="d-flex flex-wrap align-items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    style={{ width: "25px" }}
                  >
                    <path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"></path>
                  </svg>
                  {t("createAgent.integrations.options.xLabel")}
                </span>
                {/* {!!integrationData && ( */}
                <span
                  className={classNames(
                    "badge tool-card__footer__badge mb-0"
                    // { "bg-primary": integrationData }
                  )}
                >
                  {"Connected"}
                </span>
                {/* )} */}
              </div>
              <div className="d-flex gap-1 align-items-center">
                {/* Enable for edit case only */}
                <Form.Check // prettier-ignore
                  type="switch"
                  onChange={handleConnectDisconnect}
                  // defaultChecked={true}
                  checked={xIsConnected}
                />
                <Button
                  className="btn-knowledge"
                  onClick={() => setXModalShow(true)}
                  variant="outline-info"
                >
                  {t("createAgent.integrations.options.connectBot")}
                  {/* {integrationData
                  ? "Edit"
                  : t("createAgent.integrations.options.connectBot")} */}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* TODO: LOOK ENTIRE BLOCK.COMMENTED NOT BY ME  */}
        {/* <div>
                    <h3 className="sub-title-bot">{t("createAgent.integrations.comingSoonOptions.title")}</h3>
                    <div className="gap-2 mt-4">
                        <div className="d-flex justify-content-between align-content-center w-100">
                            <span>{t("createAgent.integrations.options.telegramLabel")}</span>
                            <Button className="btn-knowledge" disabled>
                                {t("createAgent.integrations.comingSoonOptions.connectBot")}
                            </Button>
                        </div>
                        <div className="d-flex justify-content-between align-content-center w-100">
                            <span>{t("createAgent.integrations.comingSoonOptions.discordLabel")}</span>
                            <Button className="btn-knowledge" disabled>
                                {t("createAgent.integrations.comingSoonOptions.connectBot")}
                            </Button>
                        </div>
                        <div className="d-flex justify-content-between align-content-center w-100">
                            <span>{t("createAgent.integrations.comingSoonOptions.tradingBotsLabel")}</span>
                            <Button className="btn-knowledge" disabled>
                                {t("createAgent.integrations.comingSoonOptions.connectBot")}
                            </Button>
                        </div>
                    </div>
                </div> */}
      </div>
    </>
  );
}

export default Integrations;
