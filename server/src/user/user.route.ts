import Router from 'koa-router'

import {UserController} from './user.repository'
import {handleResponsePromise} from '../helpers'

export default new Router()
  .post('/', registerUser)
  .post('/login', login)
  .post('/logout', logout)

export async function registerUser(ctx) {
  const {
    request: {
      body: {user},
    },
  } = ctx

  await handleResponsePromise(UserController.registerUser(user), ctx)
}

export async function login(ctx) {
  const {
    request: {
      body: {user},
    },
  } = ctx

  await handleResponsePromise(UserController.loginUser(user), ctx)
}

export async function logout(ctx) {
  const {
    request: {
      body: {user},
    },
  } = ctx

  await handleResponsePromise(UserController.logoutUser(user), ctx)
}
