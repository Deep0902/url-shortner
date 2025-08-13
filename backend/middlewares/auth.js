import jwt from "jsonwebtoken"; // Add this import
// region Authentication middleware
export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or missing API key" });
  }
  next();
}

export function authenticateToken(req, res, next) {
  // Read the token from the cookie
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded; // Attach user info to request
    next();
  });
}
