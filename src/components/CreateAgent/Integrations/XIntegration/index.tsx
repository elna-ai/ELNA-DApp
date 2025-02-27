import classNames from "classnames";
import { useState } from "react";
import { Button } from "react-bootstrap";
import XIntegrationModal from "./XIntegrationModal";
import { XAgentIntegrationResponse } from "src/types";
import { t } from "i18next";
import * as dayjs from 'dayjs'

export default function XIntegration({ integrationData }: { integrationData?: XAgentIntegrationResponse }) {

    const [xModalShow, setXModalShow] = useState(false);
    // const [xToggle, setXToggle] = useState(integrationData?.is_enabled || false);

    const returnTimeRemaining = (unixSeconds: number) => {
        const unixTime = unixSeconds * 1000;
        const currentTime = dayjs();
        const targetTime = dayjs(unixTime);

        const remainingTime = targetTime.diff(currentTime);

        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        if (remainingTime <= 0 || unixSeconds === 0) return null
        return (
            <span
                style={{ width: "fit-content" }}
                className="badge tool-card__footer__badge mb-0 bg-secondary"
            >
                Rate Limit reached, will be reset: <br /> {days} days, {hours} hours, <br />{minutes} minutes, {seconds} seconds remaining
            </span>
        );
    }

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
                style={{ backgroundColor: "#181A20" }}
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
                    {returnTimeRemaining(integrationData?.x_rate_limit_remaining || 0)}
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
                    >
                        {integrationData ? "Edit" : t("createAgent.integrations.options.connectBot")}
                    </Button>
                </div>
            </div>
        </>
    )
}
