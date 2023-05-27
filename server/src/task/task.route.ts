import Router from "koa-router";
import { handleResponsePromise } from "../helpers";
import { TaskController } from "./task.repository";
import auth from "../middleware/auth";

export default new Router()
  .post("/", createTask)
  .get("/", getAllTasks)
  .put("/:id", auth, updateTask)
  .delete("/:id", auth, deleteTask);

export async function createTask(ctx) {
  const {
    request: {
      body: { task },
    },
  } = ctx;

  await handleResponsePromise(TaskController.createTask(task), ctx);
}

export async function getAllTasks(ctx) {
  await handleResponsePromise(TaskController.getAllTasks(), ctx);
}

export async function updateTask(ctx) {
  const {
    params: { id },
    request: {
      body: { task },
    },
  } = ctx;

  await handleResponsePromise(TaskController.updateTask(id, task), ctx);
}

export async function deleteTask(ctx) {
  const {
    params: { id },
  } = ctx;

  await handleResponsePromise(TaskController.deleteTask(id), ctx);
}
