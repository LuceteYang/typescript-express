import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { User } from "./User";
import { Post } from "./Post";

const dbConfig: SequelizeOptions = {
  database: process.env.DATABASE,
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  dialect: 'mysql',
  host: process.env.DATABASE_HOST
};
export const sequelize = new Sequelize(dbConfig);

sequelize.addModels([User, Post]);
