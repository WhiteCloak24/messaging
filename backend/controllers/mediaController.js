import expressAsyncHandler from "express-async-handler";
import { S3Service } from "../services/aws-service/index.js";

export const getUrlController = expressAsyncHandler(async (req, res) => {
  const s3 = new S3Service();
  const url = await s3.getResourceSignedUrl({ filename: `${req.query.user_id}/${req.query?.type}/${req.query?.name}` });
  res.status(200).json({ success: true, data: { url, name: req.query?.name }, message: "Chats fetched successfully" });
});
