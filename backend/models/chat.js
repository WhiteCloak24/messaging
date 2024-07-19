import { client } from "../config/database.js";
import { getUserData } from "./user.js";

export const getChats = async ({ user_id = "" }) => {
  const query = `SELECT friend_id as user_id, friend_last_message_time, friend_image as user_image, friend_name as user_name, last_message, unread FROM user_friends WHERE user_id = ? ALLOW FILTERING;`;
  const resp = await client.execute(query, [user_id]);
  return resp.rows || [];
};
export const isChatFriend = async ({ user_id = "", friend_id = "", chatId = "" }) => {
  try {
    const query = `SELECT * FROM user_friends WHERE user_id = ? AND friend_id = ? AND uuid = ? ALLOW FILTERING;`;
    const res = await client.execute(query, [user_id, friend_id, chatId]);
    return res?.rows?.length > 0 || false;
  } catch (err) {
    return false;
  }
};
export const createFriend = async ({ user_id = "", friend_id = "", last_message = "", sent_time = "", chatId }) => {
  const friendData = await getUserData({ user_id: friend_id });
  const userData = await getUserData({ user_id });
  const query = `BEGIN BATCH INSERT INTO user_friends (uuid, user_id, friend_last_message_time, friend_id, friend_image, friend_name, last_message, unread) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? );
   INSERT INTO user_friends (uuid, user_id, friend_last_message_time, friend_id, friend_image, friend_name, last_message, unread) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? );
    APPLY BATCH;`;
  try {
    await client.execute(
      query,
      [
        chatId,
        user_id,
        sent_time,
        friend_id,
        "",
        friendData?.user_name,
        last_message,
        1,
        chatId,
        friend_id,
        sent_time,
        user_id,
        "",
        userData?.user_name,
        last_message,
        1,
      ],
      { prepare: true }
    );
    return true;
  } catch (e) {
    console.log(e?.message);
    return false;
  }
};
export const updateFriendLastMessage = async ({ chatId, user_id = "", friend_id = "", last_message = "", sent_time = "" }) => {
  const queries = [
    {
      query: "UPDATE user_friends SET last_message = ?, friend_last_message_time = ? WHERE user_id = ? AND friend_id = ? AND uuid = ?",
      params: [last_message, sent_time, user_id, friend_id, chatId],
    },
    {
      query: "UPDATE user_friends SET last_message = ?, friend_last_message_time = ? WHERE user_id = ? AND friend_id = ? AND uuid = ?",
      params: [last_message, sent_time, friend_id, user_id, chatId],
    },
  ];

  try {
    await client.batch(queries, { prepare: true });
    return true;
  } catch (e) {
    console.log(e?.message);
    return false;
  }
};

export const incrementUnreadCount = async ({ user_id = "", friend_id = "" }) => {
  const chatData = await getChatData({ friend_id, user_id });
  const query = `UPDATE user_friends SET unread = ? WHERE user_id = ? AND friend_last_message_time = ? `;
  const resp = await client.execute(query, [chatData?.unread + 1 || 0, user_id, chatData?.friend_last_message_time], { prepare: true });
  return resp || {};
};
export const clearUnreadCount = async ({ user_id = "", friend_id = "" }) => {
  const chatData = await getChatData({ friend_id, user_id });
  if (chatData && Object.keys(chatData).length) {
    const query = `UPDATE user_friends SET unread = ? WHERE user_id = ? AND friend_last_message_time = ? `;
    const resp = await client.execute(query, [0, user_id, chatData?.friend_last_message_time], { prepare: true });
    return resp || {};
  }
  return true;
};

export const getChatData = async ({ user_id = "", friend_id = "" }) => {
  const query = `SELECT * FROM user_friends WHERE user_id = ? AND friend_id = ? ALLOW FILTERING`;
  const resp = await client.execute(query, [user_id, friend_id], { prepare: true });
  return resp?.rows?.[0] || {};
};
