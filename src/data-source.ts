import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/Users";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./2i.db",
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
