import Router from 'koa-router'
import {Joi, bodySchema} from 'koa-body-validator'

import {handleResponsePromise} from '../helpers'
import {TaskController} from './task.repository'
import auth from '../middleware/auth'

export default new Router()
  .post(
    '/',
    bodySchema({
      task: {
        email: Joi.string().email().required(),
        body: Joi.string().required(),
        username: Joi.string().required(),
        status: Joi.boolean(),
      },
    }),
    createTask
  )
  .get('/', getAllTasks)
  .put(
    '/:id',
    bodySchema({
      task: {
        email: Joi.string(),
        body: Joi.string(),
        username: Joi.string(),
        status: Joi.boolean(),
      },
    }),
    auth,
    updateTask
  )
  .delete('/:id', auth, deleteTask)

export async function createTask(ctx) {
  ctx.validate()

  const {
    request: {
      body: {task},
    },
  } = ctx

  await handleResponsePromise(TaskController.createTask(task), ctx)
}

export async function getAllTasks(ctx) {
  await handleResponsePromise(TaskController.getAllTasks(), ctx)
}

export async function updateTask(ctx) {
  ctx.validate()

  const {
    params: {id},
    request: {
      body: {task},
    },
  } = ctx

  await handleResponsePromise(TaskController.updateTask(id, task), ctx)
}

export async function deleteTask(ctx) {
  const {
    params: {id},
  } = ctx

  await handleResponsePromise(TaskController.deleteTask(id), ctx)
}
