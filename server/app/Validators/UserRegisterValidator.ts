import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class UserRegisterValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    username: schema.string([rules.maxLength(255)]),
    email: schema.string([rules.maxLength(255), rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string([rules.maxLength(255), rules.confirmed()])
  })

  public messages: CustomMessages = {}
}
