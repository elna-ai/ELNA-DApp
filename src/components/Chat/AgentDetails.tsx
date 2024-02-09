import Modal from "react-bootstrap/Modal";

import { WizardDetails } from "declarations/wizard_details/wizard_details.did";
import { getVisibility, displayAddress, getAvatar } from "src/utils";
import { Nav } from "react-bootstrap";

type AgentDetailsProps = {
  isOpen: boolean;
  onHide: () => void;
  wizard: WizardDetails;
};

function AgentDetails({ isOpen, onHide, wizard }: AgentDetailsProps) {
  return (
    <Modal show={isOpen} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Agent Overview</Modal.Title>
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
              Model:{" "}
              <span className="wizard-modal__details__modal-name">
                Open LLM
              </span>
              &bull; Created by{" "}
              <span className="wizard-modal__details__principal">
                {displayAddress(wizard?.userId)}
              </span>
            </div>
            <div
              className="d-flex gap-3 align-items-center"
              style={{ marginBlockStart: "2rem" }}
            >
              <div className="wizard-modal__details__tag">Free</div>
              <span>
                <i className="ri-flag-line me-1"></i>
                <span className="text-decoration-underline">Report</span>
              </span>
            </div>
          </div>
        </div>
        <Nav variant="pill">
          <Nav.Item>
            <Nav.Link className="btn nav-pill-chat"> Persona</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled className="btn nav-pill-chat">
              Tools
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled className="btn nav-pill-chat">
              Data Set
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Modal.Body>
    </Modal>
  );
}

export default AgentDetails;
