import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import FeedbackSection from "../components/FeedbackSection";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModel";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = import.meta.REACT_APP_BACKEND_URL;
const API = import.meta.env.VITE_BACKEND_URL + "/api";

export default function HomePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleLike = async (productId) => {
    try {
      await axios.post(`${API}/products/${productId}/like`);
      await axios.post(`${API}/track/click`, {
        event_type: "like",
        product_id: productId,
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to like product:", error);
    }
  };

  const handleBuyNow = async (productId) => {
    try {
      await axios.post(`${API}/track/click`, {
        event_type: "buy_now",
        product_id: productId,
      });
      alert("Thank you for your interest! Our team will contact you soon.");
    } catch (error) {
      console.error("Failed to track buy now:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <Hero />
      <ProductGrid
        products={products}
        onLike={handleLike}
        onBuyNow={handleBuyNow}
      />
      <FeedbackSection />
      <Footer />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
