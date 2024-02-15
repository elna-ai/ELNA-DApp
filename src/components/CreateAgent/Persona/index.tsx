import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Formik } from "formik";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useWallet } from "hooks/useWallet";
import {
  WizardDetails,
  WizardVisibility,
} from "declarations/wizard_details/wizard_details.did";
import { useAddWizard } from "hooks/reactQuery/wizards/useMyWizards";
import { getAvatar } from "src/utils";
import { AVATAR_IMAGES } from "src/constants";
import LoadingButton from "components/common/LoadingButton";

import { PERSONA_VALIDATION_SCHEMA } from "../constants";
import AvatarImage from "./AvatarImage";
import { useCreateWizardStore } from "stores/useCreateWizard";

type PersonaProps = {
  wizard: any;
  setCurrentNav: React.Dispatch<React.SetStateAction<string>>;
  setWizardId: React.Dispatch<React.SetStateAction<string>>;
};

function Persona({ wizard, setCurrentNav, setWizardId }: PersonaProps) {
  const { t } = useTranslation();
  const wallet = useWallet();
  const wizardName = useCreateWizardStore(state => state.name);

  const {
    mutate: addWizard,
    isPending: isAddingWizard,
    error,
    isError,
  } = useAddWizard();

  type Visibility = "public" | "private" | "unlisted";
  type PersonaValues = {
    biography: string;
    greeting: string;
    description: string;
    avatar: string;
    visibility: Visibility;
  };
  const handleSubmit = async (values: PersonaValues) => {
    const userId = wallet?.principalId;
    const visibility = {
      [`${values.visibility}Visibility`]: null,
    } as WizardVisibility;
    if (userId === undefined) return;
    if (wizardName === null) return;

    const payload: WizardDetails = {
      ...values,
      id: uuidv4(),
      userId,
      name: wizardName,
      visibility,
      summary: [],
      isPublished: false,
    };
    addWizard(payload, {
      onSuccess: () => {
        setWizardId(payload.id);
        setCurrentNav("knowledge");
      },
    });
  };

  useEffect(() => {
    if (!isError) return;

    toast.error(error.message);
  }, [isError]);

  return (
    <Formik
      initialValues={{
        avatar: wizard?.avatar || AVATAR_IMAGES[0].id,
        biography: wizard?.biography || "",
        greeting: wizard?.greeting || "",
        visibility:
          (Object.keys(wizard?.visibility || {})
            ?.join()
            .replace(/Visibility/, "") as Visibility) || "public",
        description: wizard?.description || "",
      }}
      validationSchema={PERSONA_VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ dirty, errors, values, handleSubmit, handleChange }) => (
        <Form onSubmit={handleSubmit} noValidate>
          <div className="personaCreate">
            <h3 className="sub-title-bot">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM5 10H7C7 11.6569 8.3431 13 10 13C11.6569 13 13 11.6569 13 10H15C15 12.7614 12.7614 15 10 15C7.23858 15 5 12.7614 5 10Z"
                  fill="#007D88"
                />
              </svg>
              {t("createAgent.avatar")}
            </h3>
            <div className="persona__avatar">
              <AvatarImage
                key={getAvatar(values.avatar)!.id}
                image={getAvatar(values.avatar)!.image}
                selected={false}
                preview={true}
              />
              <InputGroup className="persona__avatar__image-wrapper">
                {AVATAR_IMAGES.map(avatar => (
                  <AvatarImage
                    key={avatar.id}
                    image={avatar.image}
                    selected={values.avatar === avatar.id}
                    onClick={() => handleChange("avatar")(avatar.id)}
                  />
                ))}
              </InputGroup>
            </div>
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
                placeholder="Enter Agent Biography"
                name="biography"
                rows={3}
                value={values.biography}
                onChange={handleChange}
                isInvalid={!!errors.biography}
              />
              <Form.Control.Feedback type="invalid">
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
                placeholder="Enter Agent Greetings"
                rows={3}
                value={values.greeting}
                onChange={handleChange}
                isInvalid={!!errors.greeting}
              />
              <Form.Control.Feedback type="invalid">
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
                  <path
                    d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"
                    fill="#007D88"
                  ></path>
                </svg>
              </span>
              {t("createAgent.description")}
            </h3>

            <Form.Group>
              <Form.Label className="fs-7">
                {t("createAgent.descriptionDesc")}
              </Form.Label>
              <Form.Control
                className="form-control"
                placeholder="Enter Agent Description"
                as="textarea"
                name="description"
                rows={3}
                value={values.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
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
                  isInvalid={!!errors.visibility}
                />
                <InputGroup.Text>
                  <Trans
                    i18nKey="createAgent.visibility.public"
                    components={{ span: <span className="fw-light ms-2" /> }}
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
                    components={{ span: <span className="fw-light ms-2" /> }}
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
                    components={{ span: <span className="fw-light ms-2" /> }}
                  />
                </InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {errors.visibility}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <LoadingButton
                label={t("common.next")}
                className="ml-auto px-5"
                isDisabled={!dirty}
                isLoading={isAddingWizard}
                type="submit"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Persona;
