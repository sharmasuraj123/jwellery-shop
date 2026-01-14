import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Heart, ShoppingCart, MessageSquare } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState({ total_clicks: 0, by_type: {} });
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "ring",
    description: "",
    image_url: "",
    price: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user || !user.is_admin) {
        navigate("/");
        return;
      }
      fetchData();
    }
  }, [user, loading, navigate]);

  const fetchData = async () => {
    try {
      const [productsRes, feedbackRes, analyticsRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/feedback`),
        axios.get(`${API}/analytics/clicks`),
      ]);
      setProducts(productsRes.data);
      setFeedbacks(feedbackRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load admin data");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/products`, newProduct);
      toast.success("Product created successfully!");
      setNewProduct({
        name: "",
        category: "ring",
        description: "",
        image_url: "",
        price: 0,
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/products/${editingProduct.id}`, editingProduct);
      toast.success("Product updated successfully!");
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${API}/products/${productId}`);
      toast.success("Product deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container-custom py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            data-testid="back-to-home-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Admin Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="analytics-likes-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Total Likes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {analytics.by_type?.like || 0}
              </p>
            </CardContent>
          </Card>
          <Card data-testid="analytics-buynow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Buy Now Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {analytics.by_type?.buy_now || 0}
              </p>
            </CardContent>
          </Card>
          <Card data-testid="analytics-feedback-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Feedback Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{feedbacks.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-8">
          <TabsList>
            <TabsTrigger value="products" data-testid="tab-products">
              Products
            </TabsTrigger>
            <TabsTrigger value="feedback" data-testid="tab-feedback">
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" data-testid="products-tab-content">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      data-testid="input-product-name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      data-testid="select-product-category"
                      className="w-full px-3 py-2 border rounded-md"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="ring">Ring</option>
                      <option value="necklace">Necklace</option>
                      <option value="earring">Earring</option>
                      <option value="bracelet">Bracelet</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      data-testid="input-product-description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL (Cloudinary)</Label>
                    <Input
                      id="image_url"
                      data-testid="input-product-image-url"
                      value={newProduct.image_url}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          image_url: e.target.value,
                        })
                      }
                      placeholder="https://res.cloudinary.com/..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      data-testid="input-product-price"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" data-testid="btn-create-product">
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border p-4 rounded-lg"
                      data-testid={`product-item-${product.id}`}
                    >
                      {editingProduct?.id === product.id ? (
                        <form
                          onSubmit={handleUpdateProduct}
                          className="space-y-4"
                        >
                          <Input
                            value={editingProduct.name}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                name: e.target.value,
                              })
                            }
                            data-testid="edit-product-name"
                          />
                          <Input
                            value={editingProduct.image_url}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                image_url: e.target.value,
                              })
                            }
                            placeholder="Image URL"
                            data-testid="edit-product-image-url"
                          />
                          <Input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                price: parseFloat(e.target.value),
                              })
                            }
                            data-testid="edit-product-price"
                          />
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              data-testid="btn-save-product"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingProduct(null)}
                              data-testid="btn-cancel-edit"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-stone-600">
                                ${product.price} - {product.likes_count} likes
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingProduct(product)}
                              data-testid={`btn-edit-${product.id}`}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                              data-testid={`btn-delete-${product.id}`}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" data-testid="feedback-tab-content">
            <Card>
              <CardHeader>
                <CardTitle>User Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbacks.length === 0 ? (
                    <p className="text-stone-500">No feedback yet.</p>
                  ) : (
                    feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border-b pb-4"
                        data-testid={`feedback-item-${feedback.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">
                              {feedback.user_name}
                            </p>
                            <p className="text-stone-600 mt-1">
                              {feedback.message}
                            </p>
                          </div>
                          <span className="text-sm text-stone-400">
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
