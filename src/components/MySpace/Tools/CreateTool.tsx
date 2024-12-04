import { Principal } from "@dfinity/principal";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import toolicon from "src/images/tools-list.svg";

import LoadingButton from "components/common/LoadingButton";
import { useRequestDeveloperTool } from "hooks/reactQuery/useDeveloperTools";
import { useWallet } from "hooks/useWallet";

import {
  CREATE_TOOL_FORM_INITIAL,
  CREATE_TOOL_FORM_VALIDATION,
} from "../constant";
import { convertToMotokoOptional } from "utils/index";
import FormikInput from "components/common/FormikInput";
import ImageUploader from "components/common/ImageUploader";

type CreateToolForm = {
  name: string;
  description: string;
  projectUrl: string;
  category: string;
  icon: { fileName: string; image: string };
  coverImage: { fileName: string; image: string };
  presentationUrl: string;
  demoUrl: string;
};

function CreateTool() {
  const { t } = useTranslation();
  const wallet = useWallet();
  const navigate = useNavigate();
  const { mutate: requestDeveloperTool, isPending } = useRequestDeveloperTool();

  // const handleFileChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = event.target.files?.[0];

  //   if (file && file.size <= 500 * 1024) {
  //     const reader = new FileReader();
  //     // customImageNameRef.current = file.name;

  //     reader.onload = () => {
  //       const base64String = reader.result as string;
  //       setFieldValue("icon", { fileName: file.name, image: base64String });
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     toast("Image size exceeds 500 KB. Please upload a smaller image.");
  //   }
  // };

  const handleSubmit = (values: CreateToolForm) => {
    const request = {
      ...values,
      id: uuidv4(),
      principal: Principal.fromText(wallet!.principalId),
      status: { pending: null },
      icon: convertToMotokoOptional(values.icon),
      coverImage: convertToMotokoOptional(values.coverImage),
      presentationUrl: convertToMotokoOptional(values.presentationUrl),
      demoUrl: convertToMotokoOptional(values.demoUrl),
    };
    console.log(request);
    // requestDeveloperTool(request, {
    //   onSuccess: () => {
    //     toast.success("Request submitted");
    //     navigate("/my-space/my-tools");
    //   },
    //   onError: e => {
    //     console.error(e);
    //     toast.error(e.message);
    //   },
    // });
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
            {({ values, dirty, handleSubmit, handleReset }) => (
              <Form
                className="tool-listing__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <FormikInput
                  name="name"
                  placeholder="Enter Tool Name"
                  label={<span className="fs-7">Tool Name</span>}
                />
                <div className="d-flex flex gap-2">
                  <div>
                    <Form.Label>
                      <span className="fs-7">Upload icon tool</span>
                    </Form.Label>
                    <ImageUploader<CreateToolForm>
                      id="iconUploader"
                      value={values.icon}
                      name="icon"
                      maxSize={500}
                    />
                    <span className="fs-7">
                      Tool image icon resolution
                      <br />
                      (96 x 96px)
                    </span>
                  </div>
                  <div>
                    <Form.Label>
                      <span className="fs-7">Upload tool cover image</span>
                    </Form.Label>
                    <ImageUploader<CreateToolForm>
                      id="coverUploader"
                      value={values.coverImage}
                      name="icon"
                      maxSize={500}
                    />
                    <span className="fs-7">
                      Cover image resolution
                      <br />
                      (800 x 500px)
                    </span>
                  </div>
                </div>
                <FormikInput
                  name="description"
                  as="textarea"
                  placeholder="Describe your tool"
                  label={<span className="fs-7">Tools Description</span>}
                  rows={5}
                />
                <FormikInput
                  name="projectUrl"
                  label={<span className="fs-7">Tool Repository Link</span>}
                  placeholder="Repository URL"
                />
                <FormikInput
                  name="category"
                  label={<span className="fs-7">Category</span>}
                  placeholder="Enter category"
                />
                <FormikInput name="demoUrl" label="Demo Url" />
                <FormikInput name="presentationUrl" label="Presentation Url" />
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
