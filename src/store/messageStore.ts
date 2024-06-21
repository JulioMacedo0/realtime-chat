import { create } from "zustand";
export type TMessage = {
  content: {
    message: string;
    id: string;
  };
  user: {
    id: string;
  };
};

type MessageState = {
  messages: TMessage[];
  addMessage: (message: TMessage) => void;
};

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  addMessage: (message: TMessage) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));
