import { t } from "i18next";

const homeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler feather feather-home"
    width=" 24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const createIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler feather feather-file-plus"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);

const feedbackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler feather feather-help-circle"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const docsIcons = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler feather feather-file-text"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

// TODO: Figure out why directly declaring an array is causing t() to not work
export const SIDEBAR_LINK = [
  {
    to: "/",
    Icon: homeIcon,
    key: "home",
    isComingSoon: false,
  },
  {
    to: "/create-agent",
    Icon: createIcon,
    key: "create",
    isComingSoon: false,
  },
  {
    Icon: feedbackIcon,
    key: "feedback",
    isComingSoon: false,
  },
  {
    Icon: docsIcons,
    to: "https://docs.elna.live/",
    otherParams: { target: "_blank", rel: "noopener noreferrer" },
    key: "docs",
    isComingSoon: false,
  },
];

export const ADMIN_SIDEBAR_LINKS = [
  {
    Icon: homeIcon,
    to: "/admin",
    key: "admin.dashboard",
    otherParams: {},
    isComingSoon: false,
  },
  {
    Icon: homeIcon,
    to: "/admin/whitelist",
    key: "admin.whitelist",
    isComingSoon: false,
  },
];
