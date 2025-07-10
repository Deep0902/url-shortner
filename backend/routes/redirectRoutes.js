import express from "express";
import { redirectToOriginalUrl } from "../controllers/urlController.js";

const router = express.Router();

// GET /:shortUrl - Redirect to original URL
router.get("/:shortUrl", redirectToOriginalUrl);

export default router;
