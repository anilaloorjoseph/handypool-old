import jwt from "jsonwebtoken";

const generateToken = {
  refreshToken: (res, userId, isWorker) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "30d",
    });

    res.cookie(
      "refreshToken",
      isWorker ? `BearerWorker ${token}` : `BearerCustomer ${token}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }
    );
  },

  accessToken: (userId, isWorker) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_ACCESS, {
      expiresIn: "600s",
    });

    return isWorker ? `BearerWorker ${token}` : `BearerCustomer ${token}`;
  },
};

export default generateToken;
