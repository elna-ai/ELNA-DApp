import { Artemis } from "artemis-web3-adapter";
import { singletonHook } from "react-singleton-hook";


const useArtemis = () => {
  const artemis = new Artemis();

  return artemis;
};

export const useWallet = singletonHook(undefined, useArtemis, {});
