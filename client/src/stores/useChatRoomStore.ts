import { Message, User } from "@/app/types";
import { create } from "zustand";

export type ChatRoomState = {
    users: User[];
    setUsers: (users: User[]) => void;
    addUsers: (users: User[]) => void;
    conversations: Record<User['id'], Message[]>;
    addMessageToConversation: (message: Message) => void;
}

export const useChatRoomStore = create<ChatRoomState>((set) => ({
    users: [],
    setUsers: (users) => set(() => ({ users: users })),
    addUsers: (users) => set((state) => ({ users: [...state.users, ...users] })),
    conversations: {},
    addMessageToConversation: (message) => {
        set((state) => {
            const target = state.conversations[message.senderId];
            if (target) {
                return { conversations: { ...state.conversations, [message.senderId]: [...target, message] } };
            } else {
                return { conversations: { ...state.conversations, [message.senderId]: [message] } };
            }
        });
    }
}));