import expressAsyncHandler from "express-async-handler";
import { getUserData, getUserListing } from "../models/user.js";

export const userListingController = expressAsyncHandler(async (req, res) => {
  const listing = await getUserListing();
  res.status(200).json({ success: true, data: listing, message: "User listing fetched successfully" });
});
export const userDetailsController = expressAsyncHandler(async (req, res) => {
  const userData = await getUserData({ user_id: req.user.user_id });
  const { password = "", ...response } = userData;
  res.status(200).json({ success: true, data: response, message: "User data fetched successfully" });
});
