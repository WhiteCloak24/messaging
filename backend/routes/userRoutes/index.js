import express from "express";
import { userDetailsController, userListingController, userUpdateController } from "../../controllers/userController.js";

const router = express.Router();

router.get("/listing", userListingController);
router.get("/details", userDetailsController);
router.post("/update", userUpdateController);

export default router;
