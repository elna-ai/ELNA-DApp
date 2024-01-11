import * as yup from "yup";

export const WHITElIST_USER_VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().trim().required()
});
