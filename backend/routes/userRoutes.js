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
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/users", createUser);

router.delete("/users", authenticateToken, deleteUser);

router.put("/username", authenticateToken, editUserName);

router.put("/users/userpassword", authenticateToken, editUserPassword);

router.get("/users", getAllUsers);

router.post("/user", authenticateToken, getUserById);

router.post("/users/shorten", authenticateToken, createShortUrlUser);

router.post("/users/stats", authenticateToken, getUserStats);

router.delete("/users/delete-url", authenticateToken, deleteUserUrl);

router.put("/users/avatar", authenticateToken, changeAvatar);

export default router;
