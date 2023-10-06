import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import UserRegisterValidator from 'App/Validators/UserRegisterValidator';
import Hash from '@ioc:Adonis/Core/Hash';

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    const data = await request.validate(UserRegisterValidator);
    const user = await User.create({ ...data, password: await Hash.make(data.password) });
    return user;
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.all();

    try {
      await auth.use('web').attempt(email, password);
    } catch {
      return response.badRequest({ message: 'Invalid credentials' });
    }

    return { status: true };
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout();

    return response.noContent();
  }

  public async user({ auth }: HttpContextContract) {
    return auth.use('web').user;
  }
}
