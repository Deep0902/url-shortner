import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: { type: String },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, expires: 0 },
});

const Url = mongoose.model("Url", urlSchema);

export default Url;
