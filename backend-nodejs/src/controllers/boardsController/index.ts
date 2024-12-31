import { Request, Response } from "express";

export const getBoards = (req: Request, res: Response) => {
  res.status(200).json({ msg: "heeey" });
};
