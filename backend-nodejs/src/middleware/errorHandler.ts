import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({ msg: err.message || "Server Error" });
};

export default errorHandler;
