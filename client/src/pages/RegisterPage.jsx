import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/LoginRegister.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Enter a valid email.";
    if (!form.password) errors.password = "Password is required.";
    else if (form.password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (form.phone && !/^\+?[\d\s-]{7,15}$/.test(form.phone))
      errors.phone = "Enter a valid phone number.";
    return errors;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join IronForge today</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">First Name</label>
              <input
                className="auth-input"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
              />
              {fieldErrors.firstName && (
                <span className="field-error">{fieldErrors.firstName}</span>
              )}
            </div>
            <div className="auth-field">
              <label className="auth-label">Last Name</label>
              <input
                className="auth-input"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
              {fieldErrors.lastName && (
                <span className="field-error">{fieldErrors.lastName}</span>
              )}
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label">Phone</label>
            <input
              className="auth-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
            {fieldErrors.phone && (
              <span className="field-error">{fieldErrors.phone}</span>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label">Address</label>
            <input
              className="auth-input"
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main St, City"
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
