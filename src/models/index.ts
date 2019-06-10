import { Sequelize } from "sequelize-typescript";
import { User } from "./User";
import { Post } from "./Post";

export const sequelize = new Sequelize({
  database: process.env.DATABASE,
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  dialect: process.env.DATABASE_DIALECT,
  host: process.env.DATABASE_HOST
});

sequelize.addModels([User, Post]);
