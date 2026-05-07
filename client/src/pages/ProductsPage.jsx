import { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = { page, limit };
        if (search) params.search = search;
        if (categoryId) params.categoryId = categoryId;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;

        const res = await axios.get("/products", { params });
        console.log(res.data);
        setProducts(res.data.result.rows);
        setTotalPages(res.data.result.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [search, categoryId, minPrice, maxPrice, sortBy, sortOrder, page]);

  useEffect(() => {
    axios
      .get("/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  return (
    <div className="products-page">
      <div className="products-header">
        <input
          type="text"
          className="search-bar"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <div className="products-layout">
        <aside className="filters-sidebar">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="filter-price-row">
              <input
                className="filter-input"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <input
                className="filter-input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              className="filter-select"
              value={`${sortBy}__${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("__");
                setSortBy(field);
                setSortOrder(order);
                setPage(1);
              }}
            >
              <option value="name__ASC">Name A–Z</option>
              <option value="name__DESC">Name Z–A</option>
              <option value="price__ASC">Price Low–High</option>
              <option value="price__DESC">Price High–Low</option>
            </select>
          </div>
        </aside>
        <main className="products-grid">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </main>
      </div>
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="pagination-info">
          Page {page} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}
