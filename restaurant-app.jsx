import { useState, useEffect, useCallback } from "react";

// ─── Firebase SDK (loaded via CDN in index.html) ───────────────────────────
// This app uses Firebase Firestore directly from the client.
// Replace the firebaseConfig below with your own project credentials.

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// ─── Cloudinary / image upload placeholder ────────────────────────────────
// For real image uploads, use Cloudinary or Firebase Storage.
// Here we store image as a URL string entered by the owner.

// ═══════════════════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════════════════
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #FDFAF4;
    --warm-white: #FFF8EE;
    --charcoal: #1C1C1C;
    --ink: #2E2A25;
    --muted: #6B6560;
    --border: #E8E0D4;
    --accent: #C4622D;
    --accent-light: #F5EBE3;
    --accent-dark: #9E4C21;
    --green: #2D6A4F;
    --green-light: #D8F3E3;
    --red: #9B2335;
    --red-light: #F9E5E8;
    --amber: #B45309;
    --amber-light: #FEF3C7;
    --shadow-sm: 0 1px 3px rgba(28,28,28,0.08);
    --shadow-md: 0 4px 16px rgba(28,28,28,0.10);
    --shadow-lg: 0 8px 32px rgba(28,28,28,0.14);
    --radius: 12px;
    --radius-sm: 8px;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
  }

  body {
    font-family: var(--font-body);
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
    font-size: 15px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ── */
  .app { max-width: 480px; margin: 0 auto; min-height: 100vh; }
  .page { padding: 0 0 80px; animation: fadeUp 0.3s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

  /* ── Header ── */
  .header {
    background: var(--charcoal);
    color: #fff;
    padding: 20px 20px 16px;
    position: sticky; top: 0; z-index: 100;
  }
  .header-inner { display: flex; align-items: center; justify-content: space-between; }
  .header h1 { font-family: var(--font-display); font-size: 22px; color: #fff; letter-spacing: -0.3px; }
  .header .sub { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 2px; }
  .header-actions { display: flex; gap: 8px; align-items: center; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 18px; border-radius: var(--radius-sm);
    font-family: var(--font-body); font-size: 14px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.15s ease;
    white-space: nowrap;
  }
  .btn:active { transform: scale(0.97); }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent-dark); }
  .btn-secondary { background: transparent; color: var(--ink); border: 1.5px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-ghost { background: transparent; color: rgba(255,255,255,0.8); padding: 6px 10px; font-size: 13px; }
  .btn-ghost:hover { color: #fff; }
  .btn-danger { background: var(--red-light); color: var(--red); border: 1px solid transparent; }
  .btn-danger:hover { background: var(--red); color: #fff; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }
  .btn-full { width: 100%; }
  .btn-icon { width: 36px; height: 36px; padding: 0; border-radius: 50%; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Forms ── */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 500; color: var(--muted); margin-bottom: 6px; letter-spacing: 0.3px; }
  .form-input {
    width: 100%; padding: 11px 14px; border-radius: var(--radius-sm);
    border: 1.5px solid var(--border); background: #fff;
    font-family: var(--font-body); font-size: 15px; color: var(--ink);
    transition: border-color 0.15s;
    outline: none;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: #C5BDB4; }
  textarea.form-input { resize: vertical; min-height: 80px; }

  /* ── Cards ── */
  .card {
    background: #fff; border-radius: var(--radius);
    border: 1px solid var(--border); overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s;
  }
  .card:hover { box-shadow: var(--shadow-md); }
  .card-body { padding: 16px; }

  /* ── Menu item card ── */
  .menu-card { display: flex; gap: 14px; align-items: flex-start; }
  .menu-card-img {
    width: 80px; height: 80px; border-radius: var(--radius-sm);
    object-fit: cover; flex-shrink: 0; background: var(--accent-light);
  }
  .menu-card-img-placeholder {
    width: 80px; height: 80px; border-radius: var(--radius-sm);
    background: var(--accent-light); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; color: var(--accent);
  }
  .menu-card-info { flex: 1; min-width: 0; }
  .menu-card-name { font-weight: 600; font-size: 15px; color: var(--ink); margin-bottom: 3px; }
  .menu-card-desc { font-size: 13px; color: var(--muted); margin-bottom: 6px; line-height: 1.4; }
  .menu-card-price { font-weight: 600; color: var(--accent); font-size: 16px; }
  .menu-card-category {
    display: inline-block; font-size: 11px; padding: 2px 8px;
    background: var(--amber-light); color: var(--amber); border-radius: 20px; margin-bottom: 6px; font-weight: 500;
  }
  .menu-card-actions { display: flex; gap: 6px; margin-top: 8px; }

  /* ── Section headers ── */
  .section { padding: 20px; }
  .section-title { font-family: var(--font-display); font-size: 20px; margin-bottom: 16px; }
  .section-label { font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }

  /* ── Auth page ── */
  .auth-wrap { min-height: 100vh; display: flex; flex-direction: column; }
  .auth-hero { background: var(--charcoal); padding: 48px 28px 32px; text-align: center; }
  .auth-hero h1 { font-family: var(--font-display); font-size: 32px; color: #fff; margin-bottom: 8px; }
  .auth-hero p { color: rgba(255,255,255,0.55); font-size: 15px; }
  .auth-form { flex: 1; background: #fff; padding: 28px 24px; }
  .auth-tab { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
  .auth-tab-btn {
    flex: 1; padding: 10px; text-align: center; font-size: 14px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: var(--muted);
    border-bottom: 2.5px solid transparent; transition: all 0.15s; margin-bottom: -1px;
  }
  .auth-tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
  .auth-note { font-size: 13px; color: var(--muted); text-align: center; margin-top: 16px; }

  /* ── Dashboard stats ── */
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .stat-card { background: #fff; border-radius: var(--radius); padding: 16px; border: 1px solid var(--border); }
  .stat-card .stat-val { font-size: 26px; font-weight: 700; color: var(--ink); margin-bottom: 2px; font-family: var(--font-display); }
  .stat-card .stat-label { font-size: 12px; color: var(--muted); font-weight: 500; }
  .stat-card.accent { background: var(--charcoal); border-color: transparent; }
  .stat-card.accent .stat-val { color: #fff; }
  .stat-card.accent .stat-label { color: rgba(255,255,255,0.5); }

  /* ── Orders ── */
  .order-card { margin-bottom: 12px; }
  .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .order-id { font-size: 13px; font-weight: 600; color: var(--ink); }
  .order-time { font-size: 12px; color: var(--muted); }
  .order-items { font-size: 14px; color: var(--muted); margin-bottom: 10px; }
  .order-footer { display: flex; justify-content: space-between; align-items: center; }
  .order-total { font-weight: 700; font-size: 16px; color: var(--ink); }
  .status-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
  }
  .status-pending { background: var(--amber-light); color: var(--amber); }
  .status-preparing { background: #EDE9FE; color: #6D28D9; }
  .status-ready { background: var(--green-light); color: var(--green); }
  .status-completed { background: #F0F0F0; color: #666; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  /* ── Customer Cart ── */
  .cart-bar {
    position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto;
    background: var(--charcoal); padding: 12px 20px;
    display: flex; align-items: center; justify-content: space-between;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .cart-bar-text { color: #fff; }
  .cart-bar-count { font-size: 13px; color: rgba(255,255,255,0.55); }
  .cart-bar-total { font-size: 18px; font-weight: 700; color: #fff; }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .modal {
    background: #fff; border-radius: var(--radius) var(--radius) 0 0;
    width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
    padding: 24px; animation: slideUp 0.25s ease;
  }
  .modal-title { font-family: var(--font-display); font-size: 20px; margin-bottom: 20px; }
  .modal-close { float: right; background: none; border: none; font-size: 22px; cursor: pointer; color: var(--muted); margin-top: -4px; }

  /* ── Cart items in modal ── */
  .cart-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .cart-item:last-child { border-bottom: none; }
  .cart-item-name { flex: 1; font-size: 14px; font-weight: 500; }
  .cart-item-price { font-size: 14px; color: var(--muted); min-width: 60px; text-align: right; }
  .qty-ctrl { display: flex; align-items: center; gap: 8px; }
  .qty-btn {
    width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--border);
    background: #fff; cursor: pointer; font-size: 16px; font-weight: 500;
    display: flex; align-items: center; justify-content: center; color: var(--ink);
    transition: all 0.12s;
  }
  .qty-btn:hover { border-color: var(--accent); color: var(--accent); }
  .qty-num { font-size: 15px; font-weight: 600; min-width: 20px; text-align: center; }

  /* ── Table input ── */
  .table-input-wrap { background: var(--accent-light); padding: 16px 20px; margin-bottom: 0; }
  .table-input-wrap .form-input { max-width: 160px; }

  /* ── Success screen ── */
  .success-wrap { text-align: center; padding: 60px 24px; }
  .success-icon { font-size: 56px; margin-bottom: 16px; }
  .success-wrap h2 { font-family: var(--font-display); font-size: 26px; margin-bottom: 8px; }
  .success-wrap p { color: var(--muted); font-size: 15px; }

  /* ── Nav tabs ── */
  .nav-tabs { display: flex; background: #fff; border-bottom: 1px solid var(--border); }
  .nav-tab {
    flex: 1; padding: 13px 8px; text-align: center; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: var(--muted);
    border-bottom: 2.5px solid transparent; transition: all 0.15s; margin-bottom: -1px;
  }
  .nav-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* ── Misc ── */
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .empty-state { text-align: center; padding: 48px 24px; color: var(--muted); }
  .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
  .gap-y > * + * { margin-top: 12px; }
  .text-muted { color: var(--muted); }
  .text-accent { color: var(--accent); }
  .fw-600 { font-weight: 600; }
  .mt-4 { margin-top: 4px; }
  .mt-8 { margin-top: 8px; }
  .mt-16 { margin-top: 16px; }
  .error-msg { font-size: 13px; color: var(--red); margin-top: 6px; }
  .alert { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 14px; margin-bottom: 16px; }
  .alert-error { background: var(--red-light); color: var(--red); }
  .alert-success { background: var(--green-light); color: var(--green); }
  .spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .share-bar { background: var(--accent-light); border: 1px dashed var(--accent); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 13px; }
  .share-bar code { font-size: 12px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; word-break: break-all; }
`;

// ═══════════════════════════════════════════════════════════════════════════
//  FIREBASE HOOKS (simulated with localStorage for demo)
// ═══════════════════════════════════════════════════════════════════════════
// In production, replace these with real Firebase SDK calls.
// The architecture mirrors Firebase's API exactly — swap db.collection() etc.

const DB_KEYS = {
  users: "resto_users",
  menus: "resto_menu_",
  orders: "resto_orders_",
  session: "resto_session",
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function now() {
  return new Date().toISOString();
}

function useLocalDB() {
  const getUsers = () => JSON.parse(localStorage.getItem(DB_KEYS.users) || "{}");
  const saveUsers = (u) => localStorage.setItem(DB_KEYS.users, JSON.stringify(u));

  const getMenu = (uid) => JSON.parse(localStorage.getItem(DB_KEYS.menus + uid) || "[]");
  const saveMenu = (uid, m) => localStorage.setItem(DB_KEYS.menus + uid, JSON.stringify(m));

  const getOrders = (uid) => JSON.parse(localStorage.getItem(DB_KEYS.orders + uid) || "[]");
  const saveOrders = (uid, o) => localStorage.setItem(DB_KEYS.orders + uid, JSON.stringify(o));

  const getSession = () => JSON.parse(localStorage.getItem(DB_KEYS.session) || "null");
  const setSession = (u) => localStorage.setItem(DB_KEYS.session, JSON.stringify(u));
  const clearSession = () => localStorage.removeItem(DB_KEYS.session);

  return { getUsers, saveUsers, getMenu, saveMenu, getOrders, saveOrders, getSession, setSession, clearSession };
}

// ═══════════════════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ── Auth ────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", restaurant: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const db = useLocalDB();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const users = db.getUsers();

    if (tab === "signup") {
      if (!form.name || !form.email || !form.password || !form.restaurant) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
      }
      if (users[form.email]) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }
      const user = { id: genId(), name: form.name, email: form.email, password: form.password, restaurant: form.restaurant, createdAt: now() };
      users[form.email] = user;
      db.saveUsers(users);
      db.setSession(user);
      onLogin(user);
    } else {
      if (!form.email || !form.password) {
        setError("Please enter your email and password.");
        setLoading(false);
        return;
      }
      const user = users[form.email];
      if (!user || user.password !== form.password) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      db.setSession(user);
      onLogin(user);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <h1>TableFlow</h1>
        <p>Smart ordering for modern restaurants</p>
      </div>
      <div className="auth-form">
        <div className="auth-tab">
          <button className={`auth-tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
          <button className={`auth-tab-btn ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>Create Account</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {tab === "signup" && (
          <>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input className="form-input" placeholder="John Smith" value={form.name} onChange={set("name")} />
            </div>
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input className="form-input" placeholder="The Golden Fork" value={form.restaurant} onChange={set("restaurant")} />
            </div>
          </>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="owner@restaurant.com" value={form.email} onChange={set("email")} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        </div>
        <button className="btn btn-primary btn-full" onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : tab === "signup" ? "Create Account" : "Sign In"}
        </button>
        <p className="auth-note">
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); }}>
            {tab === "login" ? "Sign up free" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Add / Edit Menu Item Modal ───────────────────────────────────────────────
function MenuItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: "", description: "", price: "", category: "Main", imageUrl: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const CATEGORIES = ["Starter", "Main", "Sides", "Dessert", "Drinks", "Special"];

  const save = () => {
    if (!form.name || !form.price) { setError("Name and price are required."); return; }
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) { setError("Enter a valid price."); return; }
    onSave({ ...form, price: parseFloat(form.price).toFixed(2) });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{item ? "Edit Item" : "Add Menu Item"}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Item Name *</label>
          <input className="form-input" placeholder="e.g. Grilled Salmon" value={form.name} onChange={set("name")} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" placeholder="Short description..." value={form.description} onChange={set("description")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="form-group">
            <label className="form-label">Price ($) *</label>
            <input className="form-input" type="number" min="0" step="0.01" placeholder="12.99" value={form.price} onChange={set("price")} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Image URL (optional)</label>
          <input className="form-input" placeholder="https://images.unsplash.com/..." value={form.imageUrl} onChange={set("imageUrl")} />
        </div>
        {form.imageUrl && (
          <div style={{ marginBottom: "16px" }}>
            <img src={form.imageUrl} alt="preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }} onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        )}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn btn-primary" onClick={save} style={{ flex: 2 }}>Save Item</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const db = useLocalDB();
  const [tab, setTab] = useState("menu");
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    setMenu(db.getMenu(user.id));
    setOrders(db.getOrders(user.id));
  }, [user.id]);

  const refreshOrders = () => setOrders(db.getOrders(user.id));

  const saveItem = (item) => {
    const updated = editItem
      ? menu.map((m) => (m.id === editItem.id ? { ...item, id: editItem.id } : m))
      : [...menu, { ...item, id: genId(), createdAt: now() }];
    setMenu(updated);
    db.saveMenu(user.id, updated);
    setShowModal(false);
    setEditItem(null);
  };

  const deleteItem = (id) => {
    const updated = menu.filter((m) => m.id !== id);
    setMenu(updated);
    db.saveMenu(user.id, updated);
  };

  const updateOrderStatus = (orderId, status) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    db.saveOrders(user.id, updated);
  };

  const customerUrl = `${window.location.origin}${window.location.pathname}?restaurant=${user.id}`;
  const totalRevenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status !== "completed").length;

  const STATUS_FLOW = ["pending", "preparing", "ready", "completed"];

  return (
    <div className="page">
      <div className="header">
        <div className="header-inner">
          <div>
            <h1>{user.restaurant}</h1>
            <div className="sub">Owner dashboard</div>
          </div>
          <div className="header-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => { db.clearSession(); onLogout(); }}>Sign out</button>
          </div>
        </div>
      </div>

      <div className="nav-tabs">
        <button className={`nav-tab ${tab === "menu" ? "active" : ""}`} onClick={() => setTab("menu")}>Menu</button>
        <button className={`nav-tab ${tab === "orders" ? "active" : ""}`} onClick={() => { setTab("orders"); refreshOrders(); }}>Orders {pendingOrders > 0 && `(${pendingOrders})`}</button>
        <button className={`nav-tab ${tab === "share" ? "active" : ""}`} onClick={() => setTab("share")}>Share</button>
      </div>

      {tab === "menu" && (
        <div className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Menu Items</h2>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowModal(true); }}>+ Add Item</button>
          </div>
          {menu.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🍽️</div>
              <p className="fw-600">No items yet</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>Add your first menu item to get started.</p>
            </div>
          ) : (
            <div className="gap-y">
              {menu.map((item) => (
                <div key={item.id} className="card">
                  <div className="card-body">
                    <div className="menu-card">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="menu-card-img" onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <div className="menu-card-img-placeholder">🍴</div>
                      )}
                      <div className="menu-card-info">
                        <span className="menu-card-category">{item.category}</span>
                        <div className="menu-card-name">{item.name}</div>
                        {item.description && <div className="menu-card-desc">{item.description}</div>}
                        <div className="menu-card-price">${item.price}</div>
                        <div className="menu-card-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => { setEditItem(item); setShowModal(true); }}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="section">
          <div style={{ marginBottom: "20px" }}>
            <div className="stats-grid">
              <div className="stat-card accent">
                <div className="stat-val">{orders.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">${totalRevenue.toFixed(2)}</div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>
          </div>
          <h2 className="section-title">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <p className="fw-600">No orders yet</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>Orders from customers will appear here.</p>
            </div>
          ) : (
            <div className="gap-y">
              {[...orders].reverse().map((order) => (
                <div key={order.id} className="card order-card">
                  <div className="card-body">
                    <div className="order-header">
                      <div>
                        <div className="order-id">Table {order.table} · #{order.id.slice(-4).toUpperCase()}</div>
                        <div className="order-time">{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                      <span className={`status-badge status-${order.status}`}>
                        <span className="status-dot" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                    </div>
                    <div className="order-footer">
                      <div className="order-total">${order.total.toFixed(2)}</div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {STATUS_FLOW.indexOf(order.status) < STATUS_FLOW.length - 1 && (
                          <button className="btn btn-primary btn-sm" onClick={() => updateOrderStatus(order.id, STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1])}>
                            Mark {STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1].charAt(0).toUpperCase() + STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1].slice(1)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "share" && (
        <div className="section">
          <h2 className="section-title">Share Your Menu</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
            Share this link with your customers so they can view your menu and place orders.
          </p>
          <div className="share-bar">
            <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "6px", fontWeight: 500 }}>Customer Menu URL</div>
            <code>{customerUrl}</code>
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigator.clipboard.writeText(customerUrl).then(() => alert("Link copied!"))}>
              Copy Link
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => window.open(customerUrl, "_blank")}>
              Preview Menu
            </button>
          </div>
          <div className="divider" />
          <div style={{ background: "var(--accent-light)", borderRadius: "var(--radius-sm)", padding: "14px", fontSize: "13px", color: "var(--muted)" }}>
            <strong style={{ display: "block", marginBottom: "4px", color: "var(--ink)" }}>💡 How it works</strong>
            Customers open the link, browse your menu, and place an order with their table number. Orders appear in real-time on your Orders tab.
          </div>
        </div>
      )}

      {showModal && <MenuItemModal item={editItem} onSave={saveItem} onClose={() => { setShowModal(false); setEditItem(null); }} />}
    </div>
  );
}

// ── Customer Order Page ──────────────────────────────────────────────────────
function CustomerPage({ restaurantId }) {
  const db = useLocalDB();
  const users = db.getUsers();
  const owner = Object.values(users).find((u) => u.id === restaurantId);

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [table, setTable] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (owner) setMenu(db.getMenu(owner.id));
  }, [restaurantId]);

  if (!owner) return (
    <div className="empty-state" style={{ padding: "80px 24px" }}>
      <div className="icon">🔍</div>
      <p className="fw-600">Restaurant not found</p>
      <p style={{ fontSize: "13px", marginTop: "4px" }}>Check the link and try again.</p>
    </div>
  );

  const categories = ["All", ...new Set(menu.map((m) => m.category))];
  const filtered = selectedCategory === "All" ? menu : menu.filter((m) => m.category === selectedCategory);
  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => {
    const item = menu.find((m) => m.id === id);
    return { ...item, qty };
  });
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0);

  const adjust = (id, delta) => {
    setCart((c) => {
      const cur = c[id] || 0;
      const next = Math.max(0, cur + delta);
      return { ...c, [id]: next };
    });
  };

  const placeOrder = () => {
    if (!table.trim()) { alert("Please enter your table number."); return; }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    const order = { id: genId(), table, items: cartItems, total: cartTotal, status: "pending", createdAt: now() };
    const prev = db.getOrders(owner.id);
    db.saveOrders(owner.id, [...prev, order]);
    setOrderId(order.id);
    setOrdered(true);
    setShowCart(false);
  };

  if (ordered) return (
    <div className="page">
      <div className="header"><div className="header-inner"><h1>{owner.restaurant}</h1></div></div>
      <div className="success-wrap">
        <div className="success-icon">✅</div>
        <h2>Order Placed!</h2>
        <p>Your order #{orderId.slice(-4).toUpperCase()} has been received.<br />We'll have it ready soon.</p>
        <div style={{ marginTop: "32px", background: "var(--accent-light)", borderRadius: "var(--radius)", padding: "16px" }}>
          <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "8px" }}>Order Summary — Table {table}</div>
          {cartItems.map((i) => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "4px 0" }}>
              <span>{i.qty}× {i.name}</span>
              <span>${(parseFloat(i.price) * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "16px" }}>
            <span>Total</span><span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <button className="btn btn-secondary mt-16" onClick={() => { setOrdered(false); setCart({}); setTable(""); }}>Order Again</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="header">
        <div className="header-inner">
          <div>
            <h1>{owner.restaurant}</h1>
            <div className="sub">Browse menu & order</div>
          </div>
          {cartCount > 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowCart(true)}>
              Cart ({cartCount})
            </button>
          )}
        </div>
      </div>

      <div className="table-input-wrap">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: "var(--accent-dark)", fontWeight: 500, whiteSpace: "nowrap" }}>Your table #</span>
          <input className="form-input" placeholder="e.g. 5" value={table} onChange={(e) => setTable(e.target.value)} style={{ maxWidth: "120px" }} />
        </div>
      </div>

      {menu.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🍽️</div>
          <p className="fw-600">Menu coming soon</p>
        </div>
      ) : (
        <>
          <div style={{ padding: "12px 20px 0", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 14px", borderRadius: "20px", border: "1.5px solid",
                  borderColor: selectedCategory === cat ? "var(--accent)" : "var(--border)",
                  background: selectedCategory === cat ? "var(--accent)" : "#fff",
                  color: selectedCategory === cat ? "#fff" : "var(--muted)",
                  fontSize: "13px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                  fontFamily: "var(--font-body)",
                }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="section">
            <div className="gap-y">
              {filtered.map((item) => (
                <div key={item.id} className="card">
                  <div className="card-body">
                    <div className="menu-card">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="menu-card-img" onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <div className="menu-card-img-placeholder">🍴</div>
                      )}
                      <div className="menu-card-info">
                        <span className="menu-card-category">{item.category}</span>
                        <div className="menu-card-name">{item.name}</div>
                        {item.description && <div className="menu-card-desc">{item.description}</div>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                          <div className="menu-card-price">${item.price}</div>
                          <div className="qty-ctrl">
                            {(cart[item.id] || 0) > 0 ? (
                              <>
                                <button className="qty-btn" onClick={() => adjust(item.id, -1)}>−</button>
                                <span className="qty-num">{cart[item.id]}</span>
                                <button className="qty-btn" onClick={() => adjust(item.id, 1)}>+</button>
                              </>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => adjust(item.id, 1)}>Add</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {cartCount > 0 && !showCart && (
        <div className="cart-bar" onClick={() => setShowCart(true)} style={{ cursor: "pointer" }}>
          <div className="cart-bar-text">
            <div className="cart-bar-count">{cartCount} item{cartCount !== 1 ? "s" : ""}</div>
            <div className="cart-bar-total">${cartTotal.toFixed(2)}</div>
          </div>
          <button className="btn btn-primary">View Cart →</button>
        </div>
      )}

      {showCart && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCart(false)}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowCart(false)}>×</button>
            <h2 className="modal-title">Your Order</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-name">{item.name}</div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => adjust(item.id, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => adjust(item.id, 1)}>+</button>
                </div>
                <div className="cart-item-price">${(parseFloat(item.price) * item.qty).toFixed(2)}</div>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "17px", marginBottom: "20px" }}>
              <span>Total</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Table Number</label>
              <input className="form-input" placeholder="Enter your table number" value={table} onChange={(e) => setTable(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-full" onClick={placeOrder}>
              Place Order · ${cartTotal.toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const db = useLocalDB();
  const params = new URLSearchParams(window.location.search);
  const restaurantId = params.get("restaurant");

  const [user, setUser] = useState(() => db.getSession());

  if (restaurantId) return (
    <>
      <style>{css}</style>
      <div className="app"><CustomerPage restaurantId={restaurantId} /></div>
    </>
  );

  if (!user) return (
    <>
      <style>{css}</style>
      <div className="app"><AuthPage onLogin={(u) => setUser(u)} /></div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app"><Dashboard user={user} onLogout={() => setUser(null)} /></div>
    </>
  );
}
