import { create } from "zustand";

const useConversation = create((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => {
    set({ selectedConversation });
    set({ messages: [] });
  },
  messages: [],
  setMessages: (messages) => set({ messages }),
  receiveMessage: (newMessage) => {
    const { messages } = get();

    set({ messages: [...messages, newMessage] });
  },
}));

export default useConversation;
