import { createFriend, incrementUnreadCount, isChatFriend, updateFriendLastMessage } from "../models/chat.js";
import { sendMessage } from "../models/messages.js";
import { generateChatId, generateTimeUUID, getCurrentUTCTimestamp, getSocketsFromId, refetchQueryEventEmit } from "../utils/index.js";

export const sendMessageController = async ({ recipients = [], message = "", user_id = "", attachment = "" }) => {
  for (let index = 0; index < recipients.length; index++) {
    const recipientId = recipients[index];
    const sockets = getSocketsFromId({ id: recipientId });
    const chatId = generateChatId({ receiverId: user_id, senderId: recipientId });
    const isFriend = await isChatFriend({ user_id, friend_id: recipientId, chatId });
    const sent_time = getCurrentUTCTimestamp();
    const timeUUID = generateTimeUUID();
    if (!isFriend) {
      const isSuccess = await createFriend({ chatId, friend_id: recipientId, user_id, last_message: message, sent_time });
      if (isSuccess) {
        for (let index = 0; index < sockets.length; index++) {
          const socket = sockets[index];
          refetchQueryEventEmit({ socket, queryKey: ["chatListing"], type: "api" });
        }
      } else {
        throw new Error("Unable to create friend");
      }
    }
    const isSendMessageSuccess = await sendMessage({ user_id, receiverId: recipientId, sent_time, message, timeUUID, attachment });
    if (isSendMessageSuccess) {
      if (isFriend) {
        const isSuccess = await updateFriendLastMessage({ chatId, friend_id: recipientId, user_id, last_message: message, sent_time });
        if (!isSuccess) {
          console.log("Unable to update last message", e?.message);
        }
      }
      for (let index = 0; index < sockets.length; index++) {
        const socket = sockets[index];
        refetchQueryEventEmit({ socket, queryKey: ["messageListing"], type: "socket" });
      }
    } else {
      return false;
    }
    return true;
  }
};
