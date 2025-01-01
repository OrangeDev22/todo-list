import { NextFunction, Request, Response } from "express";
import { findBoard } from "../boardsController/utils";
import prisma from "../../prisma/prismaClient";
import { findTasks } from "./utils";
import { Task } from "@prisma/client";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boardId } = req.body;

    const tasks = await prisma.task.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    });

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
): Promise<any> => {
  try {
    const { boardId, content, order } = req.body;
    const { id: userId } = req.user;

    const boardExists = await findBoard(userId, +boardId, res);

    if (!boardExists) {
      return res.status(404).json({
        success: false,
        msg: `can't find board by id ${boardId}`,
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: `Order number is required`,
      });
    }

    if (!content) {
      res.status(404).json({ success: false, msg: "Content can't be empty" });
    }

    const newTask = await prisma.task.create({
      data: { content, boardId, order },
    });

    res.status(201).json({ success: true, data: { ...newTask } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { boardId, content, newBoardId } = req.body;
    const { id } = req.params;
    const { id: userId } = req.user;

    if (!content) {
      res.status(404).json({ success: false, msg: "Content can't be empty" });
    }

    if (newBoardId) {
      const boardExists = await findBoard(userId, newBoardId, res);
      if (!boardExists)
        return res.status(404).json({
          success: false,
          msg: `can't find board by id ${newBoardId}`,
        });
    }

    const tasksExists = await findTasks(boardId, +id, res);

    if (!tasksExists)
      return res
        .status(404)
        .json({ success: false, msg: "Task doesn't exits" });

    const updatedTask = await prisma.task.update({
      where: { id: +id, AND: { boardId } },
      data: { content, boardId: newBoardId ?? boardId },
    });

    res.status(201).json({ success: true, data: { ...updatedTask } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { boardId } = req.body;
    const { id } = req.params;

    const tasksExists = await findTasks(boardId, +id, res);

    if (!tasksExists)
      return res
        .status(404)
        .json({ success: false, msg: "Task doesn't exits" });

    const deletedTask = await prisma.task.delete({
      where: { id: +id, AND: { boardId } },
    });

    res.status(201).json({ success: true, data: { ...deletedTask } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const updateTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { tasks } = req.body;

    const updates = tasks.map((task: Task) => {
      return prisma.task.update({ where: { id: task.id }, data: { ...task } });
    });
    const updatedTasks = await Promise.all(updates);
    res.status(201).json({ success: true, data: { ...updatedTasks } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};
