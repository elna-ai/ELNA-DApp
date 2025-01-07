import { create } from 'zustand';
import { Message } from 'src/types';

// Define the Chat type
type Chat = {
  agentId: string;
  messages: Message[];
};

// Define the Zustand store
interface ChatStore {
  chatStore: Chat[];

  // Actions
  createChat: (agentId: string) => void;
  updateChat: (agentId: string, message: Message) => void;
  retrieveChat: (agentId: string) => Message[] | undefined;
  clearChat: (agentId: string) => void;
}

// Zustand store
export const useChatStore = create<ChatStore>((set, get) => {
  // Load data from localStorage during initialization
  const storedChats = localStorage.getItem("chatStore");
  const initialChats: Chat[] = storedChats ? JSON.parse(storedChats) : [];

  return {
    chatStore: initialChats, // Initialize store

    createChat: (agentId) => {
        set((state) => {
          // Check if the agentId already exists in the store
          const chatExists = state.chatStore.some((chat) => chat.agentId === agentId);
      
          // If it already exists, return the current state without changes
          if (chatExists) {
            console.log(`Chat with agentId "${agentId}" already exists.`);
            return state; // No changes
          }
      
          // If it doesn't exist, create a new chat entry
          const updatedStore = [
            ...state.chatStore,
            { agentId, messages: [] },
          ];
      
          // Persist the updated store to localStorage
          localStorage.setItem("chatStore", JSON.stringify(updatedStore));
          console.log("Created new chat:", updatedStore);
      
          // Return the updated store
          return { chatStore: updatedStore };
        });
      },
      

    // Update existing chat
    updateChat: (agentId, message) => {
      set((state) => {
        const updatedStore = state.chatStore.map((chat) =>
          chat.agentId === agentId
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        );
        localStorage.setItem("chatStore", JSON.stringify(updatedStore)); // Persist to localStorage
        console.log("updated",state.chatStore);
        return { chatStore: updatedStore };
      });
    },

    // Retrieve messages by agentId
    retrieveChat: (agentId) => {
      const chat = get().chatStore.find((chat) => chat.agentId === agentId);
      return chat ? chat.messages : undefined;
    },

    // Clear chat by agentId
    clearChat: (agentId) => {
      set((state) => {
        const updatedStore = state.chatStore.filter(
          (chat) => chat.agentId !== agentId
        );
        localStorage.setItem("chatStore", JSON.stringify(updatedStore)); // Persist to localStorage
        return { chatStore: updatedStore };
      });
    },
  };
});

