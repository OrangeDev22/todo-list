import express from "express";
import { deleteUser } from "../controllers/userController";
const router = express.Router();

router.delete("/", deleteUser);

export default router;
