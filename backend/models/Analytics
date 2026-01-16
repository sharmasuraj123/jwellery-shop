import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  event_type: String,
  product_id: String,
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Analytics", analyticsSchema);
