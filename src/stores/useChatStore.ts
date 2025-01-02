// import { create } from "zustand";
// import { Message } from "src/types";

// type ChatStore = {
//     userChat: [Message[]];
//     isUserLoggedIn: boolean;
//     setuserChat: (token: string) => void;
//     resetToken: () => void;
//     resetLoggedInState: () => void;
//   };
//   export const useChatStore = create<ChatStore>()(set => ({
//     userChat: "",
//     isUserLoggedIn: !!localStorage.getItem("dfinityWallet"),
//     setuserChat: (token: string) => set(() => ({ userChat: token })),
//     resetToken: () => set({ userChat: "" }),
//     resetLoggedInState: () =>
//       set({ isUserLoggedIn: !!localStorage.getItem("dfinityWallet") }),
//   }));