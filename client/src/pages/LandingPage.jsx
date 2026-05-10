import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("/categories")
      .then((res) => setCategories(res.data.result || []))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            FORGE YOUR <span>STRENGTH</span>
          </h1>
          <p className="hero-subtitle">
            Premium gym equipment for athletes who demand more.
          </p>
          <button
            className="hero-cta btn-primary"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
      </section>

      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/products?categoryId=${cat.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
