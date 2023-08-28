import asyncHandler from "express-async-handler";
import WorkType from "../models/workTypeModel.js";

// @desc load work types
// @route GET /api/autoload/worktypes
// @access Public
const getWorkTypes = asyncHandler(async (req, res) => {
  const workTypes = await WorkType.find({}).select("_id type");

  if (workTypes) {
    res.status(200).json(workTypes);
  } else {
    res.status(400);
    throw new Error("No work types are available currently!");
  }
});

export { getWorkTypes };
