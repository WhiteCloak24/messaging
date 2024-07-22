import { client } from "../config/database.js";
import { generateChatId } from "../utils/index.js";

export const sendMessage = async ({ user_id = "", receiverId, message = "", sent_time, timeUUID, attachment = "" }) => {
  try {
    const query = `INSERT INTO messages (chat_id, message_id, is_read, message_text, recipient_id, sender_id, sent_time, attachment) VALUES ( ?, ?, ?, ?, ?, ?, ? );`;
    const chat_id = generateChatId({ senderId: user_id, receiverId });
    await client.execute(query, [chat_id, timeUUID, false, message, receiverId, user_id, sent_time, attachment], { prepare: true });
    return true;
  } catch (e) {
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
