import mongoose from "mongoose";

const LiveCustomerSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    socketId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const LiveCustomer = mongoose.model("LiveCustomer", LiveCustomerSchema);

export default LiveCustomer;
