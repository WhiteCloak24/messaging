import express from "express";
import { userDetailsController, userListingController } from "../../controllers/userController.js";

const router = express.Router();

router.get("/listing", userListingController);
router.get("/details", userDetailsController);

export default router;
