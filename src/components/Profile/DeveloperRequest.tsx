import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { Principal } from "@dfinity/principal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import devicon from "src/assets/dev.svg";

import LoadingButton from "components/common/LoadingButton";
import { useWallet } from "hooks/useWallet";
import { useRequestDeveloperAccess } from "hooks/reactQuery/useDeveloper";

import {
  DEVELOPER_REQUEST_FORM_INITIAL,
  DEVELOPER_REQUEST_FORM_VALIDATION,
} from "./constants";

function DeveloperRequest() {
  const { t } = useTranslation();
  const wallet = useWallet();
  const navigate = useNavigate();
  const { mutate: requestDeveloperAccess, isPending: isLoading } =
    useRequestDeveloperAccess();

  type DeveloperRequestFormValues = {
    alias: string;
    email: string;
    github: string;
    description: string;
  };

  const handleSubmit = (values: DeveloperRequestFormValues) => {
    const devDetails = {
      ...values,
      principal: Principal.fromText(wallet!.principalId),
      id: uuidv4(),
      status: { pending: null },
    };
    requestDeveloperAccess(devDetails, {
      onSuccess: () => {
        toast.success("Request submitted");
        navigate("/admin/profile");
      },
      onError: error => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="dev-request">
        <div className="col-md-12">
          <div className="dev-request__header">
            <div className="dev-request__header__icon">
              <img
                src={devicon}
                className="dev-request__header__icon-img"
                alt="My Icon"
              />
            </div>
            <h3 className="dev-request__header__title">
              Request Developer Access
            </h3>
            <p className="dev-request__header_desc">
              Enables developers to create profiles and showcase their tools.
            </p>
          </div>
          <Formik
            initialValues={DEVELOPER_REQUEST_FORM_INITIAL}
            validationSchema={DEVELOPER_REQUEST_FORM_VALIDATION}
            onSubmit={handleSubmit}
          >
            {({
              dirty,
              values,
              errors,
              handleChange,
              handleSubmit,
              handleReset,
            }) => (
              <Form
                className="dev-request__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <Form.Group>
                  <Form.Label className="fs-7">
                    {t("profile.devRequest.form.alias")}
                  </Form.Label>
                  <Form.Control
                    required
                    name="alias"
                    placeholder="Enter alias name"
                    as="input"
                    style={{
                      color: "#fff",
                    }}
                    value={values.alias}
                    onChange={handleChange}
                    isInvalid={!!errors.alias}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.alias}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="fs-7">
                    {t("profile.devRequest.form.email")}
                  </Form.Label>
                  <Form.Control
                    required
                    name="email"
                    as="input"
                    placeholder="you@example.com"
                    style={{
                      color: "#fff",
                    }}
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="fs-7">
                    {t("profile.devRequest.form.github")}
                  </Form.Label>
                  <Form.Control
                    required
                    name="github"
                    placeholder="Github URL"
                    as="input"
                    style={{
                      color: "#fff",
                    }}
                    value={values.github}
                    onChange={handleChange}
                    isInvalid={!!errors.github}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.github}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="fs-7">
                    {t("profile.devRequest.form.description")}
                  </Form.Label>
                  <Form.Control
                    required
                    name="description"
                    rows={5}
                    as="textarea"
                    placeholder="Describe Yourself"
                    style={{
                      color: "#fff",
                    }}
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="mt-2 justify-content-end d-flex gap-2">
                  <Button
                    type="reset"
                    variant="link"
                    className="el-btn-secondary"
                    onClick={handleReset}
                  >
                    {t("common.clear")}
                  </Button>
                  <LoadingButton
                    label={"Request Access"}
                    isDisabled={!dirty}
                    isLoading={isLoading}
                    type="submit"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default DeveloperRequest;
