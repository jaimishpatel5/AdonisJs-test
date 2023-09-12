import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateBookValidator from 'App/Validators/CreateBookValidator'
import UpdateBookValidator from 'App/Validators/UpdateBookValidator'

export default class BookController {

  //add book

  public async store({ request, response, auth }: HttpContextContract) {
    const { book: bookPayload } = await request.validate(CreateBookValidator)

    await Book.create(bookPayload)

    return response.ok(bookPayload)
  }

  // update book

  public async update({ request, response, auth }: HttpContextContract) {
    const { user: bookPayload } = await request.validate(UpdateBookValidator)
    let book = auth.user!
    book.merge(bookPayload)
    await book.save()

    // Getting existing token from authorization header
    const token = request.headers().authorization!.replace('Bearer ', '')
    return response.ok(this.getBook(book, token))
  }

  //get all book with pagination and searching

  public async get({ request, response }: HttpContextContract) {
    const page = request.input('page', request.body.page)
    const perPage = request.input('perPage', request.body.perPage)
    const title = request.input('title')
    const authorName = request.input('authorName')

    // Query builder for filtering books by title and authorName
    const query = Database.from('books')
      .select('*')
      .where((builder) => {
        if (title) {
          builder.where('title', 'LIKE', `%${title}%`)
        }
        if (authorName) {
          builder.where('authorName', 'LIKE', `%${authorName}%`)
        }
      })
      .orderBy('id', 'desc')
      .paginate(page, perPage)

    const books = await query

    return response.ok(books)
  }

  // add to bookmarks

  public async addToBookmarks({ request, response, auth }: HttpContextContract) {
    const { bookId } = request.only(['bookId'])
    const user = auth.user!
  
    // Check if the book exists
    const book = await Book.findOrFail(bookId)
  
    // Check if the book is already in the user's bookmarks
    if (!user.bookMarks || !user.bookMarks.includes(book.id.toString())) {
      // Add the book to the user's bookmarks if it's not already there
      user.bookMarks = [...(user.bookMarks || []), book.id.toString()]
      await user.save()
      return response.ok({ message: 'Book added to bookmarks' })
    } else {
      return response.badRequest({ message: 'Book is already in bookmarks' })
    }
  }

  // remove from the bookmarks

  public async removeFromBookmarks({ request, response, auth }: HttpContextContract) {
    const { bookId } = request.only(['bookId'])
    const user = auth.user!

    // Remove the book from the user's bookmarks if it's there
    if (user.bookMarks && user.bookMarks.includes(bookId)) {
      user.bookMarks = user.bookMarks.filter((id) => id !== bookId)
      await user.save()
    }

    return response.ok({ message: 'Book removed from bookmarks' })
  }

  // get bookmarks book with pagination and searching

  public async getBookmarks({ request, response, auth }: HttpContextContract) {
    const user = auth.user!
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const title = request.input('title')
    const authorName = request.input('authorName')
    const bookIds = user.bookMarks || []

    // Query builder for filtering books by title and authorName
    const query = Database.from('books')
      .whereIn('id', bookIds)
      .where((builder) => {
        if (title) {
          builder.where('title', 'LIKE', `%${title}%`)
        }
        if (authorName) {
          builder.where('authorName', 'LIKE', `%${authorName}%`)
        }
      })
      .orderBy('id', 'desc')
      .paginate(page, perPage)

    const books = await query

    return response.ok(books)
  }

  private getBook(book: Book, token: string) {
    return {
      book: {
        title: book.title,
        authorName: book.authorName,
        userId: book.userId
      },
    }
  }
}
