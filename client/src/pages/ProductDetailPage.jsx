import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "../api/axios";
import ReviewSection from "../components/ReviewSection";
import "../styles/ProductDetail.css";

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { id } = useParams();

  useEffect(() => {
    let ignore = false;

    async function fetchProduct() {
      setLoading(true);
      try {
        const response = await axios.get(`/products/${id}`);
        if (!ignore) setProduct(response.data.result);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  const stockLabel = product
    ? product.stockQuantity === 0
      ? "Out of Stock"
      : product.stockQuantity <= 5
        ? `Low Stock (${product.stockQuantity} left)`
        : "In Stock"
    : null;

  const stockClass = product
    ? product.stockQuantity === 0
      ? "stock-out"
      : product.stockQuantity <= 5
        ? "stock-low"
        : "stock-ok"
    : null;

  return (
    <div className="product-detail-page">
      <button className="product-detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {loading && <div className="product-detail-loading">Loading...</div>}

      {!loading && product && (
        <>
          <div className="product-detail-layout">
            <div className="product-detail-image-wrapper">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="product-detail-image-placeholder">No Image</div>
              )}
            </div>

            <div className="product-detail-info">
              <p className="product-detail-category">
                {product.Category?.name}
              </p>
              <h1 className="product-detail-name">{product.name}</h1>
              <span className={`product-detail-stock ${stockClass}`}>
                {stockLabel}
              </span>
              <p className="product-detail-price">${product.price}</p>

              <hr className="product-detail-divider" />

              <div>
                <p className="quantity-label">Quantity</p>
                <div className="quantity-selector">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                    }
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="add-to-cart-btn"
                disabled={product.stockQuantity === 0}
                onClick={() => addToCart(product, quantity)}
              >
                {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <div>
                <p className="product-detail-description-label">Description</p>
                <p className="product-detail-description">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
          <ReviewSection productId={product.id} />
        </>
      )}
    </div>
  );
}
