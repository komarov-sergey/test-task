import {AppDataSource} from '../data-source'
import {DatabaseError} from '../error'
import {Task} from './task.entity'

export const TaskRepository = AppDataSource.getRepository(Task)

export class TaskController {
  public static async createTask(task) {
    try {
      const newTask = await TaskRepository.save({...task})
      return Promise.resolve(newTask)
    } catch (e) {
      return Promise.reject(new DatabaseError(e).toString())
    }
  }

  public static async getAllTasks() {
    try {
      return Promise.resolve(await TaskRepository.findAndCount())
    } catch (e) {
      return Promise.reject(new DatabaseError(e).toString())
    }
  }

  public static async updateTask(id, taskRequest) {
    try {
      let task = await TaskRepository.findOneBy({id})
      if (!task) {
        return Promise.reject('No task for update found')
      }

      if (!task.updated) {
        taskRequest.updated = task.body === taskRequest.body ? false : true
      }

      const updatedTask = await TaskRepository.save({
        ...task,
        ...taskRequest,
      })
      return Promise.resolve(updatedTask)
    } catch (e) {
      return Promise.reject(new DatabaseError(e).toString())
    }
  }

  public static async deleteTask(id) {
    try {
      return Promise.resolve(await TaskRepository.delete({id}))
    } catch (e) {
      return Promise.reject(new DatabaseError(e).toString())
    }
  }
}
