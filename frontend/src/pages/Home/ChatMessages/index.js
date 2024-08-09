import React, { useEffect, useState } from "react";
import { useApplicationSocket } from "../../../hooks/useApplicationSocket";
import { formatTime, getAttachmentType, getProcessedResource } from "../../../resources/functions";
import { IoCheckmarkOutline, IoTrashBin } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useMediaResources } from "../../../hooks/useMediaResources";
import { useMutation } from "@tanstack/react-query";
import { getResourceUrl } from "../../../api-service";

const MessageStatusIconMap = {
  Sent: <IoCheckmarkOutline className="w-full h-full" />,
  Delivered: <IoCheckmarkDoneOutline className="w-full h-full" />,
};
const ChatMessages = ({ activeChat = {} }) => {
  const { fetchMessageListing, messageListing, user_id, setActiveChat, deleteMessage } = useApplicationSocket();
  useEffect(() => {
    fetchMessageListing({ recipientId: activeChat?.user_id });
    setActiveChat({ recipientId: activeChat?.user_id });
  }, [activeChat?.user_id]);

  return (
    <div className="flex-1 p-4 overflow-y-scroll flex flex-col">
      {messageListing.map((msg) => {
        const isSent = user_id === msg?.sender_id;

        return (
          <div
            key={msg?.message_id}
            className={`relative mb-4 w-fit h-fit px-4 py-2 flex gap-4 max-w-[60%] rounded-md ${
              isSent ? "self-end bg-blue-600 text-white mr-4" : "self-start bg-white"
            }`}>
            {msg?.message_text && <div className="flex self-start whitespace-pre-wrap break-all">{msg?.message_text}</div>}
            {msg?.attachment && (
              <div className="flex self-start whitespace-pre-wrap break-all">
                <AttachmentPreviewer fileName={msg?.attachment} chat_id={msg?.chat_id} />
              </div>
            )}
            <div className={`text-xs ${isSent ? "text-gray-100" : "text-gray-500"} flex self-end min-w-16`}>
              {formatTime({ timestamp: msg?.sent_time })}&nbsp; <span className="w-4 h-4 text-green-200"></span>
            </div>
            <div className="absolute right-[-20px] text-black">
              <span
                className="cursor-pointer"
                onClick={() => deleteMessage({ messageId: msg?.message_id, receiverId: isSent ? msg?.recipient_id : user_id })}>
                <IoTrashBin />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ChatMessages;

const AttachmentPreviewer = ({ fileName = "", chat_id = "" }) => {
  const [attachmentType, setAttachmentType] = useState("");
  const { resources, setResources } = useMediaResources();

  const { mutate: getResourceUrlMutate } = useMutation({
    mutationKey: ["getResourceUrl"],
    mutationFn: getResourceUrl,
    onSuccess: async ({ data }) => {
      const { blob } = await getProcessedResource(data?.data?.url);
      const url = URL.createObjectURL(blob);
      setResources({ [data?.data?.name || "unknown"]: url });
    },
  });

  useEffect(() => {
    if (fileName) {
      const type = getAttachmentType({ fileName });
      setAttachmentType(type);
      getResourceUrlMutate({ type: "chat", name: fileName, chat_id });
    }
  }, [fileName]);

  return <>{attachmentType == "image" && <img src={resources[fileName]} alt="" />}</>;
};
