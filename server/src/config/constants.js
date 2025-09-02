import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "http://localhost:3000";

let dbFile = "./database.sqlite"; // default dev
if (process.env.NODE_ENV === "test") {
  dbFile = "./database.test.sqlite";
} else if (process.env.NODE_ENV === "production") {
  dbFile = "./database.prod.sqlite";
}

export const DATABASE_URL = `sqlite:${dbFile}`;
