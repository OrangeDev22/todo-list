import express from "express";
import {
  siginController,
  signupController,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signupController);

router.post("/signin", siginController);

export default router;
