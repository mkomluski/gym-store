import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/CartPage.css";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="checkout-success">
      <h1>Order Confirmed</h1>
      <p>Your payment was successful!</p>
      <div className="success-actions">
        <Link className="btn-primary" to="/products">
          Continue Shopping
        </Link>
        <Link className="btn-secondary" to="/orders">
          View My Orders
        </Link>
      </div>
    </div>
  );
}
