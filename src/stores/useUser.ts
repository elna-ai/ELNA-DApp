import { create } from "zustand";

type UserStore = {
  userToken: string;
  setUserToken: (token:string) => void;
  resetToken: () => void;
};
export const useUserStore = create<UserStore>()(set =>({
  userToken: "",
  setUserToken: (token:string) => set(() => ({userToken:token})),
  resetToken:() => set({userToken:""})
}));
