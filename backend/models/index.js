import { client } from "../config/database.js";



export const getSessionQuery = async ({ user_id = "", session_id = "" }) => {
  if (user_id && session_id) {
    const query = `SELECT * FROM admin.sessions WHERE user_id = ${user_id} AND session_id = '${session_id}' ALLOW FILTERING`;
    const resp = await client.execute(query);
    return resp || null;
  } else {
    return null;
  }
};
