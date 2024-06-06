import { client } from "../config/database.js";

export const getSessions = async ({ user_id = "", session_id = "" }) => {
  const query = `SELECT * FROM sessions WHERE session_id = ? AND user_id = ? ALLOW FILTERING;`;
  const resp = await client.execute(query, [session_id, user_id]);
  return resp.rows || null;
};
