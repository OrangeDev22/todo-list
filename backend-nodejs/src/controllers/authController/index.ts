import { NextFunction, Response, Request } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma/prismaClient";
import { generateToken } from "../../utils/jwtUtils";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });

    const data = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };
    const accessToken = generateToken(data);

    res.status(201).json({ success: true, user: data, token: accessToken });
  } catch (error) {
    console.error("--error", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
