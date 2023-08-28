import mongoose from "mongoose";

const workSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    validate: {
      validator: function (v) {
        return v.length <= 1000 ? true : false;
      },
      message: (props) => "Description can contains only 1000 letters",
    },
  },
  pincode: { type: Number, required: true },
  workType: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "WorkType",
  },
  photos: {
    type: [String],
  },
  expiration: {
    type: Date,
    required: true,
  },
});

const Work = mongoose.model("Work", workSchema);

export default Work;
