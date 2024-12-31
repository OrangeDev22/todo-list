import { Response } from "express";
import prisma from "../../prisma/prismaClient";

export const findBoard = async (userId: number, id: number, res: Response) => {
  const board = await prisma.board.findUnique({
    where: { id: id, AND: { userId } },
  });

  if (!board) {
    return res.status(404).json({ success: false, msg: "Board doesn't exits" });
  }

  return board;
};
