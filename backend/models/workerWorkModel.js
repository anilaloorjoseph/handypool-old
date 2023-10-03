import mongoose from "mongoose";

const workerWorkSchema = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Worker",
    },
    works: [
      {
        work: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Work",
        },
        isRead: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const WorkerWork = mongoose.model("WorkerWork", workerWorkSchema);

export default WorkerWork;
