import { client } from "../resources/database.js";

export const filterUserByEmailQuery = async ({ email = "" }) => {
  if (email) {
    const resp = await client.execute(`SELECT * FROM test.users WHERE email = '${email}' ALLOW FILTERING;`);
    return resp.rows || null;
  } else {
    return null;
  }
};
