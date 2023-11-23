import asyncHandler from "express-async-handler";
import WorkType from "../models/workTypeModel.js";

// @desc load work types
// @route GET /api/autoload/worktypes
// @access Public
const getWorkTypes = asyncHandler(async (req, res) => {
  // Fetch all available work types from the database
  const workTypes = await WorkType.find({}).select("_id type");

  // Check if work types are found and respond accordingly
  if (workTypes) {
    res.status(200).json(workTypes);
  } else {
    res.status(400);
    throw new Error("No work types are available currently!");
  }
});

export { getWorkTypes };
