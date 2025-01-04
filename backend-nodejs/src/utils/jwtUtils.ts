import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const generateToken = (payload: string | Buffer | object) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "30s",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
