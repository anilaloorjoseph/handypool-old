import express from "express";
import { postWork, getNewWorks } from "../controllers/workController.js";

import upload from "./uploadRoutes.js";

const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";

router.post(
  "/post",
  protect,
  upload.fields([
    { name: "workImage1", maxCount: 1 },
    { name: "workImage2", maxCount: 1 },
    { name: "workImage3", maxCount: 1 },
    { name: "workImage4", maxCount: 1 },
  ]),
  postWork
);

router.get("/getnewworks", protect, getNewWorks);

export default router;
