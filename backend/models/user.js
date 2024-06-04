import { client } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUTCTimestamp } from "../utils/index.js";

export const createUser = async ({ email = "", user_name = "", password = "" }) => {
  const newUserId = uuidv4();
  const createdAt = getCurrentUTCTimestamp();
  try {
    const userQuery = "INSERT INTO users (user_id, created_at, user_name, email, password) VALUES (?, ?, ?, ?, ?) IF NOT EXISTS";
    const emailResult = await client.execute(userQuery, [newUserId, createdAt, user_name, email, password], { prepare: true });
    if (!emailResult.wasApplied()) {
      throw new Error("duplicate key error");
    }
  } catch (err) {
    if (err.message.includes("duplicate key error")) {
      throw new Error("Email already exists");
    } else {
      throw new Error("Error creating user:", err);
    }
  }
};
