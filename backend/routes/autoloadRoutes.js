import express from "express";
import { getWorkTypes } from "../controllers/autoloadController.js";

const router = express.Router();

router.get("/worktypes", getWorkTypes);

export default router;
