import User from "../models/users.model.js";
import bcrypt from "bcrypt";

// region Create user
export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      urls: [],
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//region Delete user

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const searchUser = await User.findOne({
      email,
    });
    if (!searchUser) {
      return res.status(404).json({ error: "User not found" });
    } else {
      await User.deleteOne({
        email,
      });
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//region Edit user

export const editUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const searchUser = await User.findOne({ email });
    if (!searchUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    searchUser.username = username;
    searchUser.password = hashedPassword;
    await searchUser.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error editing user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// region Get users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};