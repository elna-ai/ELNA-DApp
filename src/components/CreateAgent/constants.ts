import { t } from "i18next";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";

import morgan from "images/morgan.png";
import musk from "images/musk.png";
import albert from "images/albert.png";
import hacker from "images/hacker.png";

export const TEMPLATE_BOTS = [
  {
    id: uuidv4(),
    name: "Morgan Freeman",
    description:
      "Create a professional AI agent in minutes. Simply upload related documents or web links, and it will become an expert in your field.",
    imageUrl: morgan,
    // tag: "Knowledge-base Genius",
  },
  {
    id: uuidv4(),
    name: "Albert Einstein",
    description:
      "Create a professional AI agent in minutes. Simply upload related documents or web links, and it will become an expert in your field.",
    imageUrl: albert,
    // tag: "Scientist",
  },
  {
    id: uuidv4(),
    name: "Elon Musk",
    description:
      "Create a professional AI agent in minutes. Simply upload related documents or web links, and it will become an expert in your field.",
    imageUrl: musk,
    // tag: "CEO",
  },
  {
    id: uuidv4(),
    name: "Huma Therman Freeman",
    description:
      "Create a professional AI agent in minutes. Simply upload related documents or web links, and it will become an expert in your field.",
    imageUrl: hacker,
    // tag: "Hacker Twin",
  },
];

export const CREATE_BOT_MODAL_INITIAL_VALUES = { name: "" };

export const CREATE_BOT_MODAL_VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required()
    .min(2, t("createAgent.form.validations.name")),
});

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

export const TWITTER_SHARE_CONTENT = "CONTENT HERE";
