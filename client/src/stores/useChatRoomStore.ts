import { UserSchema as User, MessageSchema as Message } from "@/lib/validation";
import { create } from "zustand";

export type ChatRoomState = {
    users: User[];
    setUsers: (users: User[]) => void;
    addUsers: (users: User[]) => void;
    conversations: Record<User['id'], Message[]>;
    setConversations: (newConversations: Record<User['id'], Message[]>) => void;
    addMessageToConversation: (message: Message) => void;
}

export const useChatRoomStore = create<ChatRoomState>((set) => ({
    users: [],
    setUsers: (users) => set(() => ({ users: users })),
    addUsers: (newUsers) => set((state) => ({ users: [...state.users, ...newUsers] })),
    conversations: {},
    setConversations: (newConversations) => set(() => ({ conversations: newConversations })),
    addMessageToConversation: (message) => {
        set((state) => {
            const target = state.conversations[message.receiver_id];
            if (target) {
                return { conversations: { ...state.conversations, [message.receiver_id]: [...target, message] } };
            } else {
                return { conversations: { ...state.conversations, [message.receiver_id]: [message] } };
            }
        });
    }
}));