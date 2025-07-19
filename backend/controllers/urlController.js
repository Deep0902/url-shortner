import Url from "../models/url.model.js";
import User from "../models/users.model.js"; // <-- Add this line
import { nanoid } from "nanoid";

// region Create short URL
export const createShortUrl = async (req, res) => {
  try {
    // Check if the URL count has reached the limit
    const urlCount = await Url.countDocuments();
    if (urlCount >= 20) {
      return res
        .status(429)
        .json({ error: "Memory is full, please try again later" });
    }
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    let urlToSave = originalUrl.trim();
    if (!/^https?:\/\//i.test(urlToSave)) {
      urlToSave = "https://" + urlToSave;
    }

    // Check if the originalUrl already exists
    let existingUrl = await Url.findOne({ originalUrl: urlToSave });
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
    const newUrl = new Url({ originalUrl: urlToSave, shortUrl, createdAt, expiresAt });
    await newUrl.save();
    res.status(201).json({ shortUrl: newUrl.shortUrl });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// region Redirect
export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    // First, check in users' embedded urls
    const user = await User.findOne({ "urls.shortUrl": shortUrl });
    if (user) {
      const urlDoc = user.urls.find((url) => url.shortUrl === shortUrl);
      if (urlDoc) {
        urlDoc.clicks++;
        await user.save();
        return res.redirect(urlDoc.originalUrl);
      }
    }

    // Fallback: check in global Url collection
    const url = await Url.findOne({ shortUrl });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    }

    // If not found in either
    return res.status(404).json({ error: "URL not found" });
  } catch (error) {
    console.error("Error redirecting to original URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// region Get stats
export const getStats = async (req, res) => {
  try {
    const urls = await Url.find({}).lean();
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
    res.json({ totalUrls, totalClicks });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
