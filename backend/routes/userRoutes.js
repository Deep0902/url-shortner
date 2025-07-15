import express from "express";
import { createUser, deleteUser, editUser, getAllUsers, createShortUrlUser, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.post("/users", createUser);

router.delete("/users", deleteUser);

router.put("/users", editUser);

router.get("/users", getAllUsers);

router.post("/user", getUserById);

router.post("/users/shorten", createShortUrlUser);

export default router;
