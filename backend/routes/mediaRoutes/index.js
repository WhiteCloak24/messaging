import express from "express";
import { getUrlController } from "../../controllers/mediaController.js";

const router = express.Router();
router.get("/get-url", getUrlController);
export default router;
