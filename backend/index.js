const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Janki Jewellery DB"))
  .catch(err => console.log(err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  likes: { type: Number, default: 0 },
  feedback: [{ user: String, comment: String, isPurchaseIntent: Boolean }]
});

const Product = mongoose.model('Product', productSchema);

// Routes
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products/:id/like', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
  res.json(product);
});

app.post('/api/products/:id/feedback', async (req, res) => {
  const { user, comment, isPurchaseIntent } = req.body;
  const product = await Product.findById(req.params.id);
  product.feedback.push({ user, comment, isPurchaseIntent });
  await product.save();
  res.json(product);
});

app.listen(5000, () => console.log("Server running on port 5000"));