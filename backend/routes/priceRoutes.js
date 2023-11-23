import express from "express";
import { sendPrice } from "../controllers/priceController.js";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";

router.post("/send", protect, sendPrice);

export default router;
