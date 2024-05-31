import { getCurrentUTCTimestamp } from "../commons/index.js";
import { client } from "../resources/database.js";
import { v4 as uuidv4 } from "uuid";

export const checkEmailExist = async ({ email = "" }) => {
  if (email) {
    const resp = await client.execute(`SELECT * FROM users WHERE email = '${email}' ALLOW FILTERING;`);
    return resp.rows || null;
  } else {
    return null;
  }
};
export const addUserQuery = async ({ email = "", username = "" }) => {
  if (email && username) {
    const newUserId = uuidv4();
    const resp = await client.execute(
      `INSERT INTO users (user_id, created_at, username, email) VALUES ( ${newUserId}, ${getCurrentUTCTimestamp()} , '${username}' ,'${email}');`
    );
    return resp || null;
  } else {
    return null;
  }
};
