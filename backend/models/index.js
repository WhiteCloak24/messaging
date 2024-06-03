import { client } from "../config/database.js";

export const checkEmailExist = async ({ email = "" }) => {
  if (email) {
    const resp = await client.execute(`SELECT * FROM users WHERE email = '${email}' ALLOW FILTERING;`);
    return resp.rows || null;
  } else {
    return null;
  }
};

export const createSessionQuery = async ({ user_id = "", created_at = "", session_id = "", token = "" }) => {
  if (user_id && created_at && session_id && token) {
    const query = `INSERT INTO sessions (user_id, created_at, session_id, token_id) VALUES ( ?,?,?,?);`;
    const params = [user_id, created_at, session_id, token];
    const resp = await client.execute(query, params);
    return resp || null;
  } else {
    return null;
  }
};
export const getSessionQuery = async ({ user_id = "", session_id = "" }) => {
  if (user_id && session_id) {
    const query = `SELECT * FROM admin.sessions WHERE user_id = ${user_id} AND session_id = '${session_id}' ALLOW FILTERING`;
    const resp = await client.execute(query);
    return resp || null;
  } else {
    return null;
  }
};
