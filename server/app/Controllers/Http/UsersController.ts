import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { pipe, sort } from 'remeda';

import User from "App/Models/User";
import Message from 'App/Models/Message';

export default class UsersController {
  public async index() {
    const users = User.all();
    return users;
  }

  public async conversations({ params, response, auth }: HttpContextContract) {
    const userId: string = params.userId;
    const targetUser = userId !== auth.user!.id.toString() ? await User.findOrFail(userId) : auth.user!;

    await targetUser.load('sentMessages', (query) => query.where('receiverId', auth.user!.id));

    let conversations: Message[] = [...targetUser.sentMessages];

    if (targetUser.id !== auth.user!.id) {
      await targetUser.load('receivedMessages', (query) => query.where('senderId', auth.user!.id));
      conversations = [...conversations, ...targetUser.receivedMessages];
    }

    conversations = pipe(
      conversations,
      (messages) => sort(messages, (a, b) => a.createdAt.toSeconds() - b.createdAt.toSeconds()),
    );

    return response.ok(conversations);
  }

  public async show({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id);
    return response.ok(user);
  }
}
