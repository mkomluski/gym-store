import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(product, quantity) {
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      updateQuantity(product.id, existing.quantity + quantity);
    } else {
      setItems([...items, { product, quantity }]);
    }
  }

  function removeFromCart(productId) {
    setItems(items.filter((item) => item.product.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    setItems(
      items.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      }),
    );
  }

  function clearCart() {
    setItems([]);
  }

  function getTotal() {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
