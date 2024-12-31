import { Response } from "express";
import prisma from "../../prisma/prismaClient";

export const findTasks = async (boardId: number, id: number, res: Response) => {
  const task = await prisma.task.findUnique({
    where: { id: id, AND: { boardId } },
  });

  return task;
};
