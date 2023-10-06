import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { groupBy, pipe, sort } from 'remeda';

import User from "App/Models/User";

export default class UsersController {
  public async index() {
    const users = User.all();
    return users;
  }

  public async conversations({ request, response }: HttpContextContract) {
    const userId: string = request.param('id', null);

    if (!userId) {
      return response.badRequest({ message: 'You must provide an id' });
    }

    const user = await User.find(userId);


    if (!user) {
      return response.notFound({ message: `The user "${userId}" was not found` });
    }

    await user.load('sentMessages', (query) => query.orderBy('created_at', 'asc'));
    await user.load('receivedMessages', (query) => query.orderBy('created_at', 'asc'));

    return pipe(
      [
        ...user.sentMessages,
        ...user.receivedMessages.map(message => {
          message.receiverId = message.senderId;
          return message;
        })
      ],
      (messages) => sort(messages, (a, b) => a.createdAt.toSeconds() - b.createdAt.toSeconds()),
      (messages) => groupBy(messages, (message) => message.receiverId)
    )
  }
}
