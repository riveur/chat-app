export interface User {
    id: string;
    username: string;
}

export interface Message {
    senderId: User['id'];
    receiverId: User['id'];
    message: string;
}

export enum ConversationsReducerActions {
    ADD_MESSAGE = 'ADD_MESSAGE'
}

export type ConversationsReducerState = Record<User['id'], Message[]>;

export type ConversationsReducerAction = {
    type: ConversationsReducerActions,
    payload: Message
}