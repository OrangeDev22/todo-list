import express from "express";

import {
  createBoard,
  deleteBoard,
  getBoards,
  patchBoard,
} from "../controllers/boardsController";

const router = express.Router();

router.get("/", getBoards);

router.post("/", createBoard);

router.delete("/:id", deleteBoard);

router.patch("/:id", patchBoard);

export default router;
