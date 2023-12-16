import asyncHandler from "express-async-handler";
import Work from "../models/workModel.js";

// @desc send price to the customer work
// @route POST /api/price/send
// @access Private
const sendPrice = asyncHandler(async (req, res) => {
  const { price, workId } = req.body;

  console.log(price, workId);

  const work = await Work.findById(workId);

  if (work) {
    console.log(work.responses.find({ worker: req.worker._id }));
  } else {
    res.status(404);
    throw new Error("Data not found!");
  }

  res.end();
});

export { sendPrice };
