import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div>
        <div className="product-card-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="image-placeholder" />
          )}
        </div>
        <div className="product-card-body">
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-price">${product.price}</p>
        </div>
      </div>
    </Link>
  );
}
