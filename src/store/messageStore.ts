import { TMessage } from "@/app/(tabs)";
import { create } from "zustand";
// export type TMessage = {
//   content: {
//     message: string;
//     id: string;
//   };
//   user: {
//     id: string;
//   };
// };

type Actions = {
  addMessage: (message: TMessage) => void;
};

type MessageState = {
  messages: TMessage[];
  actions: Actions;
};

const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  actions: {
    addMessage: (message: TMessage) =>
      set((state) => ({
        messages: [...state.messages, message],
      })),
  },
}));

export const useMessages = () => useMessageStore((state) => state.messages);
export const useMessagesActions = () =>
  useMessageStore((state) => state.actions);
