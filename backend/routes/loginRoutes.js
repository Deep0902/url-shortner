import express from "express";
import {
  loginUser,
  forgotEmail,
  updateForgotPassword,
  logout,
} from "../controllers/loginController.js";
const router = express.Router();

// Login user
router.post("/login", loginUser);

router.post("/logout", logout);

router.post("/forgot-email", forgotEmail);

router.post("/forgot-password", updateForgotPassword);

export default router;
