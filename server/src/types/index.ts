export interface User {
    id: string,
    username: string
}

export interface Message {
    message: string,
    senderId: string,
    receiverId: string,
}