import express from "express";
import { createShortUrl, getStats } from "../controllers/urlController.js";
const router = express.Router();

// POST /api/shorten - Create short URL
router.post("/shorten", createShortUrl);

// GET /api/stats - Get URL statistics
router.get("/stats", getStats);

// GET /api/ping - Health check
router.get("/ping", (req, res) => {
  res.sendStatus(204);
});

export default router;
