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
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'BlogsController.index').as('home')

Route.group(() => {
  Route.get('create', 'BlogsController.create').as('create')

  Route.post('create', 'BlogsController.store').as('store')

  Route.get(':id', 'BlogsController.show').as('show')

  Route.post(':id', 'BlogsController.update').as('update')

  Route.delete(':id/destroy', 'BlogsController.destroy').as('destroy')

}).middleware('auth').prefix('articles').as('posts')

Route.group(() => {
  Route.get('login', 'LoginController.index').as('auth.index')

  Route.post('login', 'LoginController.store').as('auth.store')

  Route.get('register', 'RegistersController.index').as('register.index')

  Route.post('register', 'RegistersController.store').as('register.store')
}).middleware(['guest'])

Route.group(() => {
  Route.get('/', 'ConctactsController.index').as('index')

  Route.post('store', 'ConctactsController.store').as('store')
}).as('contact').prefix('contact')

Route.post('logout', 'LoginController.logout').as('auth.logout').middleware('auth')
