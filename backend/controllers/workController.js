import asyncHandler from "express-async-handler";
import Work from "../models/workModel.js";
import CustomersWork from "../models/customersWorkModel.js";
import Location from "../models/locationModel.js";
import WorkersWork from "../models/workersWorkModel.js";

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

  const customerWork = await CustomersWork.create({
    customer: req.customer._id,
    works: work._id,
  });

  const locationWithWorkers = await Location.find({ pincode, workType });

  const insertWork = async (workerId, customerWorkId) => {
    let workerWork = await WorkersWork.findOne({ worker: workerId });

    if (!workerWork) {
      await WorkersWork.create({
        worker: workerId,
        works: [{ work: customerWorkId, isRead: false }],
      });
    } else {
      workerWork.works.push({ work: customerWorkId, isRead: false });

      await workerWork.save();
    }
  };

  const storeWorksInWorkers = Promise.all(
    locationWithWorkers.map(async (locationWithWorker, key) => {
      try {
        await insertWork(locationWithWorker.worker, customerWork._id);
      } catch (error) {
        res.status(500);
        throw new Error(error);
      }
    })
  );

  const result = await storeWorksInWorkers;

  // send notifications to workers

  if (work && customerWork && result) {
    res.status(201).json({ message: "Work has been posted!" });
  } else {
    res.status(400);
    throw new Error("Something went wrong ! please try later");
  }
});

export { postWork };
