import express from "express";
import {
  logoutController,
  siginController,
  signupController,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signupController);

router.get("/signin", siginController);

router.post("/logout", logoutController);

export default router;
