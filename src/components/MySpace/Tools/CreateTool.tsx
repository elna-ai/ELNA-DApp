import { Principal } from "@dfinity/principal";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import toolicon from "src/images/tools-list.svg";

import LoadingButton from "components/common/LoadingButton";
import { useRequestDeveloperTool } from "hooks/reactQuery/useDeveloperTools";
import { useWallet } from "hooks/useWallet";

import {
  CREATE_TOOL_FORM_INITIAL,
  CREATE_TOOL_FORM_VALIDATION,
} from "../constant";

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
        navigate("/my-space/my-tools");
      },
      onError: e => {
        console.error(e);
        toast.error(e.message);
      },
    });
  };
  return (
    <div className="row justify-content-center">
      <div className="tool-listing">
        <div className="col-md-12">
          <div className="tool-listing__header">
            <div className="tool-listing__header__icon">
              <img
                src={toolicon}
                className="tool-listing__header__icon-img"
                alt="My Icon"
              />
            </div>
            <h3 className="tool-listing__header__title">Create tool</h3>
            <p className="tool-listing__header_desc">
              Please provide details about your tools.
            </p>
          </div>
          <Formik
            initialValues={CREATE_TOOL_FORM_INITIAL}
            validationSchema={CREATE_TOOL_FORM_VALIDATION}
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
                className="tool-listing__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <Form.Group>
                  <Form.Label className="fs-7">Tool Name</Form.Label>
                  <Form.Control
                    required
                    name="name"
                    as="input"
                    style={{
                      color: "#fff",
                    }}
                    placeholder="Enter Tool Name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="fs-7">Tools Description</Form.Label>
                  <Form.Control
                    required
                    name="description"
                    rows={5}
                    as="textarea"
                    placeholder="Describe your tool "
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
                  <Form.Label className="fs-7">Tool Repository Link</Form.Label>
                  <Form.Control
                    required
                    name="projectUrl"
                    placeholder="Repository URL"
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
                  <Form.Label className="fs-7">Category</Form.Label>
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
                <div className="mt-2 justify-content-end d-flex gap-2">
                  <Button
                    className="el-btn-secondary"
                    type="reset"
                    variant="link"
                    onClick={handleReset}
                  >
                    {t("common.clear")}
                  </Button>
                  <LoadingButton
                    label={"Submit tool"}
                    isDisabled={!dirty}
                    isLoading={isPending}
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

export default CreateTool;
