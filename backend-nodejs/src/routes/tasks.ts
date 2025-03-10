import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTasks,
} from "../controllers/tasksController";
const router = express.Router();

router.get("/", getTasks);

router.post("/", createTask);

router.patch("/", updateTasks);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;
