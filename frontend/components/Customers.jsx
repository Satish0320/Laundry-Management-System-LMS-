import { useEffect, useState } from 'react';
import api from '../src/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name:'', phone:'', address:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchCustomers(); }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await api.get('/customers');
      setCustomers(res.data.data || []);
    } catch {
      setMsg({ type:'error', text: 'Failed to load customers' });
    } finally { setLoading(false); }
  }

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);

    if(!form.name.trim()) return setMsg({ type:'error', text:'Name is required' });
    if(!form.phone.trim()) return setMsg({ type:'error', text:'Phone is required' });

    try {
      setLoading(true);
      await api.post('/customers', form);
      setMsg({ type:'success', text: 'Customer added' });
      setForm({ name:'', phone:'', address:'' });
      fetchCustomers();
    } catch (err) {
      setMsg({ type:'error', text: err?.response?.data?.error || 'Failed to add customer' });
    } finally { setLoading(false); }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-100">
        👥 Customers
      </h2>

      {msg && (
        <div className={msg.type === 'success' ? 'alert alert-success' : 'alert alert-error'}>
          {msg.text}
        </div>
      )}

      <form className="grid gap-4 mb-8 p-6 rounded-xl bg-slate-800 border border-slate-700" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Name *
          </label>
          <input 
            name="name" 
            placeholder="Enter customer name" 
            value={form.name} 
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Phone *
          </label>
          <input 
            name="phone" 
            placeholder="Enter phone number" 
            value={form.phone} 
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Address (optional)
          </label>
          <input 
            name="address" 
            placeholder="Enter address" 
            value={form.address} 
            onChange={onChange}
          />
        </div>
        
        <div className="flex justify-end mt-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '⏳ Saving...' : '✓ Add Customer'}
          </button>
        </div>
      </form>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-100">
          All Customers ({customers.length})
        </h3>
      </div>

      <div className="grid gap-3">
        {customers.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No customers yet. Add your first customer above!</p>
          </div>
        ) : (
          customers.map(c => (
            <div key={c.id} className="customer-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1 text-slate-100">
                    {c.name}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>📞 {c.phone}</span>
                    {c.address && <span>📍 {c.address}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
