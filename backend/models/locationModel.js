import mongoose from "mongoose";

const locationScheam = mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
    },
    workType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "WorkType",
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Worker",
    },
    country: {
      type: String,
      required: true,
      default: "India",
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationScheam);

export default Location;
