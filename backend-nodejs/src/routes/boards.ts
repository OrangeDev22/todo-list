import express from "express";

import {
  createBoard,
  deleteBoard,
  getBoards,
  patchBoard,
  updateBoards,
} from "../controllers/boardsController";

const router = express.Router();

router.get("/", getBoards);

router.post("/", createBoard);

router.delete("/:id", deleteBoard);

router.patch("/:id", patchBoard);

router.patch("/", updateBoards);

export default router;
