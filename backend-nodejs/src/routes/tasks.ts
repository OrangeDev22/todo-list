import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
} from "../controllers/tasksController";
const router = express.Router();

router.get("/", getTasks);

router.post("/", createTask);

router.patch("/:id", updateTask);

export default router;
