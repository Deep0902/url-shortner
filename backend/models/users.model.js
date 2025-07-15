import mongoose from "mongoose";

import Url from "./url.model.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  urls: [Url.schema], // Embed all fields from Url model as subdocuments
  avatar: { type: Number, default: 1 }
});

const User = mongoose.model("User", userSchema);

export default User;