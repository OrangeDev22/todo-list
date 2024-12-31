import express from "express";
import { verifyToken } from "../utils/jwtUtils";
import verifyTokenMiddleware from "../middleware/verifyToken";
import { createBoard, getBoards } from "../controllers/boardsController";
const router = express.Router();

router.get("/", verifyTokenMiddleware, getBoards);

router.post("/", verifyTokenMiddleware, createBoard);

export default router;
