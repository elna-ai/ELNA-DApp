import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { UserState } from "../types";


export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: {},
      setUser: user => set(state => ({ ...state, user })),
    }),
    { name: "user-storage", storage: createJSONStorage(() => localStorage) }
  )
);
