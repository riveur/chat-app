import Ws from 'App/Services/Ws';
import sessionConfig from 'Config/session';
import Encryption from '@ioc:Adonis/Core/Encryption';
import Request from '@ioc:Adonis/Core/Request';
import { Socket } from 'socket.io';

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

Ws.io.on('connection', (socket) => {
  const userId = getSocketUser(socket);

  if (!userId) {
    socket.disconnect();
    return;
  }

  Ws.connectedUsers.set(userId.toString(), socket.id);

  socket.broadcast.emit('user:connected', { userId });

  socket.on('disconnect', () => {
    Ws.connectedUsers.delete(userId.toString());
    Ws.io.emit('user:disconnected', { userId });
  });
});
