import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function ProductGrid({ products = [], onLike, onBuyNow }) {
  const [likedProducts, setLikedProducts] = useState(new Set());

  const handleLike = (productId) => {
    if (!likedProducts.has(productId)) {
      setLikedProducts(new Set([...likedProducts, productId]));
      onLike(productId);
    }
  };

  return (
    <section
      id="products"
      className="section-spacing bg-white"
      data-testid="product-grid-section"
    >
      <div className="container-custom">
        <div className="text-center mb-20 slide-up">
          <span className="uppercase tracking-widest text-xs text-stone-500 font-medium mb-4 block">
            Our Collection
          </span>
          <h2
            className="text-4xl sm:text-5xl font-semibold text-stone-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Exquisite Jewellery
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20" data-testid="no-products-message">
            <p className="text-stone-500 text-lg">
              No products available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="product-card slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`product-card-${product._id}`}
              >
                <div className="product-image-container">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                  />
                  <button
                    onClick={() => handleLike(product._id)}
                    className={`absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white ${
                      likedProducts.has(product.id)
                        ? "text-red-500"
                        : "text-stone-400"
                    }`}
                    data-testid={`btn-like-${product._id}`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        likedProducts.has(product._id)
                          ? "text-red-500"
                          : "text-stone-400"
                      }`}
                      fill={
                        likedProducts.has(product._id) ? "currentColor" : "none"
                      }
                    />{" "}
                  </button>
                </div>
                <div className="mt-6 space-y-3">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#832708]">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-medium text-stone-900 mt-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-600 mt-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-[#832708]">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <Heart className="w-4 h-4" />
                      <span>{product.likes_count}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onBuyNow(product._id)}
                    className="btn-secondary w-full"
                    data-testid={`btn-buy-now-${product.id}`}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2 inline" />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
