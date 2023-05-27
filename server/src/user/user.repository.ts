import crypto from "crypto";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../data-source";
import { User } from "./user.entity";
import { DatabaseError } from "../error";

export const UserRepository = AppDataSource.getRepository(User);

export class UserController {
  private static generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);

    // 60 days
    exp.setDate(today.getDate() + 60);

    user.token = jwt.sign(
      {
        id: user.id,
        username: user.username,
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

      return Promise.resolve(user);
    } catch (e) {
      return Promise.reject(new DatabaseError(e).toString());
    }
  }
}
