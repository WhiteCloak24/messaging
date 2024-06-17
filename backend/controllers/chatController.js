import expressAsyncHandler from "express-async-handler";
import { getChats } from "../models/chat.js";

export const chatListingController = expressAsyncHandler(async (req, res) => {
  const listing = await getChats({ user_id: req?.user?.user_id });
  res.status(200).json({ success: true, data: listing, message: "Chats fetched successfully" });
});
