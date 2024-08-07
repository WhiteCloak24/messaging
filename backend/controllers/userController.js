import expressAsyncHandler from "express-async-handler";
import { getUserData, getUserListing, updateUserData } from "../models/user.js";

export const userListingController = expressAsyncHandler(async (req, res) => {
  const listing = await getUserListing();
  res.status(200).json({ success: true, data: listing, message: "User listing fetched successfully" });
});
export const userDetailsController = expressAsyncHandler(async (req, res) => {
  const userData = await getUserData({ user_id: req.user.user_id });
  const { password = "", ...response } = userData;
  res.status(200).json({ success: true, data: response, message: "User data fetched successfully" });
});
export const userUpdateController = expressAsyncHandler(async (req, res) => {
  const { first_name = "", last_name = "", profile_pic = "" } = req.body || {};
  const isSuccess = await updateUserData({ user_id: req.user.user_id, first_name, last_name, profile_pic, email: req.user.email });
  if (isSuccess) {
    res.status(200).json({ success: true, message: "User data updated successfully" });
  }
});
