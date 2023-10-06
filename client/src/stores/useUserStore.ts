import { UserSchema } from "@/lib/validation";
import { create } from "zustand";

export type UserStore = {
    user: UserSchema | null;
    setUser: (user: UserSchema | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user })
}));