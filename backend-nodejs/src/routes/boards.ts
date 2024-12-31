import express from "express";
import { verifyToken } from "../utils/jwtUtils";
import verifyTokenMiddleware from "../middleware/verifyToken";
import {
  createBoard,
  deleteBoard,
  getBoards,
} from "../controllers/boardsController";
const router = express.Router();

router.get("/", getBoards);

router.post("/", createBoard);

router.delete("/:id", deleteBoard);

export default router;
