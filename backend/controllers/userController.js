import expressAsyncHandler from "express-async-handler";
import {  getUserListing } from "../models/user.js";

export const userListingController = expressAsyncHandler(async (req, res) => {
  const listing = await getUserListing();
  res.status(200).json({ success: true, data: listing, message: "User listing fetched successfully" });
});
