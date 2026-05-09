import { useState, useEffect } from "react";
import axios from "../../api/axios";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  categoryId: "",
  imageUrl: "",
};

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  async function fetchProducts() {
    try {
      const res = await axios.get("/products");
      setProducts(res.data.result.rows);
    } catch {
      // Ignorise
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.result || []);
    } catch (err) {
      console.error("fetchCategories failed:", err);
    }
  }

  useEffect(() => {
    fetchProducts();

    fetchCategories();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleNew() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || "",
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit() {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        categoryId: Number(form.categoryId),
      };

      if (editingProduct) {
        await axios.put(`/products/${editingProduct.id}`, payload);
      } else {
        await axios.post("/products", payload);
      }

      setShowForm(false);
      setForm(EMPTY_FORM);
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="tab-header">
        <h2>Products</h2>
        <button onClick={handleNew}>+ New Product</button>
      </div>

      {showForm && (
        <div className="admin-form">
          <label>Product name</label>
          <input name="name" value={form.name} onChange={handleChange} />
          <label>Product description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <label>Product price</label>
          <input name="price" value={form.price} onChange={handleChange} />
          <label>Product stock quantity</label>
          <input
            name="stockQuantity"
            value={form.stockQuantity}
            onChange={handleChange}
          />
          <label>Product category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <label>Product image</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
          {error && <p className="form-error">{error}</p>}
          <button onClick={handleSubmit}>
            {editingProduct ? "Save Changes" : "Create Product"}
          </button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.Category?.name}</td>
              <td>{p.price}</td>
              <td>{p.stockQuantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
