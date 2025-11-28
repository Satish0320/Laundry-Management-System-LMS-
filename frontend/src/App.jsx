import { useState } from "react";
import Customers from "../components/Customers.jsx";
import CreateOrder from "../components/CreateOrder.jsx";
import Orders from "../components/Orders.jsx";

export default function App() {
  const [view, setView] = useState("customers");

  return (
    <div className="min-h-screen body-bg">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-10">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-100">
              Laundry Management
            </h1>
          </div>

          <nav className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            <button
              onClick={() => setView("customers")}
              className={`px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all hover:shadow-md ${
                view === "customers"
                  ? "bg-accent text-white shadow-lg scale-105"
                  : "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              👥 Customers
            </button>

            <button
              onClick={() => setView("create-order")}
              className={`px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all hover:shadow-md ${
                view === "create-order"
                  ? "bg-accent text-white shadow-lg scale-105"
                  : "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              ➕ Create Order
            </button>

            <button
              onClick={() => setView("orders")}
              className={`px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all hover:shadow-md ${
                view === "orders"
                  ? "bg-accent text-white shadow-lg scale-105"
                  : "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              📋 Orders
            </button>
          </nav>
        </header>

        <main className="card">
          {view === "customers" && <Customers />}
          {view === "create-order" && <CreateOrder />}
          {view === "orders" && <Orders />}
        </main>
      </div>
    </div>
  );
}
