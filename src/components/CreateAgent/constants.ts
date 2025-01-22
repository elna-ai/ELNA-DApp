import { t } from "i18next";
import * as yup from "yup";

import { X_Handle } from "src/constants";

export const PERSONA_VALIDATION_SCHEMA = yup.object().shape({
  biography: yup
    .string()
    .trim()
    .required()
    .min(30, t("createAgent.form.validations.biography")),
  greeting: yup
    .string()
    .trim()
    .required()
    .min(20, t("createAgent.form.validations.greeting")),
  description: yup.string().trim().required(),
  visibility: yup
    .string()
    .oneOf(
      ["public", "unlisted", "private"],
      t("createAgent.form.validations.visibility")
    )
    .required(t("createAgent.form.validations.visibility")),
});
