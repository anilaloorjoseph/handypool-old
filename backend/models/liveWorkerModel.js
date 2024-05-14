import mongoose from "mongoose";

const LiveWorkerSchema = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Worker",
    },
    socketId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const LiveWorker = mongoose.model("LiveWorker", LiveWorkerSchema);

export default LiveWorker;
