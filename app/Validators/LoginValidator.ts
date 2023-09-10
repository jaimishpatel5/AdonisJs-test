import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user: schema.object().members({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.minLength(6)]),
    }),
  })

  /**
   * Custom messages for validation failures. 
   */
  public messages = {
    'password.string': 'Password should be valid string',
    'password.required': 'Password is required',
    'email.required': 'Email is required',
    'email.unique': 'Email mast be unique'
  }
}
