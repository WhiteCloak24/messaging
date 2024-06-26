import { client } from "../config/database.js";
import { getUserData } from "./user.js";

export const getChats = async ({ user_id = "" }) => {
  const query = `SELECT friend_id as user_id, friend_last_message_time, friend_image as user_image, friend_name as user_name, last_message, unread FROM user_friends WHERE user_id = ? ALLOW FILTERING;`;
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
  const res2 = await getUserData({ user_id });
  const query = `INSERT INTO user_friends (user_id, friend_last_message_time, friend_id, friend_image, friend_name, last_message, unread) VALUES ( ?, ?, ?, ?, ?, ?, ? );`;
  await client.execute(query, [user_id, sent_time, friend_id, "", res2?.user_name, last_message, 0], { prepare: true });
  const query2 = `INSERT INTO user_friends (user_id, friend_last_message_time, friend_id, friend_image, friend_name, last_message, unread) VALUES ( ?, ?, ?, ?, ?, ?, ? );`;
  await client.execute(query2, [friend_id, sent_time, user_id, "", res?.user_name, last_message, 1], { prepare: true });
  return true;
};

export const updateUnreadCount = async ({ user_id = "", friend_id = "" }) => {
  const chatData = await getChatData({ friend_id, user_id });
  const query = `UPDATE user_friends SET unread = ? WHERE user_id = ? AND friend_last_message_time = ? `;
  const resp = await client.execute(query, [chatData?.unread + 1 || 0, user_id, chatData?.friend_last_message_time], { prepare: true });
  return resp || {};
};

export const getChatData = async ({ user_id = "", friend_id = "" }) => {
  const query = `SELECT * FROM user_friends WHERE user_id = ? AND friend_id = ? ALLOW FILTERING`;
  const resp = await client.execute(query, [user_id, friend_id], { prepare: true });
  return resp?.rows?.[0] || {};
};
