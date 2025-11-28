import { useEffect, useState } from "react";
import api from '../src/api';

const STATUS_OPTIONS = [
  { value: "Received", emoji: "📥", color: "#3b82f6" },
  { value: "In Progress", emoji: "⚙️", color: "#f59e0b" },
  { value: "Completed", emoji: "✅", color: "#10b981" },
  { value: "Delivered", emoji: "🚚", color: "#8b5cf6" },
  { value: "Cancelled", emoji: "❌", color: "#ef4444" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState(null);

  async function fetchOrders() {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.data || []);
    } catch {
      setMsg({ type: "error", text: "Failed to load orders" });
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setMsg({ type: "success", text: "Status updated successfully!" });
      fetchOrders();
    } catch {
      setMsg({ type: "error", text: "Failed to update status" });
    }
  }

  useEffect(() => {
    let isMounted = true;
    
    async function loadOrders() {
      try {
        const res = await api.get("/orders");
        if (isMounted) {
          setOrders(res.data.data || []);
        }
      } catch {
        if (isMounted) {
          setMsg({ type: "error", text: "Failed to load orders" });
        }
      }
    }
    
    loadOrders();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusStyle = (status) => {
    const statusObj = STATUS_OPTIONS.find(s => s.value === status);
    return statusObj || STATUS_OPTIONS[0];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">
          📋 Orders
        </h2>
        <div className="text-sm text-slate-400">
          Total: {orders.length}
        </div>
      </div>

      {msg && (
        <div className={msg.type === 'success' ? 'alert alert-success' : 'alert alert-error'}>
          {msg.text}
        </div>
      )}

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">📦</div>
            <p>No orders yet. Create your first order!</p>
          </div>
        ) : (
          orders.map((o) => {
            const statusStyle = getStatusStyle(o.status);
            return (
              <div
                key={o.id}
                className="order-card bg-slate-800 border border-slate-700 rounded-xl p-5 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-slate-100">
                        {o.service_name}
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-400">
                        ×{o.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-slate-400">
                      <div>👤 {o.customer_name}</div>
                      <div>🕒 {new Date(o.created_date).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
                      background: `${statusStyle.color}20`,
                      border: `1px solid ${statusStyle.color}40`
                    }}>
                      <span>{statusStyle.emoji}</span>
                      <span className="font-medium text-sm" style={{ color: statusStyle.color }}>
                        {o.status}
                      </span>
                    </div>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="status-select px-3 py-2 rounded-lg text-sm min-w-[140px]"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.emoji} {s.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
