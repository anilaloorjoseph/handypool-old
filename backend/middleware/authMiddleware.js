import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";
import Worker from "../models/workerModel.js";
import generateToken from "../utils/generateToken.js";

export const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

      if (req.headers.authorization.startsWith("BearerCustomer")) {
        let customer = await Customer.findById(decoded.id).select("-password");

        if (customer) {
          req.customer = customer;
          return next();
        }
      }
      if (req.headers.authorization.startsWith("BearerWorker")) {
        let worker = await Worker.findById(decoded.id).select("-password");

        if (worker) {
          req.worker = worker;
          return next();
        }
      }
    } catch (error) {
      res.status(401);
      throw new Error(error?.message);
    }
  } else {
    res.end();
    // res.status(401);
    // throw new Error("Token is necessary!");
  }
});

export const verifyRefreshToken = asyncHandler(async (req, res) => {
  let refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    let token = refreshToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    try {
      if (refreshToken.startsWith("BearerCustomer") && decoded) {
        res.json({
          accessToken: generateToken.accessToken(decoded.id, false),
        });
      }
      if (refreshToken.startsWith("BearerWorker") && decoded) {
        res.json({
          accessToken: generateToken.accessToken(decoded.id, true),
        });
      }
    } catch (error) {
      res.status(401);
      throw new Error(error?.message);
    }
  }

  if (!refreshToken) {
    res.end();
  }
});
