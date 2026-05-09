import axios from "../../api/axios";
import { useEffect, useState } from "react";

export default function TransactionsTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/orders")
      .then((res) => setOrders(res.data.result.rows || []))
      .catch((err) => console.error("Failed to fetch orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  const paid = orders.filter((o) => o.status === "PAID");

  return (
    <div className="tab-content">
      <h2>Stripe Transactions</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {paid.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                {order.User.firstName} {order.User.lastName}
                <br />
                <span className="muted">{order.User.email}</span>
              </td>
              <td>
                {order.OrderItems.map((item) => (
                  <div key={item.id}>
                    {item.Product.name} × {item.quantity} @ $
                    {item.priceAtPurchase}
                  </div>
                ))}
              </td>
              <td>${parseFloat(order.totalAmount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
