import { UserSchema as User } from "@/lib/validation";
import { create } from "zustand";

export type ConnectedUsersStore = {
  connectedUsers: Set<User['id']>;
  add: (id: User['id']) => void;
  remove: (id: User['id']) => void;
  init: (users: Array<User['id']>) => void;
}

export const useConnectedUsersStore = create<ConnectedUsersStore>((set) => ({
  connectedUsers: new Set<User['id']>(),
  add: (id) => set(state => ({ connectedUsers: new Set(state.connectedUsers).add(id) })),
  remove: (id) => set(state => {
    const connectedUsers = new Set(state.connectedUsers);
    connectedUsers.delete(id);
    return { connectedUsers };
  }),
  init: (users) => set({ connectedUsers: new Set(users) })
}));