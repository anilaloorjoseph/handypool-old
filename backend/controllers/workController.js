import asyncHandler from "express-async-handler";
import Work from "../models/workModel.js";
import CustomersWork from "../models/customersWorkModel.js";
import Location from "../models/locationModel.js";

// @desc post work
// @route POST /api/work/post
// @access private
const postWork = asyncHandler(async (req, res) => {
  const { workTitle, workDescription, workType, pincode, expirationDate } =
    req.body;

  // Extract images from req.files using a loop
  const images = [];
  for (let i = 1; i <= 4; i++) {
    const key = `workImage${i}`;
    images.push(req.files[key] ? req.files[key][0].path : undefined);
  }

  const work = await Work.create({
    customer: req.customer._id,
    workTitle,
    workDescription,
    workType,
    pincode,
    expirationDate,
    images,
  });

  const customersWork = await CustomersWork.create({
    customer: req.customer._id,
    works: work._id,
  });

  const locationsWithWorkers = await Location.find({ pincode, workType });

  console.log(locationsWithWorkers);

  if (work && customersWork) {
    res.status(201).json({ message: "Work has been posted!" });
  } else {
    res.status(400);
    throw new Error("Something went wrong ! please try later");
  }
});

export { postWork };
