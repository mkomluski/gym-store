import { useState } from "react";
import TransactionsTab from "../components/admin/TransactionsTab";
import OrdersTab from "../components/admin/OrdersTab";
import UsersTab from "../components/admin/UsersTab";
import "../styles/Admin.css";

export default function AdminDashboard() {
  const [tab, setTab] = useState("transactions");

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button
          className={tab === "transactions" ? "active" : ""}
          onClick={() => setTab("transactions")}
        >
          Transactions
        </button>
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={tab === "users" ? "active" : ""}
          onClick={() => setTab("users")}
        >
          Users
        </button>
      </div>

      <div className="admin-content">
        {tab === "transactions" && <TransactionsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "users" && <UsersTab />}
      </div>
    </div>
  );
}
