import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { Principal } from "@dfinity/principal";
import { toast } from "react-toastify";

import LoadingButton from "components/common/LoadingButton";
import { useWallet } from "hooks/useWallet";
import {
  useGetPendingDeveloperRequest,
  useRequestDeveloperAccess,
} from "hooks/reactQuery/useDeveloper";

import {
  DEVELOPER_REQUEST_FORM_INITIAL,
  DEVELOPER_REQUEST_FORM_VALIDATION,
} from "./constants";

function DeveloperRequest() {
  const { t } = useTranslation();
  const wallet = useWallet();
  const { mutate: requestDeveloperAccess, isPending: isLoading } =
    useRequestDeveloperAccess();
  // TODO: remove pendingDevs here
  const { data: pendingDevs } = useGetPendingDeveloperRequest();
  console.log({ pendingDevs });

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
      onSuccess: () => toast.success("Request submitted"),
      onError: error => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  return (
    <div>
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
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group>
              <Form.Label className="fs-7">
                {t("profile.devRequest.form.alias")}
              </Form.Label>
              <Form.Control
                required
                name="alias"
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
                as="textarea"
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
            <div className="mt-2 d-flex gap-2">
              <LoadingButton
                label={"request access"}
                isDisabled={!dirty}
                isLoading={isLoading}
                type="submit"
              />
              <Button type="reset" variant="link" onClick={handleReset}>
                {t("common.cancel")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default DeveloperRequest;
