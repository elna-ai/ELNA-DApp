import { create } from "zustand";

type UserStore = {
  userToken: string;
  isUserLoggedIn: boolean;
  setUserToken: (token: string) => void;
  resetToken: () => void;
  resetLoggedInState: () => void;
};
export const useUserStore = create<UserStore>()(set => ({
  userToken: "",
  isUserLoggedIn: !!localStorage.getItem("dfinityWallet"),
  setUserToken: (token: string) => set(() => ({ userToken: token })),
  resetToken: () => set({ userToken: "" }),
  resetLoggedInState: () =>
    set({ isUserLoggedIn: !!localStorage.getItem("dfinityWallet") }),
}));
