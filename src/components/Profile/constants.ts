import * as yup from "yup";

export const DEVELOPER_REQUEST_FORM_INITIAL = {
  alias: "",
  email: "",
  github: "",
  description: "",
};

export const DEVELOPER_REQUEST_FORM_VALIDATION = yup.object().shape({
  alias: yup.string().trim().required().min(3),
  email: yup.string().trim().email().required(),
  github: yup.string().trim().url().required(),
  description: yup.string().trim().required().min(10),
});
