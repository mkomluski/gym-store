import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "../api/axios";
import "../styles/CartPage.css";

export default function CartPage() {
  const [step, setStep] = useState(1);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/checkout/cancel") {
      const pendingOrderId = sessionStorage.getItem("pendingOrderId");
      if (pendingOrderId) {
        sessionStorage.removeItem("pendingOrderId");
        axios.post(`/orders/${pendingOrderId}/cancel`).catch(() => {});
      }
    }
  }, [location.pathname]);

  return (
    <div className="cart-page">
      <div className="checkout-progress">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>Cart</div>
        <div className={`progress-line ${step >= 2 ? "active" : ""}`} />
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          Review
        </div>
        <div className="progress-line" />
        <div className="progress-step">Confirmation</div>
      </div>
      {step === 1 && <CartStep onContinue={() => setStep(2)} />}
      {step === 2 && <ReviewStep onBack={() => setStep(1)} />}
    </div>
  );
}

function CartStep({ onContinue }) {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-items">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="cart-item">
            <div className="cart-item-info">
              <p className="cart-item-name">{product.name}</p>
              <p className="cart-item-price">${product.price}</p>
            </div>
            <div className="cart-item-controls">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                disabled={quantity >= product.stockQuantity}
              >
                +
              </button>
            </div>
            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(product.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Total</h3>
        <p className="cart-total">${getTotal().toFixed(2)}</p>
        <button className="btn-primary" onClick={onContinue}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

function ReviewStep({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items, getTotal } = useCart();

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderRes = await axios.post("/orders", {
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      });

      const orderId = orderRes.data.result.id;
      const sessionRes = await axios.post("/stripe/create-checkout-session", {
        orderId,
      });

      sessionStorage.setItem("pendingOrderId", orderId);
      window.location.href = sessionRes.data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="cart-layout">
      <div className="cart-items">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="cart-item">
            <div className="cart-item-info">
              <p className="cart-item-name">{product.name}</p>
              <p className="cart-item-price">
                ${(product.price * quantity).toFixed(2)}
                <span className="cart-item-qty"> × {quantity}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Order Total</h3>
        <p className="cart-total">${getTotal().toFixed(2)}</p>
        {error && <p className="cart-error">{error}</p>}
        <button className="btn-primary" onClick={handlePay} disabled={loading}>
          {loading ? "Redirecting..." : "Pay Now"}
        </button>
        <button className="btn-secondary" onClick={onBack} disabled={loading}>
          Back
        </button>
      </div>
    </div>
  );
}
