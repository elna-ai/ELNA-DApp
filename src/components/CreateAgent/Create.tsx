import { useState } from "react";

import { Formik } from "formik";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingButton from "components/common/LoadingButton";
import { useWizardGetFileNames } from "hooks/reactQuery/useExternalService";
import { usePublishUnpublishWizard } from "hooks/reactQuery/wizards/useMyWizards";
import { useShowWizard } from "hooks/reactQuery/wizards/useWizard";

import Persona from "./Persona";
import Knowledge from "./Knowledge";

import { TWITTER_SHARE_CONTENT } from "./constants";
import { useCreateWizardStore } from "stores/useCreateWizard";
import { Button, CloseButton, Modal, ModalBody } from "react-bootstrap";
import { toast } from "react-toastify";
import { generateTwitterShareLink } from "utils/index";
import { CREATE_BOT_MODAL_VALIDATION_SCHEMA } from "components/common/CheckWizardNameCreate/constants";

function Create() {
  const [currentNav, setCurrentNav] = useState<string>("persona");
  const [wizardId, setWizardId] = useState("");
  const [isPublishSuccessful, setIsPublishSuccessful] = useState(false);

  const { t } = useTranslation();
  const [urlSearchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const wizardName = useCreateWizardStore(state => state.name);
  const setWizardName = useCreateWizardStore(state => state.setWizardName);
  const resetWizardName = useCreateWizardStore(state => state.resetWizardName);
  const { data: documents } = useWizardGetFileNames(wizardId);
  const { mutate: publishWizard, isPending: isPublishingWizard } =
    usePublishUnpublishWizard();
  const { data: wizard } = useShowWizard(wizardId);

  const handlePublish = () => {
    publishWizard(
      { wizardId, shouldPublish: true },
      {
        onSuccess: () => {
          setIsPublishSuccessful(true);
        },
      }
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/chat/${wizardId}`
      );
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleClose = () => {
    setIsPublishSuccessful(false);
    resetWizardName();
    navigate("/");
  };

  // if (isLoading) {
  //   return <PageLoader />;
  // }

  return (
    <>
      <Formik
        initialValues={{
          name: wizard?.name || wizardName || urlSearchParams.get("name"),
          isNameEdit: false,
        }}
        validationSchema={CREATE_BOT_MODAL_VALIDATION_SCHEMA}
        onSubmit={values => console.log(values)}
      >
        {({ errors, values, handleSubmit, setFieldValue, handleChange }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <div className="mt-3 d-flex align-items-center justify-content-between">
              <div>
                <div className="d-flex gap-3 align-items-center">
                  {values.isNameEdit ? (
                    <Form.Group>
                      <Form.Control
                        name="name"
                        as="input"
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          backgroundColor: "transparent",
                          color: "#fff",
                          border: "none",
                          boxShadow: "none",
                        }}
                        value={values.name || ""}
                        onChange={e => {
                          setWizardName(e.target.value);
                          handleChange(e);
                        }}
                      />
                    </Form.Group>
                  ) : (
                    <h2>{values.name}</h2>
                  )}
                  <span
                    onClick={() =>
                      setFieldValue("isNameEdit", !values.isNameEdit)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        d="M5 18.89H6.41421L15.7279 9.57629L14.3137 8.16207L5 17.4758V18.89ZM21 20.89H3V16.6474L16.435 3.21233C16.8256 2.8218 17.4587 2.8218 17.8492 3.21233L20.6777 6.04075C21.0682 6.43128 21.0682 7.06444 20.6777 7.45497L9.24264 18.89H21V20.89ZM15.7279 6.74786L17.1421 8.16207L18.5563 6.74786L17.1421 5.33365L15.7279 6.74786Z"
                        fill="rgba(0,125,136,1)"
                      ></path>
                    </svg>
                  </span>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </div>
              <div className="text-end">
                <span className="text-xs">{t("common.template")}</span>
                <div className="fw-bold">{t("common.scratch")}</div>
              </div>
            </div>
            <hr className="mb-0" />
          </Form>
        )}
      </Formik>
      <div className="d-flex align-items-center justify-content-between">
        <Nav
          variant="pills"
          activeKey={currentNav}
          onSelect={eventKey => {
            setCurrentNav(eventKey || "persona");
          }}
        >
          <Nav.Item>
            <Nav.Link className="btn nav-pill-chat" eventKey="persona">
              {t("createAgent.persona")}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className="btn nav-pill-chat"
              eventKey="knowledge"
              disabled={!wizard?.biography || !wizard?.greeting}
            >
              {t("createAgent.knowledge.knowledge")}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div>
          <LoadingButton
            label={t("common.publish")}
            isDisabled={
              !documents?.length || isPublishingWizard || wizard?.isPublished
            }
            isLoading={isPublishingWizard}
            onClick={handlePublish}
          />
        </div>
      </div>
      <hr className="mt-0" />
      {currentNav === "persona" ? (
        <Persona {...{ wizard, setCurrentNav, setWizardId }} />
      ) : (
        <Knowledge wizardId={wizardId} />
      )}
      <Modal show={isPublishSuccessful} onHide={handleClose} centered>
        <ModalBody>
          <div className="d-flex">
            <div className="text-center">
              <h5>Agent Activated</h5>
              <div>
                Congrats on your decentralized AI agent {wizardName}, built by
                ELNA
              </div>
            </div>
            <div className="ml-auto">
              <CloseButton
                style={{
                  padding: "0.5rem",
                  backgroundColor: "var(--el-btn-bg-secondary)",
                }}
                onClick={handleClose}
              />
            </div>
          </div>
          <hr className="mt-2"></hr>

          <span className="text-xs">Share agent link</span>
          <div className="d-flex align-items-center justify-space-between copy-sec">
            <div>{`${window.location.origin}/chat/${wizardId}`}</div>
            <Button className="square-btn me-2" onClick={handleCopyLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: "16px" }}
              >
                <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
              </svg>
            </Button>
          </div>
          <a
            className="btn btn-secondary"
            href={generateTwitterShareLink(
              `${TWITTER_SHARE_CONTENT(
                wizardName,
                `${window.location.origin}/chat/${wizardId}`
              )}`
            )}
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: "126px" }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: "16px" }}
              >
                <path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"></path>
              </svg>
            </span>
            <span className="text-xs sub-title-color">Share Twitter</span>
          </a>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Create;
