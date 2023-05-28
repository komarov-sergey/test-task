import Router from 'koa-router'
import {Joi, bodySchema} from 'koa-body-validator'

import {UserController} from './user.repository'
import {handleResponsePromise} from '../helpers'

export default new Router()
  .post(
    '/',
    bodySchema({
      user: {
        email: Joi.string().required(),
        password: Joi.string().required(),
        username: Joi.string().required(),
      },
    }),
    registerUser
  )
  .post(
    '/login',
    bodySchema({
      user: {
        password: Joi.string().required(),
        username: Joi.string().required(),
      },
    }),
    login
  )
  .post('/logout', logout)

export async function registerUser(ctx) {
  ctx.validate()

  const {
    request: {
      body: {user},
    },
  } = ctx

  await handleResponsePromise(UserController.registerUser(user), ctx)
}

export async function login(ctx) {
  ctx.validate()

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
