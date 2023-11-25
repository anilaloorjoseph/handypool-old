import asyncHandler from "express-async-handler";

// @desc send price to the customer work
// @route POST /api/price/send
// @access Private
const sendPrice = asyncHandler(async (req, res) => {
  const { price, workId } = req.body;

  console.log(price, workId);

  res.end();
});

export { sendPrice };
