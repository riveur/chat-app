export interface User {
    id: string;
    username: string;
}

export interface Message {
    senderId: User['id'];
    receiverId: User['id'];
    message: string;
}