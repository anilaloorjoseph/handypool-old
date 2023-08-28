import express from "express";
import { getWorkTypes } from "../controllers/autoloadController.js";

const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";

router.get("/worktypes", getWorkTypes);

export default router;
