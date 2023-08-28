import mongoose from "mongoose";

const workTypeSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkType = mongoose.model("WorkType", workTypeSchema);

export default WorkType;
