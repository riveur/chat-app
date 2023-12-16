import Ws from 'App/Services/Ws';
import sessionConfig from 'Config/session';
import Encryption from '@ioc:Adonis/Core/Encryption';
import Request from '@ioc:Adonis/Core/Request';
import { Socket } from 'socket.io';
import Message from 'App/Models/Message';

const getSocketUser = (socket: Socket) => {
  // @ts-ignore
  const SocketRequest = new Request(socket.request, null, Encryption, {})
  const sessionId = SocketRequest.cookie(sessionConfig.cookieName)

  if (!sessionId) {
    return null;
  }

  const session = SocketRequest.encryptedCookie(sessionId);

  if (!session || !session.auth_web) {
    return null;
  }
  return session.auth_web as number;
}

Ws.boot();

const connectedUsers = new Map<string, string>();

Ws.io.on('connection', (socket) => {
  const userId = getSocketUser(socket);

  if (!userId) {
    socket.disconnect();
    return;
  }

  connectedUsers.set(userId.toString(), socket.id);

  socket.broadcast.emit('user:connected', { userId });

  socket.on('disconnect', () => {
    connectedUsers.delete(userId.toString());
    Ws.io.emit('user:disconnected', { userId });
  });

  socket.on('send:message', ({
    content,
    receiverId,
    senderId
  }: Pick<Message, "content" | "senderId" | "receiverId">
  ) => {
    Message.create({ content, senderId, receiverId })
      .then((message) => {
        const receiverSocketId = connectedUsers.get(message.receiverId.toString());
        const senderSocketId = connectedUsers.get(message.senderId.toString());
        const serializedMessage = message.serialize({ fields: { pick: ['content', 'sender_id', 'receiver_id', 'created_at'] } });

        if (receiverSocketId) {
          socket
            .broadcast
            .to(receiverSocketId)
            .emit('receive:message', { ...serializedMessage, receiver_id: message.senderId });
        }

        if (senderSocketId) {
          Ws.io.to(senderSocketId).emit('receive:message', serializedMessage)
        }
      });
  });
});
