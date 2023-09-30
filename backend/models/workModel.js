import mongoose from "mongoose";

const responseSchema = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Worker",
    },
    details: { type: String, required: false },
    price: { type: Number, required: true },
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const acceptedWorkerSchema = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Worker",
    },
  },
  { timestamps: true }
);

const workSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    workTitle: {
      type: String,
      required: true,
    },
    workDescription: {
      type: String,
      required: [true, "Description is required"],
      validate: {
        validator: function (v) {
          return v.length <= 1000 ? true : false;
        },
        message: (props) => "Description can contains only 1000 characters",
      },
    },
    pincode: { type: Number, required: true },
    workType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "WorkType",
    },
    images: {
      type: [String],
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    acceptedWorkers: [acceptedWorkerSchema],
    responses: [responseSchema],
  },
  { timestamps: true }
);

const Work = mongoose.model("Work", workSchema);

export default Work;
