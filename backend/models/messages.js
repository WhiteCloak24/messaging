import { client } from "../config/database.js";
import { generateChatId } from "../utils/index.js";

export const sendMessage = async ({ user_id = "", receiverId, message = "", sent_time, timeUUID }) => {
  const query = `INSERT INTO messages (chat_id, message_id, is_read, message_text, recipient_id, sender_id, sent_time) VALUES ( ?, ?, ?, ?, ?, ?, ? );`;
  const chat_id = generateChatId({ senderId: user_id, receiverId });
  const resp = await client.execute(query, [chat_id, timeUUID, false, message, receiverId, user_id, sent_time]);
  return resp || {};
};
