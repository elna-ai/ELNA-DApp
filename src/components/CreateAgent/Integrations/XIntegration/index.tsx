import classNames from "classnames";
import { useState } from "react";
import { Button } from "react-bootstrap";
import XIntegrationModal from "./XIntegrationModal";
import { XAgentIntegrationResponse } from "src/types";
import { t } from "i18next";

export default function XIntegration({ integrationData }: { integrationData?: XAgentIntegrationResponse }) {

    const [xModalShow, setXModalShow] = useState(false);
    // const [xToggle, setXToggle] = useState(integrationData?.is_enabled || false);

    return (
        <>
            <XIntegrationModal
                integrationData={integrationData}
                // toggleIntegration={xToggle}
                show={xModalShow}
                onHide={() => setXModalShow(false)}
            />
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
                                checked={xToggle}
                                onChange={() => setXToggle(!xToggle)}
                                type="checkbox"
                                id="x-integration-toggle"
                            />
                            <label htmlFor="x-integration-toggle">X Toggle Switch</label>
                        </div>
                    } */}
                    <Button
                        className="btn-knowledge"
                        onClick={() => setXModalShow(true)}
                        variant="outline-info"
                    >
                        {integrationData ? "Edit" : t("createAgent.integrations.options.connectBot")}
                    </Button>
                </div>
            </div>
        </>
    )
}
