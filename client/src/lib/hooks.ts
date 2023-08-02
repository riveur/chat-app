import { Message, User } from "@/app/types";
import { useEffect, useState } from "react";

export function useLocalStorage(key: string, defaultValue: string | null) {
    const [value, setValue] = useState(() => {
        let currentValue: any;

        try {
            currentValue = JSON.parse(
                localStorage.getItem(key) || String(defaultValue)
            );
        } catch (error) {
            currentValue = defaultValue;
        }

        return currentValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
};

export function useMessages(key: string) {
    const [messages, setMessages] = useState<Message[]>([]);

    return { messages, setMessages };
}

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);

    return { users, setUsers };
}