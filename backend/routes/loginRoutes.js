import express from "express";
import {
  loginUser,
  forgotEmail,
  updateForgotPassword,
  logout,
} from "../controllers/loginController.js";
import { publicLimiter } from "../middlewares/auth.js";
const router = express.Router();

// Login user
router.post("/login", publicLimiter, loginUser);

router.post("/logout", publicLimiter, logout);

router.post("/forgot-email", publicLimiter, forgotEmail);

router.post("/forgot-password", publicLimiter, updateForgotPassword);

export default router;
