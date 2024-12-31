import { NextFunction, Request, Response } from "express";
import { findBoard } from "../boardsController/utils";
import prisma from "../../prisma/prismaClient";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boardId } = req.body;

    const tasks = await prisma.task.findMany({ where: { boardId } });

    res.status(201).json({ success: true, data: { ...tasks } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boardId, content } = req.body;
    const { id: userId } = req.user;

    await findBoard(+userId, +boardId, res);

    if (!content) {
      res.status(404).json({ success: false, msg: "Content can't be empty" });
    }

    const newTask = await prisma.task.create({ data: { content, boardId } });

    res.status(201).json({ success: true, data: { ...newTask } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};
