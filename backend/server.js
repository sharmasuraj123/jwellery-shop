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

const PORT = process.env.PORT || 4000;

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://jwellery-frontend-woad.vercel.app",
  credentials: true
}));


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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Missing credential" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, picture, is_admin: false });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    res.status(401).json({ message: "Google login failed" });
  }
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

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});


