import { User } from "../types";

export let users: User[] = [];

export function addUser(user: User) {
    users = [...users, user];
    return user;
}

export function getUser(id: User['id']) {
    return users.find(user => user.id === id);
}

export function removeUser(id: User['id']) {
    users = users.filter(user => user.id !== id);
}