import { ConversationsValidation, UserSchema, UserValidation, UsersValidation } from "./validation";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const defaultsHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export async function signIn(data: { email: string, password: string }) {
  return fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: defaultsHeaders,
    body: JSON.stringify(data),
    credentials: 'include'
  })
    .then(response => response.json());
}

export async function logout() {
  return fetch(`${API_URL}/api/auth/logout`, {
    credentials: 'include'
  });
}

export async function getUser() {
  return fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    headers: defaultsHeaders,
    credentials: 'include'
  })
    .then(response => response.json())
    .then(UserValidation.parse);
}

export async function getUsers() {
  return fetch(`${API_URL}/api/users`, {
    method: 'GET',
    headers: defaultsHeaders,
    credentials: 'include'
  })
    .then(response => response.json())
    .then(UsersValidation.parse);
}

export async function getConversations(userId?: UserSchema['id']) {
  return fetch(`${API_URL}/api/users/${userId}/conversations`, {
    method: 'GET',
    headers: defaultsHeaders,
    credentials: 'include'
  })
    .then(response => response.json())
    .then(ConversationsValidation.parse);
}