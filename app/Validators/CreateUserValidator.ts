import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user: schema.object().members({
      username: schema.string({}, [rules.unique({ table: 'users', column: 'username' })]),
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.minLength(6)]),
    }),
  })

  /**
   * Custom messages for validation failures. 
   */
  public messages = {
    'username.required': 'Username is required',
    'username.unique': 'Username mast be unique',
    'username.exists': 'Username is already exists',
    'password.string': 'Password should be string',
    'password.required': 'Password is required',
    'email.required': 'Email is required',
    'email.unique': 'Email mast be unique',
    'email.exists': 'Email is already exists'
  }
}
