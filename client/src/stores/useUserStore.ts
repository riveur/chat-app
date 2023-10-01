import { User } from "@/app/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserStore = {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useUserStore = create(
    persist<UserStore>(
        (set) => ({
            user: null,
            setUser: (user) => set({ user })
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage)
        }
    )
);