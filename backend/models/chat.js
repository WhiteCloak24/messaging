import { client } from "../config/database.js";

export const getChats = async ({ user_id = "" }) => {
  const query = `SELECT friends FROM users WHERE user_id = ? ALLOW FILTERING;`;
  const resp = await client.execute(query, [user_id]);
  return resp.rows?.[0]?.friends || [];
};
