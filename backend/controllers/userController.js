import User from "../models/users.model.js";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
dotenv.config();

// Use API_SECRET_KEY from .env
const SECRET_KEY = process.env.API_SECRET_KEY;

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
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "UserID is required" });
    }
    const searchUser = await User.findById(userId);
    if (!searchUser) {
      return res.status(404).json({ error: "User not found" });
    }
    await User.deleteOne({
      _id: userId,
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//region Edit username
export const editUserName = async (req, res) => {
  try {
    const { userId, username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "username is required" });
    }

    const searchUser = await User.findById(userId);
    if (!searchUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!username || !userId) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Update user details
    searchUser.username = username;
    await searchUser.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error editing user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//region Edit User Password
export const editUserPassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "password is required" });
    }

    const searchUser = await User.findById(userId);
    if (!searchUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Decrypt the password received from frontend
    const decryptedOldPassword = decryptData(oldPassword);
    const decryptedNewPassword = decryptData(newPassword);

    if (!decryptedOldPassword || !decryptedNewPassword) {
      return res.status(400).json({ error: "Invalid password format" });
    }

    // Decrypt stored password for comparison
    const storedPassword = decryptData(searchUser.password);

    if (decryptedOldPassword !== storedPassword) {
      return res.status(409).json({ error: "Old password does not match" });
    }

    // Encrypt and update the new password
    const passwordToStore = encryptData(decryptedNewPassword);
    searchUser.password = passwordToStore;
    await searchUser.save();

    res.status(200).json({ message: "User password updated successfully" });
  } catch (error) {
    console.error("Error editing user password:", error);
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
    const safeUsers = users.map((user) => ({
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

// region Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "UserID is required" });
    }
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      username: user.username,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// region Short URL user
export const createShortUrlUser = async (req, res) => {
  try {
    const { userId, originalUrl } = req.body;
    if (!userId || !originalUrl) {
      return res
        .status(400)
        .json({ error: "User ID and Original URL are required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user's urls array has reached the limit
    if (user.urls.length >= 20) {
      return res
        .status(429)
        .json({ error: "Memory is full, please try again later" });
    }

    // Check if the originalUrl already exists in user's urls
    let existingUrl = user.urls.find((url) => url.originalUrl === originalUrl);
    if (existingUrl) {
      // Update createdAt and expiresAt
      const createdAt = new Date();
      const expiresAt = new Date(
        createdAt.getTime() + 90 * 24 * 60 * 60 * 1000
      );
      existingUrl.createdAt = createdAt;
      existingUrl.expiresAt = expiresAt;
      await user.save();
      return res.status(200).json({ shortUrl: existingUrl.shortUrl });
    }

    // Generate a unique shortUrl
    let shortUrl;
    let isUnique = false;
    while (!isUnique) {
      shortUrl = nanoid(8);
      // Check uniqueness in user's urls array ONLY
      const exists = user.urls.some((url) => url.shortUrl === shortUrl);
      if (!exists) isUnique = true;
    }
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 90 * 24 * 60 * 60 * 1000);
    const newUrl = {
      originalUrl,
      shortUrl,
      clicks: 0,
      createdAt,
      expiresAt,
    };
    user.urls.push(newUrl);
    await user.save();
    res.status(201).json({ shortUrl });
  } catch (error) {
    console.error("Error creating short URL for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// region Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate URL count
    const urlCount = user.urls.length;

    // Calculate total clicks
    const totalClicks = user.urls.reduce(
      (sum, url) => sum + (url.clicks || 0),
      0
    );

    // Format URL details for response
    const urlDetails = user.urls.map((url) => ({
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      clicks: url.clicks || 0,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    }));

    res.status(200).json({
      urlCount,
      totalClicks,
      urls: urlDetails,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//region Delete user URL
export const deleteUserUrl = async (req, res) => {
  try {
    const { userId, shortUrl } = req.body;

    if (!userId || !shortUrl) {
      return res
        .status(400)
        .json({ error: "User ID and Short URL are required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the URL to delete
    const urlIndex = user.urls.findIndex((url) => url.shortUrl === shortUrl);
    if (urlIndex === -1) {
      return res
        .status(404)
        .json({ error: "Short URL not found for this user" });
    }

    // Remove the URL from user's urls array
    user.urls.splice(urlIndex, 1);
    await user.save();

    res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting user URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//region Change Avatar
export const changeAvatar = async (req, res) => {
  try {
    let { userId, avatar } = req.body;
    if (!userId || typeof avatar !== "number") {
      return res.status(400).json({ error: "Payload error" });
    }
    if (avatar < 0 || avatar > 5) {
      return res.status(400).json({ error: "Avatar out of bounds" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.avatar = avatar;
    await user.save();
    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (error) {
    console.error("Error in changine avatar", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
