import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "src/types";

type ICPPublicKey = string;
type AgentId = string;
type Id = `${ICPPublicKey}-${AgentId}`;
type ChatStore = {
  chats: { [id: Id]: Message[] };
  updateChat: (id: Id, message: Message | Message[]) => void;
  resetChat: (id: Id) => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: {},
      updateChat: (id, message) => {
        const chats = get().chats;
        if (chats?.[id] === undefined) {
          set({
            chats: {
              ...chats,
              [id]: Array.isArray(message) ? message : [message],
            },
          });
          return;
        }
        set({
          chats: {
            ...chats,
            [id]: Array.isArray(message)
              ? [...chats?.[id], ...message]
              : [...chats?.[id], message],
          },
        });
      },
      resetChat: id => {
        const chats = get().chats;
        delete chats[id];
        set({ chats });
      },
    }),
    { name: "elna-dapp-chats" }
  )
);
