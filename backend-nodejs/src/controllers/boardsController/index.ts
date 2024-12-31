import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

export const getBoards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user;

    const boards = await prisma.board.findMany({ where: { userId } });

    res.status(201).json({ success: true, boards });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const createBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name } = req.body;
    const { id: userId } = req.user;

    if (!name)
      return res
        .status(404)
        .json({ success: false, msg: "Name can't be empty" });

    const newBoard = await prisma.board.create({ data: { name, userId } });

    res.status(201).json({ success: true, newBoard });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};
