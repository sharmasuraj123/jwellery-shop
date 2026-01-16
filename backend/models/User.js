import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  picture: String,
  is_admin: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);
