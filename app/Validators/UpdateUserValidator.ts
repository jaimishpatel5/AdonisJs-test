import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user: schema.object().members({
      username: schema.string.optional({}),
      email: schema.string.optional({}, [rules.email()]),
      password: schema.string.optional({}, [rules.minLength(6)])
    }),
  })

  /**
   * Custom messages for validation failures. 
   */
  public messages = {
    'username.unique': 'Username mast be unique',
    'username.exists': 'Username is already exists',
    'password.string': 'Password should be string',
    'email.unique': 'Email mast be unique',
    'email.exists': 'Email is already exists'
  }
}
