import { NextFunction, Response, Request } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma/prismaClient";
import { generateToken } from "../../utils/jwtUtils";

const TOKEN_MAX_LIFE = 24 * 60 * 60 * 1000;

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
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

    // Create default user boards
    const defaultBoards = ["To do", "Doing", "Done"];

    await Promise.all(
      defaultBoards.map(async (title) => {
        await prisma.board.create({
          data: { userId: newUser.id, name: title },
        });
      })
    );

    const data = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };

    const accessToken = generateToken(data);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: TOKEN_MAX_LIFE,
      sameSite: "strict",
    });

    res.status(201).json({ success: true, userData: { ...data } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const siginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.query;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        msg: "please provide a valid email or password",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email as string },
    });

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(
      password as string,
      user?.password
    );

    if (!isPasswordValid) {
      return res.status(404).json({ success: false, msg: "Invalid password" });
    }

    const data = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateToken(data);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: TOKEN_MAX_LIFE,
      sameSite: "strict",
    });

    res.status(201).json({ success: true, userData: { ...data } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};
