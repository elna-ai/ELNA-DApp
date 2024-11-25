import * as yup from "yup";

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
  },
  // {
  //   to: "/my-space/plans",
  //   key: "Plans",
  //   toolTip: "Your Subscription Plans",
  // },
  // {
  //   to: "/my-space/settings",
  //   key: "Settings",
  //   toolTip: "Tweak your Settings",
  // },
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
};

export const CREATE_TOOL_FORM_VALIDATION = yup.object().shape({
  name: yup.string().trim().required(),
  description: yup.string().trim().required(),
  projectUrl: yup.string().url().trim().required(),
  category: yup.string().trim().required(),
});
