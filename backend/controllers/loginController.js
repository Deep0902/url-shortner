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
