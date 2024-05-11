import * as yup from "yup";

export const CREATE_TOOL_FORM_INITIAL = {
  name: "",
  description: "",
  projectUrl: "",
  category: "",
};

export const CREATE_TOOL_FORM_VALIDATION = yup.object().shape({
  name: yup.string().trim().required(),
  description: yup.string().trim().required(),
  projectUrl: yup.string().url().trim().required(),
  category: yup.string().trim().required(),
});
