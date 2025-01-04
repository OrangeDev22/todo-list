import express from "express";
import { deleteUser, getUser } from "../controllers/userController";
const router = express.Router();

router.get("/", getUser);
router.delete("/", deleteUser);

export default router;
