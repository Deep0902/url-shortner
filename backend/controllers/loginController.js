import User from "../models/users.model.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  // Authenticate user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  user.password = password;
  user.email = email;
  if (user.password !== password && user.email !== email) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.status(200).json({ message: "Login successful", userId: user._id });
};
