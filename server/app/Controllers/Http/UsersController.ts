import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { pipe, sort } from 'remeda';

import User from "App/Models/User";

export default class UsersController {
  public async index() {
    const users = User.all();
    return users;
  }

  public async conversations({ params, response, auth }: HttpContextContract) {
    const userId: string = params.userId;
    const targetUser = await User.findOrFail(userId);

    await targetUser.load('sentMessages', (query) => query.where('receiverId', auth.user!.id));
    await targetUser.load('receivedMessages', (query) => query.where('senderId', auth.user!.id));

    const conversations = pipe(
      [
        ...targetUser.sentMessages,
        ...targetUser.receivedMessages,
      ],
      (messages) => sort(messages, (a, b) => a.createdAt.toSeconds() - b.createdAt.toSeconds()),
    );

    return response.ok(conversations);
  }
}
