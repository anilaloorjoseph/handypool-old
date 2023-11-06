import asyncHandler from "express-async-handler";
import Work from "../models/workModel.js";
import CustomersWork from "../models/customersWorkModel.js";
import Location from "../models/locationModel.js";
import WorkerWork from "../models/workerWorkModel.js";
import mongoose from "mongoose";

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

  // insert work to the workers accordingly
  const insertWork = async (workerId, workId) => {
    let workerWork = await WorkerWork.findOne({ worker: workerId });

    if (!workerWork) {
      await WorkerWork.create({
        worker: workerId,
        works: [{ work: workId, isRead: false }],
      });
    } else {
      workerWork.works.push({ work: workId, isRead: false });

      await workerWork.save();
    }
  };

  const storeWorksInWorkers = Promise.all(
    locationWithWorkers.map(async (locationWithWorker, key) => {
      try {
        await insertWork(locationWithWorker.worker, work._id);
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

// @desc get new works for worker
// @route api/work/getnewworks
// @access private
const getNoOfNewWorks = asyncHandler(async (req, res) => {
  const worker = await WorkerWork.findOne({
    worker: req.worker._id,
  });

  let count = 0;

  if (worker) {
    count = worker.works.reduce((acc, work) => {
      return acc + (work.isRead === false ? 1 : 0);
    }, 0);
  }

  res.status(200).json(count);
});

// @desc get works for worker
// @route api/work/getworks
// @access private
const getWorks = asyncHandler(async (req, res) => {
  const searchQuery = req.query.query || "";

  const page = req.query.page || 1;

  const pageSize = 3;

  const pipeline = [
    { $match: { worker: new mongoose.Types.ObjectId(req.worker._id) } },
    { $unwind: "$works" },
    {
      $lookup: {
        from: "works",
        localField: "works.work",
        foreignField: "_id",
        as: "work",
      },
    },
  ];

  if (searchQuery != "null") {
    pipeline.push({
      $match: { "work.workTitle": { $regex: searchQuery, $options: "i" } },
    });
  }

  pipeline.push(
    {
      $group: {
        _id: null,
        worksLength: { $sum: 1 },
        data: { $push: "$$ROOT" },
      },
    },
    { $unwind: "$data" },
    {
      $project: {
        _id: "$data.works._id",
        worksLength: 1,
        isRead: "$data.works.isRead",
        createdAt: "$data.work.createdAt",
        work: "$data.work",
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: pageSize * (page - 1) },
    { $limit: pageSize }
  );

  const works = await WorkerWork.aggregate(pipeline);

  const count = works[0]?.worksLength;

  if (works) {
    res.status(200).json({ works, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404);
    throw new Error("Data haven't been found!");
  }
});

// @desc change status of read works
// @route api/work/makeworksread
// @access private
const makeWorksRead = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (ids) {
    const data = await WorkerWork.findOne({ worker: req.worker._id });

    data.works.forEach((value, key) => {
      if (ids.includes(value._id.toString())) {
        value.isRead = true;
      }
    });

    await data.save();

    res.status(201).json({ message: "Data has beeb updated!" });
  } else {
    res.status(404);
    throw new Error("Not found!");
  }
});

export { postWork, getNoOfNewWorks, getWorks, makeWorksRead };
