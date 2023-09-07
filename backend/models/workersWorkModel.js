import mongoose, { mongo } from "mongoose";

const workersWorkSchema = mongoose.Schema(
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
        read: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const WorkersWork = mongoose.model("WorkersWork", workersWorkSchema);

export default WorkersWork;
