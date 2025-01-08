import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "src/types";

type ChatStore = {
  chatStore: {
    agentId: string;
    messages: Message[];
  }[];
  createChat: (agentId: string) => void;
  updateChat: (agentId: string, message: Message) => void;
  retrieveChat: (agentId: string) => Message[] | undefined;
  clearChat: (agentId: string) => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatStore: [],

      createChat: (agentId: string) => {
        const { chatStore } = get();
        const chatExists = chatStore.some(chat => chat.agentId === agentId);
        if (!chatExists) {
          const updatedStore = [...chatStore, { agentId, messages: [] }];
          set({ chatStore: updatedStore });
        }
      },

      updateChat: (agentId: string, message: Message) => {
        set(state => ({
          chatStore: state.chatStore.map(chat =>
            chat.agentId === agentId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat
          ),
        }));
      },

      retrieveChat: (agentId: string) => {
        const chat = get().chatStore.find(chat => chat.agentId === agentId);
        return chat?.messages;
      },

      clearChat: (agentId: string) => {
        set(state => ({
          chatStore: state.chatStore.filter(chat => chat.agentId !== agentId),
        }));
      },
    }),
    {
      name: "chatStore",
    }
  )
);
