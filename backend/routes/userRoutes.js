import express from "express";
import {
  changeAvatar,
  createShortUrlUser,
  createUser,
  deleteUser,
  deleteUserUrl,
  editUserName,
  editUserPassword,
  getAllUsers,
  getUserById,
  getUserStats,
} from "../controllers/userController.js";
import { authenticateToken, authLimiter, publicLimiter } from "../middlewares/auth.js";

const router = express.Router();

//region Authenticaied

router.delete("/users", authenticateToken, authLimiter, deleteUser);

router.put("/username", authenticateToken, authLimiter, editUserName);

router.put("/users/userpassword", authenticateToken, authLimiter, editUserPassword);

router.post("/user", authenticateToken, authLimiter, getUserById);

router.post("/users/shorten", authenticateToken, authLimiter, createShortUrlUser);

router.post("/users/stats", authenticateToken, authLimiter ,getUserStats);

router.delete("/users/delete-url", authenticateToken, authLimiter, deleteUserUrl);

router.put("/users/avatar", authenticateToken, authLimiter, changeAvatar);

//region Unauthenticaied
router.post("/users", publicLimiter, createUser);

router.get("/users",publicLimiter, getAllUsers);

export default router;
