import asyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";
import generateToken from "../utils/generateToken.js";
import fs from "fs";

// @desc Auth customer/set token
// @route POST /api/customer/login
// @access Public
const authCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const customer = await Customer.findOne({ email });

  if (customer && (await customer.matchPassword(password))) {
    generateToken.refreshToken(res, customer._id, customer.isWorker);
    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      location: customer.location,
      customerImage: customer.customerImage,
      isWorker: customer.isWorker,
      accessToken: generateToken.accessToken(customer._id, customer.isWorker),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email id or password");
  }
});

// @desc Register a new customer
// @route POST /api/customer/register
// @access Public
const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const customerExists = await Customer.findOne({ email });

  if (customerExists) {
    res.status(400);
    throw new Error("Customer already exists");
  }

  const customer = await Customer.create({ name, email, password });

  if (customer) {
    generateToken.refreshToken(res, customer._id, customer.isWorker);
    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      location: customer.location,
      customerImage: customer.customerImage,
      isWorker: customer.isWorker,
      accessToken: generateToken.accessToken(customer._id, customer.isWorker),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Logout customer
// @route POST /api/customer/logout
// @access Public
const logoutCustomer = asyncHandler(async (req, res) => {
  res
    .clearCookie("refreshToken", "", { httpOnly: true, sameSite: "Strict" })
    .end();
});

// @desc Get customer profile
// @route GET /api/customer/profile
// @access Private
const getCustomerProfile = asyncHandler(async (req, res) => {
  // req.customer is already set from authentication protect method using token
  const customerProfile = {
    _id: req.customer._id,
    name: req.customer.name,
    email: req.customer.email,
    phone: req.customer.phone,
    customerImage: req.customer.customerImage,
    isWorker: req.customer.isWorker,
    location: req.customer.location,
  };
  res.status(200).json(customerProfile);
});

// @desc Update customer profile
// @route POST /api/customer/profile
// @access Private
const updateCustomerProfile = asyncHandler(async (req, res) => {
  const { name, email, location, phone, password } = req.body;

  const customer = await Customer.findById(req.customer._id);

  if (customer.email != email) {
    const emailExists = await Customer.findOne({ email });

    if (emailExists) {
      res.status(406);
      throw new Error("Email already in use");
    }
  }

  if (customer) {
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.location = location || customer.location;
    customer.phone = phone || customer.phone;

    if (password.trim() !== "") {
      customer.password = password;
    }

    if (req.files["customerImage"]) {
      if (customer.customerImage) {
        fs.unlinkSync(customer.customerImage);
      }
      customer.customerImage = req.files["customerImage"][0].path;
    }

    const updatedCustomer = await customer.save();

    if (updatedCustomer) {
      res.status(200).json({
        _id: updatedCustomer._id,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        customerImage: updatedCustomer.customerImage,
        isWorker: updatedCustomer.isWorker,
        location: updatedCustomer.location,
        phone: updatedCustomer.phone,
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

// @desc Delete customer
// @route DELETE /api/customer/profile
// @access Private
const deleteCustomerProfile = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const customer = await Customer.findById(req.customer._id);

  if (customer && (await customer.matchPassword(password))) {
    if (customer.workerImage) fs.unlinkSync(customer.workerImage);

    await Customer.deleteOne({ _id: req.customer._id });

    res
      .clearCookie("refreshToken", "", { httpOnly: true, sameSite: "Strict" })
      .json({ status: "Account has been deleted!" });
  } else {
    res.status(404);
    throw new Error("Warning : Wrong password!");
  }
});

export {
  authCustomer,
  registerCustomer,
  logoutCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
};
