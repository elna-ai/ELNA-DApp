import { useState } from "react";

import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useParams, useNavigate } from "react-router-dom";

import Persona from "./Persona";
import Knowledge from "./Knowledge";
// import {
//   usePublishAgent,
//   useShowUserAgent,
//   useShowUserAgentPolling,
// } from "hooks/reactQuery/useAgentsApi";
import PageLoader from "components/common/PageLoader";
import { CREATE_BOT_MODAL_VALIDATION_SCHEMA } from "./constants";
import { useTranslation } from "react-i18next";

function Create() {
  const [isPolling, setIsPolling] = useState(false);
  const [currentNav, setCurrentNav] = useState("persona");

  const { t } = useTranslation();
  const { uuid: agentId } = useParams();
  const navigate = useNavigate();
  const isLoading = false;
  // const { data: agent, isLoading } = useShowUserAgent({
  //   agentId,
  // });

  // const { data: document } = useShowUserAgentPolling({
  //   agentId,
  //   enabled: !!agentId && isPolling,
  // });

  // const { mutate: publishAgent, isLoading: isPublishing } =
  //   usePublishAgent(agentId);

  const handlePublish = () => {
    // publishAgent(
    //   {
    //     payload: { is_published: true },
    //     visibility: agent.visibility.toLowerCase(),
    //     uuid: agentId,
    //   },
    //   {
    //     onSuccess: () => navigate("/"),
    //   }
    // );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Formik
        initialValues={{ name: agent?.name, isNameEdit: false }}
        validationSchema={CREATE_BOT_MODAL_VALIDATION_SCHEMA}
        onSubmit={values => console.log(values)}
      >
        {({ errors, values, handleSubmit, setFieldValue, handleChange }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="d-flex gap-3 items-center">
                  {values.isNameEdit ? (
                    <Form.Group>
                      <Form.Control
                        name="name"
                        as="input"
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          backgroundColor: "transparent",
                          border: "none",
                          boxShadow: "none",
                        }}
                        value={values.name}
                        onChange={handleChange}
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
                <Form.Control.Feedback type="name">
                  {errors.name}
                </Form.Control.Feedback>
              </div>
              <div className="text-right">
                <span className="text-xs">{t("common.template")}</span>
                <div className="font-bold">{t("common.scratch")}</div>
              </div>
            </div>
            <hr className="mb-0" />
          </Form>
        )}
      </Formik>
      <div className="flex items-center justify-between">
        <Nav
          variant="pills"
          defaultActiveKey={currentNav}
          onSelect={eventKey => setCurrentNav(eventKey)}
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
              disabled={!agent.biography || !agent.greeting}
            >
              {t("createAgent.knowledge.knowledge")}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div>
          <Button
            disabled={!agent.is_active || isPublishing || agent.is_published}
            onClick={handlePublish}
          >
            <span className="mr-2">{t("common.publish")}</span>
            {isPublishing && <Spinner animation="border" size="sm" />}
          </Button>
        </div>
      </div>
      <hr className="mt-0" />
      {currentNav === "persona" ? (
        <Persona {...{ agent, setCurrentNav }} />
      ) : (
        <Knowledge
          agentId={agent.uuid}
          setIsPolling={setIsPolling}
          document={document}
        />
      )}
    </>
  );
}

export default Create;
