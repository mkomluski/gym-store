import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/Profile.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("/users/me");
        const p = profileRes.data.result;
        setProfile(p);
        setForm({
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          phone: p.phone ?? "",
          address: p.address ?? "",
        });
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to load profile.");
      }

      try {
        const ordersRes = await axios.get("/orders/my-orders");
        setOrders(ordersRes.data.result.rows);
      } catch {
        // Ignorise samo
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await axios.put("/users/me", form);
      setProfile(res.data.result);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="profile-page">
      <div className="profile-inner">
        <section className="profile-card">
          <h2 className="profile-section-title">Personal Info</h2>
          {profile && (
            <p className="profile-name">
              {profile.firstName} {profile.lastName}
            </p>
          )}
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            {message && (
              <p
                className={`profile-message ${message.includes("successfully") ? "success" : ""}`}
              >
                {message}
              </p>
            )}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        <section className="profile-card">
          <h2 className="profile-section-title">Order History</h2>
          {orders.length === 0 ? (
            <p className="no-orders">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <span>#{order.id}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span
                    className={`order-status order-status--${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                  <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
                <ul className="order-items-list">
                  {order.OrderItems?.map((item) => (
                    <li key={item.id}>
                      {item.Product?.name ?? "Deleted product"} ×{" "}
                      {item.quantity} @ $
                      {parseFloat(item.priceAtPurchase).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
