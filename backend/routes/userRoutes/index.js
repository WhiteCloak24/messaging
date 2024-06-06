import express from "express";
import { userListingController } from "../../controllers/userController.js";

const router = express.Router();

router.get("/listing", userListingController);

export default router;
