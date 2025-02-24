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

export const XINTEGRATION_VALIDATION_SCHEMA = yup.object().shape({
  apiKey: yup.string().trim().required("Invalid API Key entered"),
  apiKeySecret: yup.string().trim().required("Invalid API Key Secret entered"),
  accessToken: yup.string().trim().required("Invalid Access Token entered"),
  accessTokenSecret: yup
    .string()
    .trim()
    .required("Invalid Access Token Secret entered"),
  bearerToken: yup.string().trim().required("Invalid Bearer Token entered"),
  userId: yup
    .string()
    .matches(/^[^@].*$/, "Twitter handle cannot start with '@'")
    .required("Twitter handle is required"),
});

export const XINTEGRATION_INITIAL_VALUE = {
  apiKey: "",
  apiKeySecret: "",
  accessToken: "",
  accessTokenSecret: "",
  bearerToken: "",
  userId: "",
};

export const TELEGRAM_INTEGRATION_VALIDATION_SCHEMA = yup.object().shape({
  telegramApiKey: yup
    .string()
    .trim()
    .required("Invalid Telegram API Key entered"),
});

export const TELEGRAM_INTEGRATION_INITIAL_VALUE = {
  telegramApiKey: "",
};

export const TWITTER_SHARE_CONTENT = (
  wizardName: string,
  url: string
) => `Check this out! I've created a DeAI agent ${wizardName} using ELNA.ai

${url}

${X_Handle} is the world's 1st DeAI creation platform.\n\n`;

export const TWITTER_HASHTAGS =
  "AIagentActivated,ELNAai,DecentralizedAl,GenerativeAl,ICP";

export const X_INTEGRATION_VALIDATION_SCHEMA = yup.object().shape({
  apiKey: yup.string().trim().required("Invalid API Key entered"),
  apiKeySecret: yup.string().trim().required("Invalid API Key Secret entered"),
  accessToken: yup.string().trim().required("Invalid Access Token entered"),
  accessTokenSecret: yup
    .string()
    .trim()
    .required("Invalid Access Token Secret entered"),
  bearerToken: yup.string().trim().required("Invalid Bearer Token entered"),
  userId: yup
    .string()
    .matches(/^[^@].*$/, "Twitter handle cannot start with '@'")
    .required("Twitter handle is required"),
});

export const X_INTEGRATION_INITIAL_VALUE = {
  apiKey: "",
  apiKeySecret: "",
  accessToken: "",
  accessTokenSecret: "",
  bearerToken: "",
  userId: "",
};
