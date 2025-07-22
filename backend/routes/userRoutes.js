import express from "express";
import {
  createUser,
  deleteUser,
  editUserName,
  getAllUsers,
  createShortUrlUser,
  getUserById,
  getUserStats,
  deleteUserUrl,
  changeAvatar,
  editUserPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/users", createUser);

router.delete("/users", deleteUser);

router.put("/username", editUserName);

router.put("/userpassword", editUserPassword);

router.get("/users", getAllUsers);

router.post("/user", getUserById);

router.post("/users/shorten", createShortUrlUser);

router.post("/users/stats", getUserStats);

router.delete("/users/delete-url", deleteUserUrl);

router.put("/users/avatar", changeAvatar);

export default router;
