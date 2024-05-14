import mongoose from "mongoose";

const workWithReadAttribute = mongoose.Schema({
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
});

const workerWorkSchema = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Worker",
    },
    works: [workWithReadAttribute],
  },
  { timestamps: true }
);

const WorkerWork = mongoose.model("WorkerWork", workerWorkSchema);

export default WorkerWork;
