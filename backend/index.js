import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

// MongoDB connection
const dbName = "url-short"; // Set your desired database name here
mongoose
  .connect(process.env.DATABASE_URL, { dbName })
  .then(() => {
    console.log(`Connected to MongoDB database: ${dbName}`);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: { type: String, index: true, unique: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, expires: 0 },
});

const Url = mongoose.model("Url", urlSchema);

// New User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  urls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Url" }],
});

const User = mongoose.model("User", userSchema);

// Authentication middleware
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or missing API key" });
  }
  next();
}

// Use authentication for all API routes
app.use("/api", authenticateApiKey);

// Create a short URL
app.post("/api/shorten", async (req, res) => {
  try {
    // Check if the URL count has reached the limit
    const urlCount = await Url.countDocuments();
    if (urlCount >= 10) {
      return res
        .status(429)
        .json({ error: "Memory is full, please try again later" });
    }
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    // Check if the originalUrl already exists
    let existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      const createdAt = new Date();
      const expiresAt = new Date(
        createdAt.getTime() + 90 * 24 * 60 * 60 * 1000
      ); // 3 months from now
      existingUrl.createdAt = createdAt;
      existingUrl.expiresAt = expiresAt;
      await existingUrl.save();
      return res.status(200).json({ shortUrl: existingUrl.shortUrl });
    }

    // Generate a unique shortUrl
    let shortUrl;
    let isUnique = false;
    while (!isUnique) {
      shortUrl = nanoid(8);
      const existingShort = await Url.findOne({ shortUrl });
      if (!existingShort) isUnique = true;
    }
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 90 * 24 * 60 * 60 * 1000); // 3 months from now
    const newUrl = new Url({ originalUrl, shortUrl, createdAt, expiresAt });
    await newUrl.save();
    res.status(201).json({ shortUrl: newUrl.shortUrl });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Redirect to original URL
app.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    console.log("URL Found", url);
    if (url) {
      url.clicks++; // Increment click count
      await url.save(); // Save the updated URL document
      return res.redirect(url.originalUrl); // Redirect to the original URL
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    console.error("Error redirecting to original URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to get total number of URLs and total clicks
app.get("/api/stats", async (req, res) => {
  try {
    const urls = await Url.find({}).lean();
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
    res.json({ totalUrls, totalClicks });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// region USERS
// API to create a new user
app.post("/api/users", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }
    const newUser = new User({ username, password, email, urls: [] });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Health check route for root
app.get("/", (req, res) => {
  res.send("URL Shorten Backend is running");
});

// Add a ping endpoint for warming up the backend
app.get("/api/ping", (req, res) => {
  res.sendStatus(204);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}
app.use(compression());
export default app;
