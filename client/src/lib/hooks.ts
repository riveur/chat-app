import {
    ConversationsReducerAction,
    ConversationsReducerActions,
    ConversationsReducerState,
} from "@/app/types";
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

export function conversationsReducer(state: ConversationsReducerState, action: ConversationsReducerAction) {
    const { type, payload } = action;
    switch (type) {
        case ConversationsReducerActions.ADD_MESSAGE:
            const target = state[payload.senderId];
            if (target) {
                return { ...state, [payload.senderId]: [...target, payload] };
            } else {
                return { ...state, [payload.senderId]: [payload] };
            }
        default:
            return state;
    }
}