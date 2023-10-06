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

Route.group(() => {
  Route.post('register', 'AuthController.register').as('auth.register');
  Route.post('login', 'AuthController.login').as('auth.login');
  Route.get('logout', 'AuthController.logout');
  Route.get('me', 'AuthController.user').middleware('auth');
}).prefix('api/auth');

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'UsersController.index');
    Route.get('/:id/conversations', 'UsersController.conversations');
  }).prefix('users')
}).middleware('auth').prefix('api');
