import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const reviewSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
  },
  { timestamps: true }
);

const workerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    workerImage: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: false,
    },
    isWorker: {
      type: Boolean,
      required: true,
      default: true,
    },
    workType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "WorkType",
    },
    aboutMe: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: false,
      default: 0,
    },
    locations: {
      type: [Number],
      required: false,
    },

    reviews: [reviewSchema],
  },
  { timestamps: true }
);

workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

workerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
