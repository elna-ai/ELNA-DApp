import * as yup from "yup";
import { X_Handle } from "src/constants";

export type MySpaceMenuProps = {
  to: string;
  key: string;
  toolTip: string;
};

export const MY_SPACE_LINK: MySpaceMenuProps[] = [
  {
    to: "/my-space/profile",
    key: "Profile",
    toolTip: "Profile Details",
  },
  {
    to: "/my-space/my-agents",
    key: "My Agents",
    toolTip: "Your Agents",
  },
  {
    to: "/my-space/my-tools",
    key: "My Tools",
    toolTip: "Your Tools",
  }
];

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

export const USER_PROFILE_FORM_INITIAL = {
  alias: "",
  xHandle: "",
  bio: "",
};

export const USER_PROFILE_FORM_VALIDATION = yup.object().shape({
  alias: yup.string().trim().required().min(3),
  bio: yup.string().min(10),
});

export const CREATE_TOOL_FORM_INITIAL = {
  name: "",
  description: "",
  projectUrl: "",
  category: "",
  icon: { fileName: "", image: "" },
  coverImage: { fileName: "", image: "" },
  presentationUrl: "",
  demoUrl: "",
};

export const CREATE_TOOL_FORM_VALIDATION = yup.object().shape({
  name: yup.string().trim().required(),
  description: yup.string().trim().required(),
  projectUrl: yup.string().url().trim().required(),
  category: yup.string().trim().required(),
  icon: yup.object().shape({
    fileName: yup.string().trim().required(),
    image: yup.string().trim().required(),
  }),
  coverImage: yup.object().shape({
    fileName: yup.string().trim().required(),
    image: yup.string().trim().required(),
  }),
  presentationUrl: yup.string().url().trim(),
  demoUrl: yup.string().url().trim(),
});

export const TWITTER_SHARE_CONTENT = `Check this out! I'm a Developer at ELNA.ai
${X_Handle} is the world's 1st Decentralised AI creation platform.
Become one today by listing your tools
👉 https://dapp.elna.ai/ \n
`;

// #AI on #Blockchain
export const TWITTER_HASHTAGS =
  "ELNA_Devs,ELNAai,DecentralizedAI,GenerativeAI,AIagents,DeAiHackELNA";