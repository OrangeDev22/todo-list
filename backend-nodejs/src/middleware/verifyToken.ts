import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.access_token as string;

  if (!token) {
    res.status(403).json({ msg: "No token provided" });
    return;
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ msg: "Invalid or expired access token" });
      return;
    }

    req.user = decoded;
    next();
  });
};

export default verifyTokenMiddleware;
