import expressAsyncHandler from "express-async-handler";
import { S3Service } from "../services/aws-service/index.js";

export const getUrlController = expressAsyncHandler(async (req, res) => {
  const s3 = new S3Service();
  if (req.query?.type === "profile") {
    const url = await s3.getResourceSignedUrl({ filename: `${req.query.user_id}/${req.query?.type}/${req.query?.name}` });
    res.status(200).json({ success: true, data: { url, name: req.query?.name }, message: "Chats fetched successfully" });
  }
  if (req.query?.type === "chat") {
    const url = await s3.getResourceSignedUrl({ filename: `${req.query.chat_id}/${req.query?.name}` });
    res.status(200).json({ success: true, data: { url, name: req.query?.name }, message: "Chats fetched successfully" });
  }
  throw new Error('Unable to get resource')
});

// {
//   "chat_id": "0f8bd931-56b3-44f9-b0c5-4521cf9adc56_050ef4d6-2aac-4b58-b3c3-c6580e4e0f68",
//   "message_id": "c9134240-5636-11ef-81d6-f992eb3b6998",
//   "attachment": "",
//   "is_read": false,
//   "message_text": "Hello",
//   "recipient_id": "0f8bd931-56b3-44f9-b0c5-4521cf9adc56",
//   "sender_id": "050ef4d6-2aac-4b58-b3c3-c6580e4e0f68",
//   "sent_time": "2024-08-09T10:04:37.348Z"
// }
