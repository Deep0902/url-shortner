import User from "../models/users.model.js";
import CryptoJS from "crypto-js";

// Add your secret key here (should be the same as in frontend)
const SECRET_KEY = "your-secret-key-here"; // Replace with your actual secret key

// Decryption helper function
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// Encryption helper function (for storing in database)
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

// region Create user
export const createUser = async (req, res) => {
  try {
    const { username, password: encryptedPassword, email } = req.body;
    
    if (!username || !encryptedPassword || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required" });
    }

    // Decrypt the password received from frontend
    const decryptedPassword = decryptData(encryptedPassword);
    
    if (!decryptedPassword) {
      return res.status(400).json({ error: "Invalid password format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Store the password encrypted in database
    const passwordToStore = encryptData(decryptedPassword);
    
    const newUser = new User({
      username,
      password: passwordToStore,
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
    const { email, username, password: encryptedPassword } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    const searchUser = await User.findOne({ email });
    if (!searchUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!username || !encryptedPassword) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Decrypt the password received from frontend
    const decryptedPassword = decryptData(encryptedPassword);
    
    if (!decryptedPassword) {
      return res.status(400).json({ error: "Invalid password format" });
    }

    // Update user details
    searchUser.username = username;
    searchUser.password = encryptData(decryptedPassword); // Store encrypted password
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
    
    // Remove sensitive information before sending response
    const safeUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      urls: user.urls,
      // Don't include password in response
    }));
    
    res.status(200).json(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};