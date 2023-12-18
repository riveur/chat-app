import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Message from 'App/Models/Message';
import Ws from 'App/Services/Ws';
import MessageCreateValidator from 'App/Validators/MessageCreateValidator';

export default class MessagesController {

  public async send({ response, request, auth }: HttpContextContract) {
    const payload = await request.validate(MessageCreateValidator);
    const message = await Message.create({ ...payload, senderId: auth.user!.id });

    const receiverSocketId = Ws.connectedUsers.get(message.receiverId.toString());

    if (receiverSocketId && receiverSocketId !== auth.user!.id.toString()) {
      const serializedMessage = message.serialize({ fields: { pick: ['content', 'sender_id', 'receiver_id', 'created_at'] } });
      Ws.io.to(receiverSocketId).emit('receive:message', { ...serializedMessage, receiver_id: message.senderId });
    }

    return response.noContent();
  }
}