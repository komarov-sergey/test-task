import jwt from "jsonwebtoken";

import { AppDataSource } from "../data-source";
import { User } from "./user.entity";
import { DatabaseError } from "../error";

export const UserRepository = AppDataSource.getRepository(User);

export class UserController {
  private static generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);

    exp.setDate(today.getDate() + 60); // 60 days

    user.token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: parseInt((exp.getTime() / 1000).toString()),
      },
      "secret"
    );

    return user;
  }

  public static async registerUser(user) {
    try {
      const newUser = await UserRepository.save({
        ...user,
      });
      return Promise.resolve(newUser);
    } catch (e) {
      return Promise.reject(new DatabaseError(e).toString());
    }
  }

  public static async loginUser({ username, password }) {
    try {
      let user = await UserRepository.findOneBy({ username });
      if (!user || user.password !== password) {
        return Promise.reject("Not valid email or password");
      }

      this.generateJWT(user);
      user.isSessionOpen = true;
      await UserRepository.save({
        ...user,
      });

      delete user.password;

      return Promise.resolve(user);
    } catch (e) {
      return Promise.reject(new DatabaseError(e).toString());
    }
  }

  public static async logoutUser({ id }) {
    try {
      let user = await UserRepository.findOneBy({ id });
      if (!user) {
        return Promise.reject("User not found");
      }

      user.isSessionOpen = false;

      const updatedUser = await UserRepository.save({
        ...user,
      });

      return Promise.resolve(updatedUser);
    } catch (e) {
      return Promise.reject(new DatabaseError(e).toString());
    }
  }
}
