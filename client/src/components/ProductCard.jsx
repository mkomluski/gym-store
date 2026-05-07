import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div className="product-card-image">
        {/* placeholder posto nemam slike */}
        <div className="image-placeholder" />
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">${product.price}</p>
        <button
          className="btn-primary"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          VIEW
        </button>
      </div>
    </div>
  );
}
