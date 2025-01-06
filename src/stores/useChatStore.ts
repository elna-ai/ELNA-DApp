import { create } from 'zustand';
import { Message } from 'src/types';

type Chat = {
  agentId: string;
  messages: Message[];
}

type ChatStore = {
  chats: Chat[];
  createChat: (agentId: string) => void;
  updateChat: (agentId: string, message: Message) => void;
  clearChat: (agentId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],

  createChat: (agentId) =>
    set((state) => ({
      chats: [...state.chats, { agentId, messages: [] }],
    })),

  updateChat: (agentId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.agentId === agentId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
    })),

  clearChat: (agentId) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.agentId !== agentId),
    })),
}));
