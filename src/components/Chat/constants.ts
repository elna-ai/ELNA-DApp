import dfinityimg from "images/avatar/01.png";
import ezraimg from "images/avatar/02.png";
import webthreeimg from "images/avatar/03.png";
import boxydudeimg from "images/avatar/04.png";
import quantumcomputingimg from "images/avatar/05.png";
import sathoshiimg from "images/avatar/06.png";
import sonicimg from "images/avatar/07.png";

export const DEFAULT_AGENT_ID = "2";

export const AVATAR_DUMMY_IMAGE = [
  { id: "eb39158c-19b1-4ffd-b9d6-460664bd9aa4", imgUrl: dfinityimg },
  { id: "168dc33c-6219-4d6c-9741-24dbecf59877", imgUrl: ezraimg },
  { id: "9ca7949a-2ed4-4d0d-8d7b-b513c3ba78b9", imgUrl: webthreeimg },
  { id: "317a4497-4d8d-46dd-a944-9af7443d7a44", imgUrl: boxydudeimg },
  { id: "a71d9987-ce94-42db-a811-0af62639a3c8", imgUrl: quantumcomputingimg },
  { id: "9447eaf7-6191-44e7-9b2e-9937526e2291", imgUrl: sathoshiimg },
  { id: "f934a40e-158c-4514-be53-2aca8a055995", imgUrl: sonicimg },
];

export const TWITTER_SHARE_CONTENT = (
  wizardName: string,
  url: string
) => `Check this out! I'm talking to this DeAI agent ${wizardName} built by ELNA.ai

${url}

@elna_live is the world's 1st DeAI creation platform.\n\n
`;
