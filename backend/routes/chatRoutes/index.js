import express from "express";
import { chatListingController } from "../../controllers/chatController.js";

const router = express.Router();
router.get("/listing", chatListingController);
export default router;
