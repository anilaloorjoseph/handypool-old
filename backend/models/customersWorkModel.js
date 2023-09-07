import mongoose, { mongo } from "mongoose";

const customersWorkSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Worker",
    },
    works: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Work",
      },
    ],
  },
  { timestamps: true }
);

const CustomersWork = mongoose.model("CustomersWork", customersWorkSchema);

export default CustomersWork;
