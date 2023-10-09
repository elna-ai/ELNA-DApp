import { Artemis } from "artemis-web3-adapter";
import { singletonHook } from "react-singleton-hook";

const init = { loading: true };
const connectionObject = {
  whitelist: ["be2us-64aaa-aaaaa-qaabq-cai"],
  host: "https://icp0.io/",
};
const useArtemis = () => {
  const artemis = new Artemis(connectionObject);

  return artemis;
};

export const useWallet = singletonHook(init, useArtemis);
