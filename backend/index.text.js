import request from "supertest";
import mongoose from "mongoose";
import app from "./index.js"; // You may need to export your app from index.js

beforeAll(async () => {
  // Optionally connect to a test database
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/shorten", () => {
  it("should return 400 if originalUrl is missing", async () => {
    const res = await request(app).post("/api/shorten").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Original URL is required");
  });

  it("should create a new short URL", async () => {
    const res = await request(app)
      .post("/api/shorten")
      .send({ originalUrl: "https://example.com" });
    expect(res.statusCode).toBe(201);
    expect(res.body.url.originalUrl).toBe("https://example.com");
    expect(res.body.url.shortUrl).toBeDefined();
  });
});

describe("GET /api/stats", () => {
  it("should return totalUrls and totalClicks", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totalUrls");
    expect(res.body).toHaveProperty("totalClicks");
  });
});
