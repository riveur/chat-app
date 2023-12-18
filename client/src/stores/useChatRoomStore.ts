import { MessageSchema as Message } from "@/lib/validation";
import { create } from "zustand";

export type ChatRoomState = {
    conversations: Message[];
    setConversations: (newConversations: Message[]) => void;
    addMessageToConversation: (message: Message) => void;
}

export const useChatRoomStore = create<ChatRoomState>((set) => ({
    conversations: [],
    setConversations: (newConversations) => set(() => ({ conversations: newConversations })),
    addMessageToConversation: (message) => {
        set((state) => ({ conversations: [...state.conversations, message] }));
    }
}));