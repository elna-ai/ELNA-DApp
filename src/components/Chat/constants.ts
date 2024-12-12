import { X_Handle } from "src/constants";

export const DEFAULT_AGENT_ID = "2";

export const TWITTER_SHARE_CONTENT = (
  wizardName: string,
  url: string,
  userXHandle: string
) => `Check this out! I'm talking to DeAI agent ${wizardName} built ${userXHandle ? `by @${userXHandle} on` : "on"} ELNA.ai

${url}

${X_Handle} is the world's 1st DeAI creation platform!\n\n
`;

export const TWITTER_HASHTAGS =
  "AIagentActivated,ELNAai,DecentralizedAl,GenerativeAl,ICP";
