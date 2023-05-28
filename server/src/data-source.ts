import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./data/test",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  migrations: [],
  subscribers: [],
});
