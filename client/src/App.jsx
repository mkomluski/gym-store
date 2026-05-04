import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<div>Products</div>} />
        <Route path="/products/:id" element={<div>Product Detail</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/cart" element={<div>Cart</div>} />
        <Route path="/orders" element={<div>Orders</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/order-confirmation" element={<div>Confirmation</div>} />
        <Route path="/admin" element={<div>Admin</div>} />
      </Routes>
    </>
  );
}

export default App;
