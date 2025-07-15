import express from "express";
import { createUser, deleteUser, editUser, getAllUsers, createShortUrlUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/users", createUser);

router.delete("/users", deleteUser);

router.put("/users", editUser);

router.get("/users", getAllUsers);

router.get("/users/shorten", createShortUrlUser)

export default router;
