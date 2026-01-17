// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import { toast } from "sonner";
// import { ArrowLeft, Heart, ShoppingCart, MessageSquare } from "lucide-react";

// const BACKEND_URL = import.meta.REACT_APP_BACKEND_URL;
// const API = `/api`;

// export default function AdminPage() {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [analytics, setAnalytics] = useState({ total_clicks: 0, by_type: {} });
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     category: "ring",
//     description: "",
//     image_url: "",
//     price: 0,
//   });
//   const [editingProduct, setEditingProduct] = useState(null);

//   useEffect(() => {
//     if (!loading) {
//       if (!user || !user.is_admin) {
//         navigate("/");
//         return;
//       }
//       fetchData();
//     }
//   }, [user, loading, navigate]);

//   const fetchData = async () => {
//     try {
//       const [productsRes, feedbackRes, analyticsRes] = await Promise.all([
//         axios.get(`${API}/products`),
//         axios.get(`${API}/feedback`),
//         axios.get(`${API}/analytics/clicks`),
//       ]);
//       setProducts(productsRes.data.products || []);
//       setFeedbacks(feedbackRes.data || []);
//       setAnalytics(analyticsRes.data || { total_clicks: 0, by_type: {} });
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       toast.error("Failed to load admin data");
//     }
//   };

//   const handleCreateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API}/products`, newProduct);
//       toast.success("Product created successfully!");
//       setNewProduct({
//         name: "",
//         category: "ring",
//         description: "",
//         image_url: "",
//         price: 0,
//       });
//       fetchData();
//     } catch (error) {
//       toast.error("Failed to create product");
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${API}/products/${editingProduct.id}`, editingProduct);
//       toast.success("Product updated successfully!");
//       setEditingProduct(null);
//       fetchData();
//     } catch (error) {
//       toast.error("Failed to update product");
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (!window.confirm("Are you sure you want to delete this product?"))
//       return;
//     try {
//       await axios.delete(`${API}/products/${productId}`);
//       toast.success("Product deleted");
//       fetchData();
//     } catch (error) {
//       toast.error("Failed to delete product");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-stone-50">
//       <div className="container-custom py-8">
//         <div className="flex items-center gap-4 mb-8">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/")}
//             data-testid="back-to-home-btn"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Store
//           </Button>
//           <h1
//             className="text-4xl font-bold"
//             style={{ fontFamily: "Playfair Display, serif" }}
//           >
//             Admin Dashboard
//           </h1>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card data-testid="analytics-likes-card">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Heart className="w-5 h-5" />
//                 Total Likes
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">
//                 {analytics.by_type?.like || 0}
//               </p>
//             </CardContent>
//           </Card>
//           <Card data-testid="analytics-buynow-card">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <ShoppingCart className="w-5 h-5" />
//                 Buy Now Clicks
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">
//                 {analytics.by_type?.buy_now || 0}
//               </p>
//             </CardContent>
//           </Card>
//           <Card data-testid="analytics-feedback-card">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MessageSquare className="w-5 h-5" />
//                 Feedback Count
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">{feedbacks.length}</p>
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="products" className="space-y-8">
//           <TabsList>
//             <TabsTrigger value="products" data-testid="tab-products">
//               Products
//             </TabsTrigger>
//             <TabsTrigger value="feedback" data-testid="tab-feedback">
//               Feedback
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="products" data-testid="products-tab-content">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Add New Product</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleCreateProduct} className="space-y-4">
//                   <div>
//                     <Label htmlFor="name">Product Name</Label>
//                     <Input
//                       id="name"
//                       data-testid="input-product-name"
//                       value={newProduct.name}
//                       onChange={(e) =>
//                         setNewProduct({ ...newProduct, name: e.target.value })
//                       }
//                       reqUIred
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="category">Category</Label>
//                     <select
//                       id="category"
//                       data-testid="select-product-category"
//                       className="w-full px-3 py-2 border rounded-md"
//                       value={newProduct.category}
//                       onChange={(e) =>
//                         setNewProduct({
//                           ...newProduct,
//                           category: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="ring">Ring</option>
//                       <option value="necklace">Necklace</option>
//                       <option value="earring">Earring</option>
//                       <option value="bracelet">Bracelet</option>
//                     </select>
//                   </div>
//                   <div>
//                     <Label htmlFor="description">Description</Label>
//                     <Input
//                       id="description"
//                       data-testid="input-product-description"
//                       value={newProduct.description}
//                       onChange={(e) =>
//                         setNewProduct({
//                           ...newProduct,
//                           description: e.target.value,
//                         })
//                       }
//                       reqUIred
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="image_url">Image URL (Cloudinary)</Label>
//                     <Input
//                       id="image_url"
//                       data-testid="input-product-image-url"
//                       value={newProduct.image_url}
//                       onChange={(e) =>
//                         setNewProduct({
//                           ...newProduct,
//                           image_url: e.target.value,
//                         })
//                       }
//                       placeholder="https://res.cloudinary.com/..."
//                       reqUIred
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="price">Price ($)</Label>
//                     <Input
//                       id="price"
//                       type="number"
//                       data-testid="input-product-price"
//                       value={newProduct.price}
//                       onChange={(e) =>
//                         setNewProduct({
//                           ...newProduct,
//                           price: parseFloat(e.target.value),
//                         })
//                       }
//                       reqUIred
//                     />
//                   </div>
//                   <Button type="submit" data-testid="btn-create-product">
//                     Add Product
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             <Card className="mt-8">
//               <CardHeader>
//                 <CardTitle>Manage Products</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {products.map((product) => (
//                     <div
//                       key={product.id}
//                       className="border p-4 rounded-lg"
//                       data-testid={`product-item-${product.id}`}
//                     >
//                       {editingProduct?.id === product.id ? (
//                         <form
//                           onSubmit={handleUpdateProduct}
//                           className="space-y-4"
//                         >
//                           <Input
//                             value={editingProduct.name}
//                             onChange={(e) =>
//                               setEditingProduct({
//                                 ...editingProduct,
//                                 name: e.target.value,
//                               })
//                             }
//                             data-testid="edit-product-name"
//                           />
//                           <Input
//                             value={editingProduct.image_url}
//                             onChange={(e) =>
//                               setEditingProduct({
//                                 ...editingProduct,
//                                 image_url: e.target.value,
//                               })
//                             }
//                             placeholder="Image URL"
//                             data-testid="edit-product-image-url"
//                           />
//                           <Input
//                             type="number"
//                             value={editingProduct.price}
//                             onChange={(e) =>
//                               setEditingProduct({
//                                 ...editingProduct,
//                                 price: parseFloat(e.target.value),
//                               })
//                             }
//                             data-testid="edit-product-price"
//                           />
//                           <div className="flex gap-2">
//                             <Button
//                               type="submit"
//                               data-testid="btn-save-product"
//                             >
//                               Save
//                             </Button>
//                             <Button
//                               variant="outline"
//                               onClick={() => setEditingProduct(null)}
//                               data-testid="btn-cancel-edit"
//                             >
//                               Cancel
//                             </Button>
//                           </div>
//                         </form>
//                       ) : (
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-4">
//                             <img
//                               src={product.image_url}
//                               alt={product.name}
//                               className="w-16 h-16 object-cover"
//                             />
//                             <div>
//                               <h3 className="font-semibold">{product.name}</h3>
//                               <p className="text-sm text-stone-600">
//                                 ${product.price} - {product.likes_count} likes
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               variant="outline"
//                               onClick={() => setEditingProduct(product)}
//                               data-testid={`btn-edit-${product.id}`}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               variant="destructive"
//                               onClick={() => handleDeleteProduct(product.id)}
//                               data-testid={`btn-delete-${product.id}`}
//                             >
//                               Delete
//                             </Button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="feedback" data-testid="feedback-tab-content">
//             <Card>
//               <CardHeader>
//                 <CardTitle>User Feedback</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {feedbacks.length === 0 ? (
//                     <p className="text-stone-500">No feedback yet.</p>
//                   ) : (
//                     feedbacks.map((feedback) => (
//                       <div
//                         key={feedback.id}
//                         className="border-b pb-4"
//                         data-testid={`feedback-item-${feedback.id}`}
//                       >
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <p className="font-semibold">
//                               {feedback.user_name}
//                             </p>
//                             <p className="text-stone-600 mt-1">
//                               {feedback.message}
//                             </p>
//                           </div>
//                           <span className="text-sm text-stone-400">
//                             {new Date(feedback.created_at).toLocaleDateString()}
//                           </span>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import { toast } from "sonner";
// import { ArrowLeft, Heart, ShoppingCart, MessageSquare } from "lucide-react";

// const API = `/api`;

// export default function AdminPage() {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [analytics, setAnalytics] = useState({ total_clicks: 0, by_type: {} });

//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     category: "ring",
//     description: "",
//     image_url: "",
//     price: 0,
//   });

//   const [editingProduct, setEditingProduct] = useState(null);

//   useEffect(() => {
//     if (!loading) {
//       if (!user || !user.is_admin) {
//         navigate("/");
//         return;
//       }
//       fetchData();
//     }
//   }, [user, loading, navigate]);

//   const fetchData = async () => {
//     try {
//       const [productsRes, feedbackRes, analyticsRes] = await Promise.all([
//         axios.get(`${API}/products`),
//         axios.get(`${API}/feedback`),
//         axios.get(`${API}/analytics/clicks`),
//       ]);

//       setProducts(productsRes.data.products || []);
//       setFeedbacks(feedbackRes.data || []);
//       setAnalytics(analyticsRes.data || { total_clicks: 0, by_type: {} });
//     } catch (error) {
//       console.error("Failed to fetch admin data:", error);
//       toast.error("Failed to load admin data");
//     }
//   };

//   const handleCreateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API}/products`, newProduct);
//       toast.success("Product created successfully!");
//       setNewProduct({
//         name: "",
//         category: "ring",
//         description: "",
//         image_url: "",
//         price: 0,
//       });
//       fetchData();
//     } catch {
//       toast.error("Failed to create product");
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const id = editingProduct._id || editingProduct.id;
//       await axios.put(`${API}/products/${id}`, editingProduct);
//       toast.success("Product updated successfully!");
//       setEditingProduct(null);
//       fetchData();
//     } catch {
//       toast.error("Failed to update product");
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       await axios.delete(`${API}/products/${id}`);
//       toast.success("Product deleted");
//       fetchData();
//     } catch {
//       toast.error("Failed to delete product");
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-stone-50">
//       <div className="container-custom py-8">

//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <Button variant="ghost" onClick={() => navigate("/")}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//           <h1 className="text-4xl font-bold">Admin Dashboard</h1>
//         </div>

//         {/* Analytics */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card>
//             <CardHeader><CardTitle><Heart className="inline mr-2" /> Likes</CardTitle></CardHeader>
//             <CardContent><p className="text-3xl font-bold">{analytics.by_type?.like || 0}</p></CardContent>
//           </Card>

//           <Card>
//             <CardHeader><CardTitle><ShoppingCart className="inline mr-2" /> Buy Now</CardTitle></CardHeader>
//             <CardContent><p className="text-3xl font-bold">{analytics.by_type?.buy_now || 0}</p></CardContent>
//           </Card>

//           <Card>
//             <CardHeader><CardTitle><MessageSquare className="inline mr-2" /> Feedback</CardTitle></CardHeader>
//             <CardContent><p className="text-3xl font-bold">{feedbacks.length}</p></CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="products">

//           <TabsList>
//             <TabsTrigger value="products">Products</TabsTrigger>
//             <TabsTrigger value="feedback">Feedback</TabsTrigger>
//           </TabsList>

//           {/* PRODUCTS TAB */}
//           <TabsContent value="products">

//             {/* Add Product */}
//             <Card>
//               <CardHeader><CardTitle>Add Product</CardTitle></CardHeader>
//               <CardContent>
//                 <form onSubmit={handleCreateProduct} className="space-y-3">
//                   <Input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
//                   <Input placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
//                   <Input placeholder="Image URL" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} />
//                   <Input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
//                   <Button type="submit">Add Product</Button>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Manage Products */}
//             <Card className="mt-6">
//               <CardHeader><CardTitle>Manage Products</CardTitle></CardHeader>
//               <CardContent>
//                 {products.map((product) => {
//                   const id = product._id || product.id;

//                   return (
//                     <div key={id} className="border p-4 mb-4 rounded">
//                       {editingProduct?._id === id || editingProduct?.id === id ? (
//                         <form onSubmit={handleUpdateProduct} className="space-y-2">
//                           <Input value={editingProduct?.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
//                           <Input value={editingProduct?.image_url || ""} onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })} />
//                           <Input type="number" value={editingProduct?.price || 0} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} />
//                           <div className="flex gap-2">
//                             <Button type="submit">Save</Button>
//                             <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
//                           </div>
//                         </form>
//                       ) : (
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <p className="font-bold">{product.name}</p>
//                             <p>${product.price}</p>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button onClick={() => setEditingProduct(product)}>Edit</Button>
//                             <Button variant="destructive" onClick={() => handleDeleteProduct(id)}>Delete</Button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* FEEDBACK TAB */}
//           <TabsContent value="feedback">
//             <Card>
//               <CardHeader><CardTitle>User Feedback</CardTitle></CardHeader>
//               <CardContent>
//                 {feedbacks.map((f) => (
//                   <div key={f._id || f.id} className="border-b py-2">
//                     <p className="font-semibold">{f.user_name}</p>
//                     <p>{f.message}</p>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </TabsContent>

//         </Tabs>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { toast } from "sonner";
// import { ArrowLeft, Heart, ShoppingCart, MessageSquare } from "lucide-react";

// const API = "/api";

// const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// export default function AdminPage() {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [analytics, setAnalytics] = useState({ by_type: {} });

//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     description: "",
//     image_url: "",
//     price: 0,
//   });

//   const [uploading, setUploading] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   useEffect(() => {
//     if (!loading) {
//       if (!user || !user.is_admin) return navigate("/");
//       fetchData();
//     }
//   }, [user, loading]);

//   const fetchData = async () => {
//     try {
//       const [p, f, a] = await Promise.all([
//         axios.get(`${API}/products`),
//         axios.get(`${API}/feedback`),
//         axios.get(`${API}/analytics/clicks`)
//       ]);

//       setProducts(p.data.products || []);
//       setFeedbacks(f.data || []);
//       setAnalytics(a.data || { by_type: {} });
//     } catch {
//       toast.error("Failed loading admin data");
//     }
//   };

//   // ---------- CLOUDINARY UPLOAD ----------
//   const handleImageUpload = async (file) => {
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     try {
//       const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
//         method: "POST",
//         body: formData
//       });

//       const data = await res.json();
//       setNewProduct({ ...newProduct, image_url: data.secure_url });
//       toast.success("Image uploaded");
//     } catch {
//       toast.error("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ---------- CREATE PRODUCT ----------
//   const handleCreateProduct = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post(`${API}/products`, newProduct);
//       toast.success("Product created");

//       setNewProduct({ name: "", description: "", image_url: "", price: 0 });
//       fetchData();
//     } catch {
//       toast.error("Create failed");
//     }
//   };

//   // ---------- DELETE ----------
//   const handleDelete = async (id) => {
//     if (!confirm("Delete product?")) return;
//     await axios.delete(`${API}/products/${id}`);
//     fetchData();
//   };

//   if (loading) return <div className="p-10">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-stone-50 p-6">
//       <div className="flex items-center gap-4 mb-6">
//         <Button variant="ghost" onClick={() => navigate("/")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back
//         </Button>
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//       </div>

//       {/* ANALYTICS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <Card><CardContent><Heart /> Likes: {analytics.by_type?.like || 0}</CardContent></Card>
//         <Card><CardContent><ShoppingCart /> Buy: {analytics.by_type?.buy_now || 0}</CardContent></Card>
//         <Card><CardContent><MessageSquare /> Feedback: {feedbacks.length}</CardContent></Card>
//       </div>

//       <Tabs defaultValue="products">
//         <TabsList>
//           <TabsTrigger value="products">Products</TabsTrigger>
//           <TabsTrigger value="feedback">Feedback</TabsTrigger>
//         </TabsList>

//         {/* PRODUCTS */}
//         <TabsContent value="products">
//           <Card>
//             <CardHeader><CardTitle>Add Product</CardTitle></CardHeader>
//             <CardContent>
//               <form onSubmit={handleCreateProduct} className="space-y-3">

//                 <Input placeholder="Name"
//                   value={newProduct.name}
//                   onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                 />

//                 <Input placeholder="Description"
//                   value={newProduct.description}
//                   onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//                 />

//                 <Input type="number" placeholder="Price"
//                   value={newProduct.price}
//                   onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
//                 />

//                 {/* FILE UPLOAD */}
//                 <Input type="file" accept="image/*"
//                   onChange={(e) => handleImageUpload(e.target.files[0])}
//                 />

//                 {uploading && <p>Uploading image...</p>}

//                 {newProduct.image_url && (
//                   <img src={newProduct.image_url} className="w-32 rounded" />
//                 )}

//                 <Button type="submit" disabled={!newProduct.image_url}>
//                   Add Product
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* PRODUCT LIST */}
//           <Card className="mt-6">
//             <CardHeader><CardTitle>Products</CardTitle></CardHeader>
//             <CardContent>
//               {products.map(p => {
//                 const id = p._id || p.id;

//                 return (
//                   <div key={id} className="border p-3 mb-2 flex justify-between">
//                     <div>
//                       <p className="font-bold">{p.name}</p>
//                       <p>${p.price}</p>
//                     </div>
//                     <Button variant="destructive" onClick={() => handleDelete(id)}>Delete</Button>
//                   </div>
//                 );
//               })}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* FEEDBACK */}
//         <TabsContent value="feedback">
//           <Card>
//             <CardHeader><CardTitle>Feedback</CardTitle></CardHeader>
//             <CardContent>
//               {feedbacks.map(f => (
//                 <div key={f._id || f.id} className="border-b py-2">
//                   <p className="font-bold">{f.user_name}</p>
//                   <p>{f.message}</p>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

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

const API = import.meta.env.VITE_BACKEND_URL + "/api";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
  const [uploading, setUploading] = useState(false);

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

      setProducts(productsRes.data.products || []);
      setFeedbacks(feedbackRes.data || []);
      setAnalytics(analyticsRes.data || { total_clicks: 0, by_type: {} });
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      toast.error("Failed to load admin data");
    }
  };

  // 🔥 NEW: Image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      setNewProduct((prev) => ({
        ...prev,
        image_url: data.secure_url,
      }));

      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.image_url) {
      toast.error("Please upload image first");
      return;
    }

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
    } catch {
      toast.error("Failed to create product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const id = editingProduct._id || editingProduct.id;
      await axios.put(`${API}/products/${id}`, editingProduct);
      toast.success("Product updated successfully!");
      setEditingProduct(null);
      fetchData();
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success("Product deleted");
      fetchData();
    } catch {
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>
                <Heart className="inline mr-2" /> Likes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {analytics.by_type?.like || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <ShoppingCart className="inline mr-2" /> Buy Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {analytics.by_type?.buy_now || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <MessageSquare className="inline mr-2" /> Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{feedbacks.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products">
            {/* ✅ UPDATED Add Product */}
            <Card>
              <CardHeader>
                <CardTitle>Add Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProduct} className="space-y-3">
                  <Input
                    placeholder="Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />

                  <select
                    className="w-full border px-3 py-2 rounded"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                  >
                    <option value="ring">Ring</option>
                    <option value="necklace">Necklace</option>
                    <option value="earring">Earring</option>
                    <option value="bracelet">Bracelet</option>
                  </select>

                  <Input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: Number(e.target.value),
                      })
                    }
                  />

                  {/* Image Upload */}
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />

                  {uploading && <p>Uploading...</p>}

                  {newProduct.image_url && (
                    <img
                      src={newProduct.image_url}
                      alt="preview"
                      className="w-32 rounded border"
                    />
                  )}

                  <Button type="submit" disabled={!newProduct.image_url}>
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Manage Products (unchanged) */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
              </CardHeader>
              <CardContent>
                {products.map((product) => {
                  const id = product._id || product.id;

                  return (
                    <div key={id} className="border p-4 mb-4 rounded">
                      {editingProduct?._id === id ||
                      editingProduct?.id === id ? (
                        <form
                          onSubmit={handleUpdateProduct}
                          className="space-y-2"
                        >
                          <Input
                            value={editingProduct?.name || ""}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                name: e.target.value,
                              })
                            }
                          />
                          <Input
                            value={editingProduct?.image_url || ""}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                image_url: e.target.value,
                              })
                            }
                          />
                          <Input
                            type="number"
                            value={editingProduct?.price || 0}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                price: Number(e.target.value),
                              })
                            }
                          />
                          <div className="flex gap-2">
                            <Button type="submit">Save</Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingProduct(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold">{product.name}</p>
                            <p>${product.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => setEditingProduct(product)}>
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteProduct(id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FEEDBACK TAB unchanged */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>User Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbacks.map((f) => (
                  <div key={f._id || f.id} className="border-b py-2">
                    <p className="font-semibold">{f.user_name}</p>
                    <p>{f.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
