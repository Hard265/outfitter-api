import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { Product } from "./models/Product";
import { User } from "./models/User";
import { Cart, CartItem } from "./models/Cart";
import { Order, OrderItem } from "./models/Order";
import { Category } from "./models/Category";
import { Review } from "./models/Review";

import dotenv from "dotenv";
import { SqliteDialect } from "@sequelize/sqlite3";
dotenv.config();

const sequelize =
    process.env.ENV === "development"
        ? new Sequelize({
              dialect: SqliteDialect,
              storage: "databease.sqlite3",
              models: [
                  Product,
                  User,
                  Cart,
                  CartItem /*   Category*/,
                  Review,
                  Order,
                  OrderItem,
              ],
          })
        : new Sequelize({
              dialect: PostgresDialect,
              database: process.env.DB_NAME,
              user: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              url: process.env.DB_URL,
              clientMinMessages: "notice",
              ssl: true,
              // port: 5432,
              models: [
                  Product,
                  User,
                  Cart,
                  CartItem,
                  Review,
                  Order,
                  OrderItem /*Category*/,
              ],
          });

export default sequelize;
