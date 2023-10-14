import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Formik } from "formik";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useWallet } from "hooks/useWallet";
import { wizard_details as wizardDetails } from "declarations/wizard_details";

import { PERSONA_VALIDATION_SCHEMA } from "./constants";
import {
  WizardDetails,
  WizardVisibility,
  WizardVisibilityBackend,
} from "types";

function Persona({
  agent,
  setCurrentNav,
  name,
}: {
  agent: any;
  setCurrentNav: React.Dispatch<React.SetStateAction<string>>;
  name: string | null;
}) {
  const { t } = useTranslation();
  const wallet = useWallet();
  const navigate = useNavigate();
  // const { mutate: updateAgent } = useUpdateAgent(agent?.uuid);

  type PersonaValues = {
    biography: string;
    greeting: string;
    visibility: WizardVisibility;
  };
  const handleSubmit = async (values: PersonaValues) => {
    const userId = wallet?.principalId;
    const visibility: WizardVisibilityBackend = {};

    visibility[`${values.visibility}Visibility`] = null;
    const payload: WizardDetails = {
      ...values,
      id: crypto.randomUUID(),
      userId,
      name,
      visibility,
      summary: [],
      avatar: [],
    };

    const result = await wizardDetails.addWizard(userId, payload);
    console.log(result.status);
    console.log(typeof result.status);
    if (result.status === 422n) {
      toast.error(result.message);
      throw new Error(result.message);
    } else {
      toast.success(result.message);
      //       setCurrentNav("knowledge");
      navigate("/");
    }
  };
  return (
    <Formik
      initialValues={{
        biography: agent?.biography || "",
        greeting: agent?.greeting || "",
        visibility: agent?.visibility?.toLowerCase() || "public",
      }}
      validationSchema={PERSONA_VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ dirty, errors, values, handleSubmit, handleChange }) => (
        <Form onSubmit={handleSubmit} noValidate>
          <div>
            <h3 className="sub-title-bot">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6_424)">
                    <path
                      d="M21 4V18.7215C21 18.9193 20.8833 19.0986 20.7024 19.1787L12 23.0313L3.29759 19.1787C3.11667 19.0986 3 18.9193 3 18.7215V4H1V2H23V4H21ZM5 4V17.7451L12 20.8441L19 17.7451V4H5ZM8 8H16V10H8V8ZM8 12H16V14H8V12Z"
                      fill="#007D88"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_424">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              {t("createAgent.biography")}
            </h3>
            <Form.Group>
              <Form.Label className="fs-7">
                {t("createAgent.biographyDesc")}
              </Form.Label>
              <Form.Control
                className="form-control"
                as="textarea"
                name="biography"
                rows={3}
                value={values.biography}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="biography">
                {errors.biography}
              </Form.Control.Feedback>
            </Form.Group>
            <h3 className="sub-title-bot">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6_427)">
                    <path
                      d="M4 2H20C20.5523 2 21 2.44772 21 3V22.2763C21 22.5525 20.7761 22.7764 20.5 22.7764C20.4298 22.7764 20.3604 22.7615 20.2963 22.7329L12 19.0313L3.70373 22.7329C3.45155 22.8455 3.15591 22.7322 3.04339 22.4801C3.01478 22.4159 3 22.3465 3 22.2763V3C3 2.44772 3.44772 2 4 2ZM19 19.9645V4H5V19.9645L12 16.8412L19 19.9645ZM12 13.5L9.06107 15.0451L9.62236 11.7725L7.24472 9.45492L10.5305 8.97746L12 6L13.4695 8.97746L16.7553 9.45492L14.3776 11.7725L14.9389 15.0451L12 13.5Z"
                      fill="#007D88"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_427">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              {t("createAgent.greeting")}
            </h3>
            <Form.Group>
              <Form.Label className="fs-7">
                {t("createAgent.greetingDesc")}
              </Form.Label>
              <Form.Control
                as="textarea"
                name="greeting"
                rows={3}
                value={values.greeting}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="greeting">
                {errors.greeting}
              </Form.Control.Feedback>
            </Form.Group>
            <h3 className="sub-title-bot">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6_446)">
                    <path
                      d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM5 10V20H19V10H5ZM11 14H13V16H11V14ZM7 14H9V16H7V14ZM15 14H17V16H15V14ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16Z"
                      fill="#007D88"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_446">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>{" "}
              {t("createAgent.visibility.title")}
            </h3>
            <Form.Group>
              <InputGroup className="mb-1 visibility-radio">
                <InputGroup.Radio
                  aria-label="public"
                  value="public"
                  name="visibility"
                  checked={values.visibility === "public"}
                  onChange={handleChange}
                />
                <InputGroup.Text>
                  <Trans
                    i18nKey="createAgent.visibility.public"
                    components={{ span: <span className="font-light ml-2" /> }}
                  />
                </InputGroup.Text>
              </InputGroup>

              <InputGroup className="mb-1 visibility-radio">
                <InputGroup.Radio
                  aria-label="Unlisted"
                  value="unlisted"
                  name="visibility"
                  checked={values.visibility === "unlisted"}
                  onChange={handleChange}
                />
                <InputGroup.Text>
                  <Trans
                    i18nKey="createAgent.visibility.unlisted"
                    components={{ span: <span className="font-light ml-2" /> }}
                  />
                </InputGroup.Text>
              </InputGroup>

              <InputGroup className="mb-1 visibility-radio">
                <InputGroup.Radio
                  aria-label="Private"
                  value="private"
                  name="visibility"
                  checked={values.visibility === "private"}
                  onChange={handleChange}
                />
                <InputGroup.Text>
                  <Trans
                    i18nKey="createAgent.visibility.private"
                    components={{ span: <span className="font-light ml-2" /> }}
                  />
                </InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="visibility">
                {errors.visibility}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="flex">
              <Button className="ml-auto" type="submit" disabled={!dirty}>
                {t("common.next")}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Persona;
