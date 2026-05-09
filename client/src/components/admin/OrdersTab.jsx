import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function OrdersTab() {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/orders")
      .then((res) => setOrders(res.data.result.rows || []))
      .catch((err) => console.error("Failed to fetch orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="tab-content">
      <h2>Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                {order.User.firstName} {order.User.lastName}
                <br />
                <span className="muted">{order.User.email}</span>
              </td>
              <td>{order.status}</td>
              <td>{parseFloat(order.totalAmount).toFixed(2)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <select
                  value={statuses[order.id] ?? order.status}
                  onChange={(e) =>
                    setStatuses((prev) => ({
                      ...prev,
                      [order.id]: e.target.value,
                    }))
                  }
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
                <button
                  onClick={() => {
                    const newStatus = statuses[order.id] ?? order.status;
                    axios
                      .put(`/orders/${order.id}/status`, {
                        status: newStatus,
                      })
                      .then(() =>
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === order.id ? { ...o, status: newStatus } : o,
                          ),
                        ),
                      )
                      .catch((err) =>
                        console.error("Failed to update status:", err),
                      );
                  }}
                >
                  Confirm
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
