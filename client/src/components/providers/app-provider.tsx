"use client";

import { User } from "@/app/types";
import { useLocalStorage } from "@/lib/hooks";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext
} from "react";

interface IAppContext {
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>,
    isLoggedIn: () => boolean
}

export const AppContext = createContext<IAppContext>({ user: null, setUser: () => null, isLoggedIn: () => false });

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useLocalStorage('auth', null);

    const defaultValue: IAppContext = {
        user,
        setUser,
        isLoggedIn: () => user !== null
    };

    return (
        <AppContext.Provider value={defaultValue}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}

