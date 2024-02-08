import { t } from "i18next";
import * as yup from "yup";

export const CREATE_BOT_MODAL_INITIAL_VALUES = { name: "" };

export const CREATE_BOT_MODAL_VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required()
    .min(2, t("createAgent.form.validations.name")),
});
