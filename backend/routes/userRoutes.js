import express from "express";
import { createUser, deleteUser, editUser, getAllUsers, createShortUrlUser, getUserById, getUserStats } from "../controllers/userController.js";

const router = express.Router();

router.post("/users", createUser);

router.delete("/users", deleteUser);

router.put("/users", editUser);

router.get("/users", getAllUsers);

router.post("/user", getUserById);

router.post("/users/shorten", createShortUrlUser);

router.post("/users/stats", getUserStats);

export default router;
