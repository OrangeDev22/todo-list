import { NextFunction, Response, Request } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma/prismaClient";
import { generateToken } from "../../utils/jwtUtils";

export const signupController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser?.email === email) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already in use" });
    }

    if (existingUser?.username === username) {
      return res
        .status(400)
        .json({ success: false, msg: "Username already in use" });
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

    res
      .status(201)
      .json({ success: true, data: { ...data, token: accessToken } });
  } catch (error) {
    console.error("--error", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const siginController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    console.log("--is valid password", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(404).json({ success: false, msg: "Invalid password" });
    }

    const data = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateToken(data);

    res
      .status(201)
      .json({ success: true, data: { ...data, token: accessToken } });
  } catch (error) {
    console.error("--error", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};