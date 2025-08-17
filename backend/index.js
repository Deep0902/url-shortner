import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { authenticateApiKey } from "./middlewares/auth.js";
import apiRoutes from "./routes/apiRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://url-shortner-amber-pi.vercel.app/", // Allow all origins
    credentials: true,
  })
);
app.use(express.json());
app.use(compression());
app.use(cookieParser());

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

// Use authentication for all API routes
app.use("/api", authenticateApiKey);

// Routes
app.use("/api", apiRoutes);
app.use("/api", userRoutes);
app.use("/", redirectRoutes);
app.use("/api", loginRoutes);

// Health check route for root
app.get("/", (req, res) => {
  res.send("URL Shorten Backend is running");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}
app.use(compression());
export default app;
