import { client } from "../config/database";

export const createUser = async ({ email = "", username = "", password = "" }) => {
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
