import { create } from 'zustand';
import { Message } from 'src/types';

type Chat = {
  agentId: string;
  messages: Message[];
};

interface ChatStore {
  chatStore: Chat[];

  createChat: (agentId: string) => void;
  updateChat: (agentId: string, message: Message) => void;
  retrieveChat: (agentId: string) => Message[] | undefined;
  clearChat: (agentId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => {

  const storedChats = localStorage.getItem("chatStore");
  const initialChats: Chat[] = storedChats ? JSON.parse(storedChats) : [];

  return {
    chatStore: initialChats,

    createChat: (agentId) => {
        set((state) => {
          const chatExists = state.chatStore.some((chat) => chat.agentId === agentId);
      
          if (chatExists) {
            console.log(`Chat with agentId "${agentId}" already exists.`);
            return state;
          }
      
          const updatedStore = [
            ...state.chatStore,
            { agentId, messages: [] },
          ];
      
          localStorage.setItem("chatStore", JSON.stringify(updatedStore));
          return { chatStore: updatedStore };
        });
      },
      
    updateChat: (agentId, message) => {
      set((state) => {
        const updatedStore = state.chatStore.map((chat) =>
          chat.agentId === agentId
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        );
        localStorage.setItem("chatStore", JSON.stringify(updatedStore));
        return { chatStore: updatedStore };
      });
    },

    retrieveChat: (agentId) => {
      const chat = get().chatStore.find((chat) => chat.agentId === agentId);
      return chat ? chat.messages : undefined;
    },

    clearChat: (agentId) => {
      set((state) => {
        const updatedStore = state.chatStore.filter(
          (chat) => chat.agentId !== agentId
        );
        localStorage.setItem("chatStore", JSON.stringify(updatedStore));
        return { chatStore: updatedStore };
      });
    },
  };
});

