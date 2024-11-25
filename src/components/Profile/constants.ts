import * as yup from "yup";

import { X_Handle } from "src/constants";

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

export const TWITTER_SHARE_CONTENT = `Check this out! I'm a Developer at Elna.ai  - World's 1st Decentralised AI Agent creation platform.\n
Create your own DeAI agent at dapp.elna.ai and stay up to date with our latest developments at ${X_Handle}!\n
`;

// #AI on #Blockchain
export const TWITTER_HASHTAGS =
  "ELNA_Devs,ELNAai,DecentralizedAl,GenerativeAl,Alagents,DeAiHackELNA,DeAiBootcampELNA";

export const USER_PROFILE_FORM_INITIAL = {
  alias: "",
  xHandle: "",
  bio: "",
};

export const USER_PROFILE_FORM_VALIDATION = yup.object().shape({
  alias: yup.string().trim().required().min(3),
  bio: yup.string().min(10),
});