import express from "express";
import {
  authCustomer,
  logoutCustomer,
  registerCustomer,
  updateCustomerProfile,
  getCustomerProfile,
  deleteCustomerProfile,
} from "../controllers/customerController.js";
import upload from "./uploadRoutes.js";

const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";

router.post("/register", registerCustomer);
router.post("/login", authCustomer);
router.post("/logout", logoutCustomer);
router
  .route("/profile")
  .get(protect, getCustomerProfile)
  .put(
    protect,
    upload.fields([{ name: "customerImage", maxCount: 1 }]),
    updateCustomerProfile
  )
  .delete(protect, deleteCustomerProfile);

export default router;
