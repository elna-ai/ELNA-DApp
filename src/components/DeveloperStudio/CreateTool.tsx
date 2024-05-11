import { Principal } from "@dfinity/principal";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import LoadingButton from "components/common/LoadingButton";
import { useRequestDeveloperTool } from "hooks/reactQuery/useDeveloperTools";
import { useWallet } from "hooks/useWallet";

import {
  CREATE_TOOL_FORM_INITIAL,
  CREATE_TOOL_FORM_VALIDATION,
} from "./constants";

type CreateToolForm = {
  name: string;
  description: string;
  projectUrl: string;
  category: string;
};

function CreateTool() {
  const { t } = useTranslation();
  const wallet = useWallet();
  const navigate = useNavigate();
  const { mutate: requestDeveloperTool, isPending } = useRequestDeveloperTool();

  const handleSubmit = (values: CreateToolForm) => {
    const request = {
      id: uuidv4(),
      principal: Principal.fromText(wallet!.principalId),
      status: { pending: null },
      ...values,
    };
    requestDeveloperTool(request, {
      onSuccess: () => {
        toast.success("Request submitted");
        navigate("/developer-studio");
      },
      onError: e => {
        console.error(e);
        toast.error(e.message);
      },
    });
  };
  return (
    <Formik
      initialValues={CREATE_TOOL_FORM_INITIAL}
      validationSchema={CREATE_TOOL_FORM_VALIDATION}
      onSubmit={handleSubmit}
    >
      {({ dirty, values, errors, handleChange, handleSubmit, handleReset }) => (
        <Form onSubmit={handleSubmit} noValidate>
          <h3>Create tool</h3>
          <Form.Group>
            <Form.Label className="fs-7">Name</Form.Label>
            <Form.Control
              required
              name="name"
              as="input"
              style={{
                color: "#fff",
              }}
              value={values.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label className="fs-7">description</Form.Label>
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
          <Form.Group>
            <Form.Label className="fs-7">Project Url(repository)</Form.Label>
            <Form.Control
              required
              name="projectUrl"
              as="input"
              style={{
                color: "#fff",
              }}
              value={values.projectUrl}
              onChange={handleChange}
              isInvalid={!!errors.projectUrl}
            />
            <Form.Control.Feedback type="invalid">
              {errors.projectUrl}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label className="fs-7">category</Form.Label>
            <Form.Control
              required
              name="category"
              as="input"
              style={{
                color: "#fff",
              }}
              value={values.category}
              onChange={handleChange}
              isInvalid={!!errors.category}
            />
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="mt-2 d-flex gap-2">
            <LoadingButton
              label={"Submit tool"}
              isDisabled={!dirty}
              isLoading={isPending}
              type="submit"
            />
            <Button type="reset" variant="link" onClick={handleReset}>
              {t("common.cancel")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateTool;
