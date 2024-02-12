import { useState } from "react";

import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import { WizardDetails } from "declarations/wizard_details/wizard_details.did";
import { getVisibility, displayAddress, getAvatar } from "src/utils";
import Persona from "./Persona";
import { useTranslation } from "react-i18next";

type AgentDetailsProps = {
  isOpen: boolean;
  onHide: () => void;
  wizard: WizardDetails;
};

function AgentDetails({ isOpen, onHide, wizard }: AgentDetailsProps) {
  const [currentNav, setCurrentNav] = useState<"persona" | "tools" | "dataset">(
    "persona"
  );

  const { t } = useTranslation();

  return (
    <Modal show={isOpen} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{t("agentOverView.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex gap-3">
          <div className="wizard-modal__avatar-wrapper">
            <img
              src={getAvatar(wizard?.avatar)?.image}
              alt="agent avatar"
              className="avatar-img wizard-modal__avatar-wrapper__img"
            />
            <span className="wizard-modal__avatar-wrapper__desc">
              <i className="ri-chat-4-line me-1"></i>2.1k
            </span>
          </div>
          <div>
            <div className="wizard-modal__name-wrapper">
              <h5 className="wizard-modal__name-wrapper__name">
                {wizard?.name}
              </h5>
              <div className="wizard-modal__name-wrapper__pill">
                {getVisibility(wizard?.visibility)}
              </div>
            </div>
            <div className="wizard-modal__description">
              {wizard?.description}
            </div>
            <div className="wizard-modal__details">
              {t("agentOverView.model")}:{" "}
              <span className="wizard-modal__details__modal-name">
                {t("agentOverView.openLLM")}
              </span>
              &bull; {t("common.createdBy")}{" "}
              <span className="wizard-modal__details__principal">
                {displayAddress(wizard?.userId)}
              </span>
            </div>
            <div
              className="d-flex gap-3 align-items-center"
              style={{ marginBlockStart: "2rem" }}
            >
              <div className="wizard-modal__details__tag">
                {t("common.free")}
              </div>
              <span>
                <i className="ri-flag-line me-1"></i>
                <span className="text-decoration-underline">
                  {t("common.report")}
                </span>
              </span>
            </div>
          </div>
        </div>
        <Nav
          variant="pill"
          defaultActiveKey={currentNav}
          // onSelect={eventKey => setCurrentNav(eventKey)}
        >
          <Nav.Item>
            <Nav.Link className="btn nav-pill-chat">
              {" "}
              {t("agentOverView.persona")}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled className="btn nav-pill-chat">
              {t("agentOverView.tools")}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled className="btn nav-pill-chat">
              {t("agentOverView.dataSet")}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {currentNav === "persona" && (
          <Persona name={wizard.name} id={wizard.id} />
        )}
      </Modal.Body>
    </Modal>
  );
}

export default AgentDetails;
