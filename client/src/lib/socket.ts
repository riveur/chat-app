import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const socket = io(URL, { withCredentials: true, autoConnect: false });