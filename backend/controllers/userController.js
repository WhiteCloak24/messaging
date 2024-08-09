import expressAsyncHandler from "express-async-handler";
import formidable from "formidable";
import { getUserData, getUserListing, updateUserData } from "../models/user.js";
import fs from "fs";
import { S3Service } from "../services/aws-service/index.js";

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
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      throw new Error("Unable to parse file");
    }
    let profile_pic = fields?.profile_pic?.[0] || "";
    let profileFile = files?.profile_pic?.[0] || "";
    const aws = new S3Service();
    if (profileFile) {
      // s3 logic
      // Read the file into a buffer
      const fileContent = fs.readFileSync(profileFile.filepath);
      const response = await aws.putFile({
        file: fileContent,
        type: profileFile?.mimetype,
        filename: `${req.user.user_id}/profile/${profileFile?.newFilename}`,
      });
      if (response) {
        profile_pic = profileFile?.newFilename;
      }
    }
    if (!profileFile && !profile_pic) {
       await aws.deleteFile({ filename: `${req.user.user_id}/profile` });
    }

    const first_name = fields.first_name?.[0] || "";
    const last_name = fields.last_name?.[0] || "";

    const isSuccess = await updateUserData({ user_id: req.user.user_id, first_name, last_name, profile_pic, email: req.user.email, res });
    if (isSuccess) {
      res.status(200).json({ success: true, message: "User data updated successfully" });
    }
  });
});
