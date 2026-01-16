import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Feedback from "./models/Feedback.js";
import Analytics from "./models/Analytics.js";
import { auth, admin } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

/* ---------- AUTH ---------- */

// POST /api/auth/google
app.post("/api/auth/google", async (req, res) => {
  const { credential } = req.body;

  const googleRes = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
  );

  const { email, name, picture } = googleRes.data;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name, picture, is_admin: false });
  }

  const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token, user });
});

// GET /api/auth/me
app.get("/api/auth/me", auth, async (req, res) => {
  res.json(req.user);
});

/* ---------- PRODUCTS ---------- */

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json({ products });
});

app.post("/api/products", auth, admin, async (req, res) => {
  await Product.create(req.body);
  res.json({ success: true });
});

app.put("/api/products/:id", auth, admin, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

app.delete("/api/products/:id", auth, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.post("/api/products/:id/like", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, {
    $inc: { likes_count: 1 }
  });
  res.json({ success: true });
});

/* ---------- FEEDBACK ---------- */

app.get("/api/feedback", async (req, res) => {
  const feedbacks = await Feedback.find().sort({ created_at: -1 });
  res.json(feedbacks);
});

app.post("/api/feedback", auth, async (req, res) => {
  await Feedback.create({
    user_name: req.user.name,
    message: req.body.message
  });
  res.json({ success: true });
});

/* ---------- ANALYTICS ---------- */

app.post("/api/track/click", async (req, res) => {
  await Analytics.create(req.body);
  res.json({ success: true });
});

app.get("/api/analytics/clicks", async (req, res) => {
  const all = await Analytics.find();

  const by_type = {};
  all.forEach(a => {
    by_type[a.event_type] = (by_type[a.event_type] || 0) + 1;
  });

  res.json({
    total_clicks: all.length,
    by_type
  });
});

/* ---------- START ---------- */

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});


