import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MessageCreateValidator {
  constructor(protected ctx?: HttpContextContract) { }

  public schema = schema.create({
    content: schema.string([rules.maxLength(255)]),
    receiverId: schema.number([rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages: CustomMessages = {}
}
