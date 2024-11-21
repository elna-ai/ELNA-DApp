import * as yup from "yup";

export type MySpaceMenuProps = {
    to: string;
    key: string;
    toolTip: string;
};

export const MY_SPACE_LINK: MySpaceMenuProps[] = [
    {
        to: "/my-space",
        key: "profile",
        toolTip: "Profile Details",
    },
    {
        to: "/my-space/my-agents",
        key: "myAgents",
        toolTip: "Your Agents",
    },
    {
        to: "/my-space/my-tools",
        key: "myTools",
        toolTip: "Your Tools",
    },
    {
        to: "/my-space/plans",
        key: "plans",
        toolTip: "Your Subscription Plans",
    },
    {
        to: "/my-space/settings",
        key: "settings",
        toolTip: "Tweak your Settings",
    },
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