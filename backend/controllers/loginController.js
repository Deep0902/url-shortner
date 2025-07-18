import User from "../models/users.model.js";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

// Add your secret key here (should be the same as in frontend)
const SECRET_KEY = process.env.API_SECRET_KEY; // Use API_SECRET_KEY from .env

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

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};
//region Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password: encryptedPassword } = req.body; // password is encrypted from frontend

    if (!email || !encryptedPassword) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Decrypt the password received from frontend
    const decryptedPassword = decryptData(encryptedPassword);

    if (!decryptedPassword) {
      return res.status(400).json({ error: "Invalid password format" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedPassword = decryptData(user.password);

    if (storedPassword !== decryptedPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//region Forgot - Email
export const forgotEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: true });
  } catch (error) {
    console.error("Error in receiving email", error);
    res.status(500).json({ error: "Ineternal server error" });
  }
};

//region Forgot - Password
export const updateForgotPassword = async (req, res) => {
  try {
    const { email, encryptedPassword } = req.body;
    if (!email || !encryptedPassword) {
      return res.status(400).json({ error: "Email or password missing" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const decryptedPassword = decryptData(encryptedPassword);

    if (!decryptedPassword) {
      return res.status(400).json({ error: "Invalid password format" });
    }

    // Update user details
    user.password = encryptData(decryptedPassword); // Store encrypted password
    await user.save();
    return res.status(200).json({ message: "Password updated successfully", userId: user._id });
  } catch (error) {
    console.error("Error in updating password", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
