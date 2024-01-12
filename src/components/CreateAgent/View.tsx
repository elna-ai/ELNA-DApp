import { useState } from "react";

import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { t } from "i18next";
import { Trans } from "react-i18next";

import { wizard_details as wizardDetails } from "declarations/wizard_details";
import { useWallet } from "hooks/useWallet";

import TemplateStore from "./TemplateSore";
import {
  CREATE_BOT_MODAL_INITIAL_VALUES,
  CREATE_BOT_MODAL_VALIDATION_SCHEMA,
} from "./constants";
import NoAccessImg from "../../images/no-access.png";
import { backend } from "declarations/backend";

function View() {
  const [isCreate, setIsCreate] = useState(false);
  const [isNoPermission, setIsNoPermission] = useState(false);

  const navigate = useNavigate();
  const wallet = useWallet();

  const handleCreate = async () => {
    if (wallet === undefined || !wallet?.principalId) {
      setIsNoPermission(true);
      return;
    }

    const isWhiteListed = await backend.isUserWhitelisted(wallet.principalId);
    isWhiteListed ? setIsCreate(true) : setIsNoPermission(true);
  };

  const handleSubmit = async ({ name }: { name: string }) => {
    if (wallet === undefined) return;

    const isNameValid: boolean = await wizardDetails.isWizardNameValid(
      wallet.principalId,
      name
    );
    if (!isNameValid) {
      toast.error("Wizard name exist for user");
      return;
    }

    navigate({ pathname: "/create-agent/edit", search: `?name=${name}` });
  };

  return (
    <div className="w-100">
      <div className="d-flex align-items-top justify-content-between mt-4 mb-2">
        <div>
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
            Create an Agent
          </h5>
          <p>{t("createAgent.title")}</p>
        </div>
      </div>
      <div className="row gx-3 row-cols-xxl-4 row-cols-xl-2 row-cols-lg-2 row-cols-md-2 row-cols-1 mb-5">
        <div className="col">
          <div className="card card-border contact-card elna-card agent-create">
            <div className="card-body text-center">
              <div className="d-inline-flex ic-agent-create p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11H7V13H11V17H13V13H17V11H13V7H11V11Z"
                    fill="#00d67f"
                  ></path>
                </svg>
              </div>
              <div className="user-name mt-1 mb-1">
                <div
                  className="btn-link stretched-link text-decoration-none"
                  onClick={() => handleCreate()}
                >
                  {t("createAgent.fromStrach")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <TemplateStore />
      <Modal
        className="bot-name-modal"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={isCreate}
        onHide={() => setIsCreate(false)}
      >
        <Modal.Header closeButton className="d-flex align-items-center">
          <Modal.Title>
            <h5 className="mb-0">
              <strong>{t("createAgent.nameAgent")}</strong>
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={CREATE_BOT_MODAL_INITIAL_VALUES}
          onSubmit={handleSubmit}
          validationSchema={CREATE_BOT_MODAL_VALIDATION_SCHEMA}
          onReset={() => setIsCreate(false)}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>{t("createAgent.form.label.name")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isValid={touched.name && !errors.name}
                    placeholder={t("createAgent.form.placeholder.name")}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer className="flex">
                <Button
                  className="btn-light btn-modal-cancel"
                  variant="link"
                  type="reset"
                  onClick={() => setIsCreate(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button className="btn-modal-ok" type="submit">
                  {t("common.ok")}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal
        size="lg"
        centered
        show={isNoPermission}
        onHide={() => setIsNoPermission(false)}
      >
        <Modal.Header
          closeButton
          className="d-flex align-items-center justify-content-center"
        >
          <h3 className="w-100 sub-title text-center">
            {t("common.noPermission")}
          </h3>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            className="mx-auto d-block"
            src={NoAccessImg}
            alt="No-permission-Elna"
            width={180}
          />
          <p className="mb-0">{t("createAgent.noPermission.title")}</p>
          <p>{t("createAgent.noPermission.gainAccess")}</p>
          <p>
            <Trans
              i18nKey="createAgent.noPermission.askAccess"
              components={{
                a: (
                  <a
                    href="https://forms.gle/9ikyydFgUV6vEdZ58"
                    className="elna-link text-underline"
                    target="_blank"
                    rel= "noopener noreferrer"
                  />
                ),
                u: <u />,
                strong: <strong />,
              }}
            />
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default View;
