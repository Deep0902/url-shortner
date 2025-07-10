import express from "express";
import { createUser, deleteUser, editUser, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/users", createUser);

router.delete("/users", deleteUser);

router.put("/users", editUser);

router.get("/users", getAllUsers);

export default router;
