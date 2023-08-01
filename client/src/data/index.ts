import { Message, User } from "@/app/types";

export const users: User[] = [
    { id: "1", username: 'john' },
    { id: "2", username: 'elon' },
    { id: "3", username: 'testing' },
    { id: "4", username: 'gates' },
    { id: "5", username: 'mark' },
    { id: "6", username: 'bezos' },
    { id: "7", username: 'bezos' },
    { id: "8", username: 'bezos' },
    { id: "9", username: 'bezos' },
    { id: "10", username: 'bezos' },
    { id: "11", username: 'bezos' },
    { id: "12", username: 'bezos' },
];

export const messages: { [key: string]: Message[] } = {
    '1690735252331:1': [
        { senderId: "1", message: "Hello !" },
        { senderId: "1690735252331", message: "Hi how are you ?" },
        { senderId: "1", message: "Good thanks !" },
        { senderId: "1", message: "How was your day ?" },
        { senderId: "1690735252331", message: "Pretty good, I'm coding right now" },
        { senderId: "1", message: "Nice !" },
    ],
    '1690735252331:2': [
        { senderId: "1690735252331", message: "Hi !" },
        { senderId: "2", message: "Hey ma boi !" },
        { senderId: "2", message: "What's up ?" },
        { senderId: "1690735252331", message: "How was your day ?" },
        { senderId: "2", message: "Pretty good, I'm coding right now" },
        { senderId: "1690735252331", message: "Nice !" },
    ],
};