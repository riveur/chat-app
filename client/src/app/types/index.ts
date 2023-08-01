export interface User {
    id: string;
    username: string;
}

export interface Message {
    senderId: User['id'],
    message: string
}