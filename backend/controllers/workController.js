import asyncHandler from "express-async-handler";
import Work from "../models/workModel.js";
import Location from "../models/locationModel.js";
import WorkerWork from "../models/workerWorkModel.js";
import mongoose from "mongoose";
import LiveWorker from "../models/liveWorkerModel.js";

// @desc post work
// @route POST /api/work/post
// @access private
const postWork = asyncHandler(async (req, res) => {
  // Extracting necessary data from the request body
  const { workTitle, workDescription, workType, pincode, expirationDate } =
    req.body;

  const io = req.io;
  // Extracting images from req.files using a loop (up to 4 images)
  const images = [];
  for (let i = 1; i <= 4; i++) {
    const key = `workImage${i}`;
    images.push(req.files[key] ? req.files[key][0].path : undefined);
  }
  // Finding locations with matching pincode and workType
  const work = await Work.create({
    customer: req.customer._id,
    workTitle,
    workDescription,
    workType,
    pincode,
    expirationDate,
    images,
  });

  const locationWithWorkers = await Location.find({ pincode, workType });

  // Function to insert work to the workers accordingly
  const insertWork = async (workerId, workId) => {
    // Logic to add work to WorkerWork model based on location
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

    const activeWorker = await LiveWorker.findOne({ worker: workerId });
    if (activeWorker) {
      io.to(activeWorker.socketId).emit(
        "worker_notification_fetch_works",
        `New Work has been Added: ${workTitle}`
      );
    }
  };
  // Storing works in workers based on locations
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

  // Sending response based on success or failure
  if (work && result) {
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
  // Logic to get the number of unread works for a worker
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
  // Logic to retrieve works for a worker with pagination and filtering
  const searchQuery = req.query.query || "";

  const page = req.query.page || 1;

  const pageSize = 3;

  const showExpired = req.query.showExpired === "true" || false;

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
    {
      $lookup: {
        from: "customers",
        localField: "work.customer",
        foreignField: "_id",
        as: "customer",
      },
    },
  ];

  if (searchQuery) {
    pipeline.push({
      $match: { "work.workTitle": { $regex: searchQuery, $options: "i" } },
    });
  }

  if (!showExpired) {
    pipeline.push({
      $match: {
        "work.expirationDate": { $gte: new Date(new Date().toISOString()) },
      },
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
        expirationDate: "$data.work.expirationDate",
        work: "$data.work",
        customer: "$data.customer.name",
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
  // Logic to mark specific works as read for a worker
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
