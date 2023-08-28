import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const port = process.env.PORT || 5000;
import customerRoutes from "./routes/customerRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import autoloadRoutes from "./routes/autoloadRoutes.js";
import { verifyRefreshToken } from "./middleware/authMiddleware.js";
import asyncHandler from "express-async-handler";
import path from "path";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// @desc provide access key
// @route GET /api/user/getaccesskey
// @access private
app.use(
  "/api/getaccesskey",
  verifyRefreshToken,
  asyncHandler(async (req, res) => {
    res.end();
  })
);

app.use("/api/customer", customerRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/autoload", autoloadRoutes);

app.get("/", (req, res) => res.send("Server is ready"));

// Location static folder for image upload
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on ${port}`));
