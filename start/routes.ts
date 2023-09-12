/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.get('/user', 'UsersController.me').middleware('auth')
  Route.post('/users/login', 'UsersController.login')
  Route.post('/users', 'UsersController.store')
  Route.put('/user', 'UsersController.update').middleware('auth')
}).prefix('/api')

Route.group(() => {
  Route.post('/books/get', 'BookController.get').middleware('auth')
  Route.post('/books/store', 'BookController.store').middleware('auth')
  Route.put('/books/update', 'BookController.update').middleware('auth')
  Route.post('/books/addToBookmarks', 'BookController.addToBookmarks').middleware('auth')
  Route.post('/books/removeFromBookmarks', 'BookController.removeFromBookmarks').middleware('auth')
  Route.post('/books/getBookmarks', 'BookController.getBookmarks').middleware('auth')
}).prefix('/api')
