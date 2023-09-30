import express from "express";
import {
  authWorker,
  logoutWorker,
  registerWorker,
  updateWorkerProfile,
  getWorkerProfile,
  deleteWorkerProfile,
} from "../controllers/workerController.js";
import upload from "./uploadRoutes.js";

const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";

router.post("/register", registerWorker);
router.post("/login", authWorker);
router.post("/logout", logoutWorker);

router
  .route("/profile")
  .get(protect, getWorkerProfile)
  .put(
    protect,
    upload.fields([{ name: "workerImage", maxCount: 1 }]),
    updateWorkerProfile
  )
  .delete(protect, deleteWorkerProfile);

export default router;
