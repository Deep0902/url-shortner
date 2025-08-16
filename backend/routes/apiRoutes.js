import express from "express";
import { createShortUrl, getStats } from "../controllers/urlController.js";
import { publicLimiter } from "../middlewares/auth.js";
const router = express.Router();

// POST /api/shorten - Create short URL
router.post("/shorten", publicLimiter, createShortUrl);

// GET /api/stats - Get URL statistics
router.get("/stats", publicLimiter, getStats);

// GET /api/ping - Health check
router.get("/ping", (req, res) => {
  res.sendStatus(204);
});

export default router;
