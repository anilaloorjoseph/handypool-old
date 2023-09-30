import asyncHandler from "express-async-handler";
import Worker from "../models/workerModel.js";
import generateToken from "../utils/generateToken.js";
import Location from "../models/locationModel.js";
import fs from "fs";

// @desc Auth worker/set token
// @route POST /api/worker/login
// @access Public
const authWorker = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const worker = await Worker.findOne({ email });

  if (worker && (await worker.matchPassword(password))) {
    generateToken.refreshToken(res, worker._id, worker.isWorker);

    res.status(201).json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      locations: worker.locations,
      workerImage: worker.workerImage,
      isWorker: worker.isWorker,
      workType: worker.workType,
      aboutMe: worker.aboutMe,
      accessToken: generateToken.accessToken(worker._id, worker.isWorker),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email id or password");
  }
});

// @desc Register a new worker
// @route POST /api/worker/register
// @access Public
const registerWorker = asyncHandler(async (req, res) => {
  const { name, email, password, workType } = req.body;
  const workerExists = await Worker.findOne({ email });

  if (workerExists) {
    res.status(400);
    throw new Error("Worker already exists");
  }

  const worker = await Worker.create({ name, email, password, workType });

  if (worker) {
    generateToken.refreshToken(res, worker._id, worker.isWorker);
    res.status(201).json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      locations: worker.locations,
      workerImage: worker.workerImage,
      isWorker: worker.isWorker,
      workType: worker.workType,
      aboutMe: worker.aboutMe,
      accessToken: generateToken.accessToken(worker._id, worker.isWorker),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Get worker profile
// @route GET /api/worker/profile
// @access Private
const getWorkerProfile = asyncHandler(async (req, res) => {
  // req.worker is already set from authentication protect method using token
  const workerProfile = {
    _id: req.worker._id,
    name: req.worker.name,
    email: req.worker.email,
    phone: req.worker.phone,
    locations: req.worker.locations,
    workerImage: req.worker.workerImage,
    isWorker: req.worker.isWorker,
    workType: req.worker.workType,
    aboutMe: req.worker.aboutMe,
  };
  res.status(200).json(workerProfile);
});

// @desc Update worker
// @route PUT /api/worker/profile
// @access Private
const updateWorkerProfile = asyncHandler(async (req, res) => {
  const { name, email, locations, phone, password, aboutMe } = req.body;

  const worker = await Worker.findById(req.worker._id);

  if (worker.email != email) {
    const emailExists = await Worker.findOne({ email });

    if (emailExists) {
      res.status(406);
      throw new Error("Email already in use!");
    }
  }

  const parsedLocations = JSON.parse(locations);

  if (worker) {
    const compareLocations = (a, b) =>
      a.length === b.length && a.every((e, i) => e === b[i]);

    if (!compareLocations(worker.locations, parsedLocations)) {
      const { deletedCount } = await Location.deleteMany({
        worker: req.worker._id,
        workType: req.worker.workType,
      });

      if (parsedLocations.length > 0) {
        const docsToInsert = parsedLocations.map((pincode) => ({
          pincode,
          workType: req.worker.workType,
          worker: req.worker._id,
        }));
        const insertNewLocations = await Location.insertMany(docsToInsert);

        if (!insertNewLocations) {
          res.status(406);
          throw new Error("Something went wrong with updating locations!");
        }
      }
    }

    worker.name = name || worker.name;
    worker.email = email || worker.email;
    worker.locations = parsedLocations;
    worker.phone = phone || worker.phone;
    worker.aboutMe = aboutMe || worker.aboutMe;

    if (password.trim() !== "") {
      worker.password = password;
    }

    if (req.files["workerImage"]) {
      if (worker.workerImage) {
        fs.unlinkSync(worker.workerImage);
      }
      worker.workerImage = req.files["workerImage"][0].path;
    }

    const updatedWorker = await worker.save();

    if (updatedWorker) {
      res.status(200).json({
        _id: updatedWorker._id,
        name: updatedWorker.name,
        email: updatedWorker.email,
        locations: updatedWorker.locations,
        phone: updatedWorker.phone,
        workType: updatedWorker.workType,
        aboutMe: updatedWorker.aboutMe,
        workerImage: updatedWorker.workerImage,
        isWorker: updatedWorker.isWorker,
      });
    } else {
      res.status(406);
      throw new Error("Data is not valid!");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Logout worker
// @route POST /api/worker/logout
// @access Public
const logoutWorker = asyncHandler(async (req, res) => {
  res
    .clearCookie("refreshToken", "", { httpOnly: true, sameSite: "Strict" })
    .end();
});

// @desc Delete worker
// @route DELETE /api/worker/profile
// @access Private
const deleteWorkerProfile = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const worker = await Worker.findById(req.worker._id);

  if (worker && (await worker.matchPassword(password))) {
    if (worker.workerImage) fs.unlinkSync(worker.workerImage);

    await Worker.deleteOne({ _id: req.worker._id });

    res
      .clearCookie("refreshToken", "", { httpOnly: true, sameSite: "Strict" })
      .json({ status: "Account has been deleted!" });
  } else {
    res.status(404);
    throw new Error("Warning : Wrong password!");
  }
});

export {
  authWorker,
  registerWorker,
  logoutWorker,
  getWorkerProfile,
  updateWorkerProfile,
  deleteWorkerProfile,
};
