import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { addUser, removeUser, users } from "./data/users";
import { Message } from "./types";

const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    const socketId = socket.id;

    socket.on('user:login', ({ username }) => {
        const user = addUser({ username, id: socketId });
        socket.emit('user:connected', { user, state: users.filter(u => u.id !== user.id) });
        socket.broadcast.emit('user:new', { username: user.username, id: user.id });
    });

    socket.on('send:message', ({
        message,
        receiverId,
        senderId
    }: Message
    ) => {
        socket.broadcast.to(receiverId).emit('receive:message', { message, senderId, receiverId });
        io.to(senderId).emit('receive:message', { message, senderId: receiverId, receiverId })
    });

    socket.on('disconnect', () => {
        removeUser(socketId);
        io.emit('user:disconnected', socketId);
    });
})

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

