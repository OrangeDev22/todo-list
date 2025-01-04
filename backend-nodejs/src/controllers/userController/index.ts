import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;

    const userExists = await prisma.user.findUnique({ where: { id } });

    if (!userExists)
      return res
        .status(400)
        .json({ success: false, msg: "Can't find the user" });

    const deletedUser = await prisma.user.delete({
      where: { id: id },
    });

    res.status(201).json({ success: true, record: { ...deletedUser } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, username: true },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, msg: "Can't find the user" });

    res.status(201).json({ success: true, record: user });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};
