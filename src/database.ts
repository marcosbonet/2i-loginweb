import { Sequelize } from "sequelize";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../2i/2i-loginweb/2i.db",
});

export default sequelize;
