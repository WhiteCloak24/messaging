import { client } from "../config/database.js";
import { getUserData } from "./user.js";

export const getChats = async ({ user_id = "" }) => {
  const query = `SELECT * FROM user_friends WHERE user_id = ? ALLOW FILTERING;`;
  const resp = await client.execute(query, [user_id]);
  return resp.rows || [];
};
export const checkFriend = async ({ user_id = "", friend_id = "" }) => {
  const query = `SELECT * FROM user_friends WHERE user_id = ? AND friend_id = ? ALLOW FILTERING;`;
  const resp = await client.execute(query, [user_id, friend_id]);
  return resp.rows?.[0] || [];
};
export const createFriend = async ({ user_id = "", friend_id = "", last_message = "", sent_time = "" }) => {
  const res = await getUserData({ user_id: friend_id });
  const query = `INSERT INTO user_friends (user_id, friend_last_message_time, friend_id, friend_image, friend_name, last_message, unread_count) VALUES ( ?, ?, ?, ?, ?, ?, ? );`;
  const resp = await client.execute(query, [user_id, sent_time, friend_id, "", res?.user_name, last_message, "1"]);
  return resp.rows?.[0] || [];
};
