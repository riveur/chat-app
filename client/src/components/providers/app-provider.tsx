"use client";

import { User } from "@/app/types";
import { useLocalStorage } from "@/lib/hooks";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState
} from "react";

interface IAppContext {
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>
}

export const AppContext = createContext<IAppContext>({ user: null, setUser: () => null });

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const defaultValue: IAppContext = {
        user,
        setUser
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

