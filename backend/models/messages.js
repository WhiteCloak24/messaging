import { client } from "../config/database.js";
import { generateChatId, generateTimeUUID } from "../utils/index.js";
import cassandra from "cassandra-driver";

export const sendMessage = async ({ user_id = "", receiverId, message = "", sent_time, timeUUID, attachment = "" }) => {
  try {
    const query = `INSERT INTO messages (chat_id, message_id, is_read, message_text, recipient_id, sender_id, sent_time, attachment) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);`;
    const chat_id = generateChatId({ senderId: user_id, receiverId });
    await client.execute(query, [chat_id, timeUUID, false, message, receiverId, user_id, sent_time, attachment], { prepare: true });
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
export const getMessageListing = async ({ user_id = "", recipientId = "" }) => {
  try {
    const chat_id = generateChatId({ senderId: user_id, receiverId: recipientId });
    const query = `SELECT * from messages WHERE chat_id = ? ALLOW FILTERING;`;
    const resp = await client.execute(query, [chat_id], { prepare: true });
    return resp?.rows || [];
  } catch (e) {
    return [];
  }
};
export const getMessageData = async ({ user_id = "", recipientId = "", messageId = "" }) => {
  try {
    const chat_id = generateChatId({ senderId: user_id, receiverId: recipientId });
    const query = `SELECT * from messages WHERE chat_id = ? AND message_id = ? ALLOW FILTERING;`;
    const resp = await client.execute(query, [chat_id, messageId], { prepare: true });
    return resp?.rows?.[0] || null;
  } catch (e) {
    return null;
  }
};
export const deleteMessage = async ({ user_id = "", recipientId = "", messageId = "" }) => {
  try {
    const chat_id = generateChatId({ senderId: user_id, receiverId: recipientId });
    const query = `DELETE FROM messages WHERE message_id=${cassandra.types.TimeUuid.fromString(messageId)} AND chat_id='${chat_id}';`;
    const res = await client.execute(query, { prepare: true });
    // const query = `DELETE message_text from messages WHERE message_id = ? AND chat_id = ?  IF EXISTS;`;
    // const res = await client.execute(query, [cassandra.types.TimeUuid.fromString(messageId), `${chat_id}`], { prepare: true });
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
