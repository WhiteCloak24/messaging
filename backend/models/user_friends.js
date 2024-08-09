import { client } from "../config/database.js";

export const updateInFriendsTable = async ({ user_id, first_name, last_name, profile_pic }) => {
  try {
    const query = `SELECT * FROM user_friends WHERE friend_id = ? ALLOW FILTERING;`;
    const recordsToUpdate = (await client.execute(query, [user_id])) || [];

    const queryArray = [];
    for (let index = 0; index < recordsToUpdate?.rows.length; index++) {
      const record = recordsToUpdate?.rows[index];
      queryArray.push({
        query: "UPDATE user_friends SET friend_name = ?, friend_image = ? WHERE user_id = ? AND friend_id = ? AND uuid = ?",
        params: [`${first_name} ${last_name}`, profile_pic, record?.user_id, record?.friend_id, record?.uuid],
      });
    }
    await client.batch(queries, { prepare: true });
    return true;
  } catch (err) {
    return false;
  }
};
