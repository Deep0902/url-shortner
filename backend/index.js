import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

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
      return res
        .status(200)
        .json({ message: "URL already exists", url: existingUrl });
    }

    const shortUrl = nanoid(8);
    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();
    res.status(201).json({ message: "URL Generated", url: newUrl });
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
    const urls = await Url.find({});
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
    res.json({ totalUrls, totalClicks });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

export default app;