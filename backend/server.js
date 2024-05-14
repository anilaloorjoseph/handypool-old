import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const port = process.env.PORT || 5000;
import { verifyRefreshToken } from "./middleware/authMiddleware.js";
import path from "path";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
// routes
import customerRoutes from "./routes/customerRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import autoloadRoutes from "./routes/autoloadRoutes.js";
import workRoutes from "./routes/workRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
//models
import LiveWorker from "./models/liveWorkerModel.js";
import LiveCustomer from "./models/liveCustomerModel.js";


connectDB();

const app = express();
app.use(cors());
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "http://www.handypool.in"
        : `http://localhost:5173`,
  },
});

// socket io notifications
io.on("connection", (socket) => {
  socket.on("customer_connected", async (customerId) => {
    const checkLiveCustomer = await LiveCustomer.findOne({
      customer: customerId,
    });
    if (!checkLiveCustomer) {
      await LiveCustomer.create({
        customer: customerId,
        socketId: socket.id,
      });
    }
  });

  socket.on("disconnect_customer", async () => {
    await LiveCustomer.findOneAndDelete({
      socketId: socket.id,
    });
  });

  socket.on("worker_connected", async (workerId) => {
    const checkLiveWorker = await LiveWorker.findOne({ worker: workerId });
    if (!checkLiveWorker) {
      await LiveWorker.create({
        worker: workerId,
        socketId: socket.id,
      });
    }
  });

  socket.on("disconnect_worker", async () => {
    await LiveWorker.findOneAndDelete({
      socketId: socket.id,
    });
  });

  socket.on("disconnect", async () => {
    await LiveCustomer.findOneAndDelete({
      socketId: socket.id,
    });
    await LiveWorker.findOneAndDelete({
      socketId: socket.id,
    });
  });
});

// Middleware to inject io into the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// @desc provide access key
// @route GET /api/user/getaccesskey
// @access private
app.use("/api/getaccesskey", verifyRefreshToken);

app.use("/api/customer", customerRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/autoload", autoloadRoutes);
app.use("/api/work", workRoutes);
app.use("/api/price", priceRoutes);

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

server.listen(port, () => console.log(`Server started on ${port}`));
