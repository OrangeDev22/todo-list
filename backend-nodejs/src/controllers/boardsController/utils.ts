import { Response } from "express";
import prisma from "../../prisma/prismaClient";

export const findBoard = async (userId: number, id: number, res: Response) => {
  const board = await prisma.board.findUnique({
    where: { id: id, AND: { userId } },
  });

  return board;
};
