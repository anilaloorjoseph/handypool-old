import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    customerImage: {
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
      required:false
    },
    isWorker: {
      type: Boolean,
      required: true,
      default: false,
    },
    location: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
