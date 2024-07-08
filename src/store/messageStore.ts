import { ContentPayload } from "@/@types/types";
import { create } from "zustand";

type Actions = {
  addMessage: (message: ContentPayload) => void;
};

type MessageState = {
  messages: ContentPayload[];
  actions: Actions;
};

const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  actions: {
    addMessage: (message: ContentPayload) =>
      set((state) => ({
        messages: [...state.messages, message],
      })),
  },
}));

export const useMessages = () => useMessageStore((state) => state.messages);
export const useMessagesActions = () =>
  useMessageStore((state) => state.actions);
