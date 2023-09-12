import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBookValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user: schema.object().members({
      title: schema.string({}, [rules.unique({ table: 'books', column: 'title' })]),
      authorName: schema.string({}, [rules.email(), rules.unique({ table: 'books', column: 'authorName' })]),
      userId: schema.string({}, [rules({table : "books", column:'userId'})]),
    }),
  })

  /**
   * Custom messages for validation failures. 
   */
  public messages = {
    'authorName.required': 'authorName is required',
    'userId.required': 'userId is required',
    'title.required': 'Title is required',
    'title.unique': 'Title mast be unique',
    'title.exists': 'Title is already exists'
  }
}
