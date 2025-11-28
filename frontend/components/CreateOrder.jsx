import { useEffect, useState } from "react";
import api from "../src/api";

export default function CreateOrder() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    service_name: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data.data || []);
    } catch {
      setMsg({ type: "error", text: "Failed to load customers" });
    }
  }

  function onChange(e) {
    const val =
      e.target.name === "quantity" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);

    if (!form.customer_id)
      return setMsg({ type: "error", text: "Select a customer" });
    if (!form.service_name.trim())
      return setMsg({ type: "error", text: "Service name is required" });
    if (form.quantity <= 0)
      return setMsg({ type: "error", text: "Quantity must be greater than 0" });

    try {
      setLoading(true);
      await api.post("/orders", form);
      setMsg({ type: "success", text: "Order created successfully!" });
      setForm({ customer_id: "", service_name: "", quantity: 1 });
    } catch {
      setMsg({ type: "error", text: "Failed to create order" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-100">
        ➕ Create New Order
      </h2>

      {msg && (
        <div className={msg.type === "success" ? "alert alert-success" : "alert alert-error"}>
          {msg.text}
        </div>
      )}

      <form className="grid gap-5 p-6 rounded-xl bg-slate-800 border border-slate-700" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Customer *
          </label>
          <select
            name="customer_id"
            value={form.customer_id}
            onChange={onChange}
            required
            className="w-full"
          >
            <option value="">-- Select a customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.phone}
              </option>
            ))}
          </select>
          {customers.length === 0 && (
            <p className="text-xs mt-1 text-amber-500">
              ⚠️ No customers found. Add a customer first.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Service Name *
          </label>
          <input
            name="service_name"
            placeholder="e.g., Wash & Iron, Dry Clean"
            value={form.service_name}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Quantity *
          </label>
          <input
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={onChange}
            required
          />
        </div>

        <div className="flex justify-end mt-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "⏳ Creating..." : "✓ Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
