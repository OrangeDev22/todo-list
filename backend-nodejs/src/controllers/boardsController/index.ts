import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prismaClient";
import { findBoard } from "./utils";
import { Board } from "@prisma/client";

export const getBoards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user;
    const { include_tasks } = req.query;

    const includeTasks = include_tasks === "true";

    const boards = await prisma.board.findMany({
      where: { userId },
      orderBy: { order: "asc" },
      include: { tasks: includeTasks ? { orderBy: { order: "asc" } } : false },
    });

    res.status(201).json({
      success: true,
      boards: boards.map(({ id, name, tasks, order }) => ({
        id,
        name,
        tasks,
        order,
      })),
    });
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
    const { name, order } = req.body;
    const { id: userId } = req.user;

    if (!name)
      return res
        .status(404)
        .json({ success: false, msg: "Name can't be empty" });

    const newBoard = await prisma.board.create({
      data: { name, userId, order },
      include: { tasks: true },
    });

    res.status(201).json({ success: true, record: newBoard });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    if (!id) {
      return res
        .status(404)
        .json({ success: false, msg: "Error: please provide a board id" });
    }

    const boardExists = await findBoard(userId, +id, res);

    if (!boardExists) {
      return res.status(404).json({
        success: false,
        msg: `can't find board by id ${id}`,
      });
    }

    const deleteBoard = await prisma.board.delete({
      where: { id: parseInt(id) },
    });

    res.status(201).json({ success: true, deleteBoard });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const patchBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { id: userId } = req.user;

    if (!id) {
      return res
        .status(404)
        .json({ success: false, msg: "Error: please provide a board id" });
    }

    const boardExists = await findBoard(userId, +id, res);

    if (!boardExists) {
      return res.status(404).json({
        success: false,
        msg: `can't find board by id ${id}`,
      });
    }

    if (!name)
      return res
        .status(404)
        .json({ success: false, msg: "Name can't be empty" });

    const newBoard = await prisma.board.update({
      where: { id: parseInt(id), AND: { userId } },
      data: { name },
    });

    res.status(201).json({ success: true, newBoard });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};

export const updateBoards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { boards } = req.body;

    const updates = boards.map((board: Board) => {
      return prisma.board.update({
        where: { id: board.id },
        data: { ...board },
      });
    });

    const updatedBoards = await Promise.all(updates);

    res.status(201).json({ success: true, record: { ...updatedBoards } });
  } catch (error) {
    console.error("--error", error);
    next(new Error());
  }
};
