import express from "express";
import { loginUser, forgotEmail, updateForgotPassword } from "../controllers/loginController.js";
const router = express.Router();

// Login user
router.post("/login", loginUser);

router.post("/forgot-email", forgotEmail);

router.post("/forgot-password", updateForgotPassword);

export default router;
