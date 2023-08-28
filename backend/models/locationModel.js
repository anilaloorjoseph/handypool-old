import mongoose from "mongoose";

const locationScheam = mongoose.Schema({
  location: {
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
  },
  country: {
    type: String,
    required: true,
    default: "India",
  },
});

const Location = mongoose.model("Location", locationScheam);

export default Location;
