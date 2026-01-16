import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user_name: String,
  message: String,
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Feedback", feedbackSchema);
