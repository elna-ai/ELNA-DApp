export const PACKAGE_INSTALL_README = [
  { command: "npm", installCommand: "npm i @elna-ai/chat-widget" },
  { command: "yarn", installCommand: "yarn add @elna-ai/chat-widget" },
  { command: "pnpm", installCommand: "pnpm add @elna-ai/chat-widget" },
];

export const PACKAGE_INSTALL_EXAMPLE = (
  AGENT_UUID_IN_ELNA: string,
  LOGO_URL: string
) => {
  return `import "@elna-ai/chat-widget"; /n
   ...
  <elna-chat-widget
      agentId="${AGENT_UUID_IN_ELNA}"
      logo="${LOGO_URL}"
      headerBackgroundColor="#{VALID_VALUE_FOR_COLOR_PROPERTY}"
      ></elna-chat-widget>
`;
};
