import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  image_url: String,
  price: Number,
  likes_count: { type: Number, default: 0 }
});

export default mongoose.model("Product", productSchema);
