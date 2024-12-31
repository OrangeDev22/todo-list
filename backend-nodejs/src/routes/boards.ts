import express from "express";
import { verifyToken } from "../utils/jwtUtils";
import verifyTokenMiddleware from "../middleware/verifyToken";
import { getBoards } from "../controllers/boardsController";
const router = express.Router();

router.get("/", verifyTokenMiddleware, getBoards);

export default router;
