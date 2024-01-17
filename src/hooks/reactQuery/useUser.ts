import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { canisterId, idlFactory } from "declarations/backend";
import { useWallet } from "hooks/useWallet"
import { useUserStore } from "stores/useUser";

export const useGenerateUserToken = () => {
  const wallet = useWallet();
  const saveUserToken = useUserStore(state => state.setUserToken);

  return useMutation({
    mutationFn: async () => {

      if(wallet === undefined) {
        toast.error("User not logged in");
        return;
      }
      const wizardDetails = await wallet.getCanisterActor(canisterId, idlFactory,false);
      const token = await wizardDetails.generateUserToken();
      return token;
    },
    onSuccess:(token:string) => {
      console.log({token});
      saveUserToken(token);

    },
    onError: (e) => {
      console.error(e);
      toast.error(e.message);

    }
  });
}
