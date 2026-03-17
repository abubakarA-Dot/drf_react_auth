import { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";

const ICONS = {
  success: <svg viewBox="0 0 18 18" fill="none" width={18} height={18}><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  danger:  <svg viewBox="0 0 18 18" fill="none" width={18} height={18}><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="12.5" r="0.75" fill="currentColor"/></svg>,
  info:    <svg viewBox="0 0 18 18" fill="none" width={18} height={18}><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M9 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="5.5" r="0.75" fill="currentColor"/></svg>,
  warning: <svg viewBox="0 0 18 18" fill="none" width={18} height={18}><path d="M9 2L16.5 15H1.5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 7v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="12.5" r="0.75" fill="currentColor"/></svg>,
};

const STYLES = {
  success: { bg: "#E1F5EE", border: "#5DCAA5", color: "#085041", bar: "#1D9E75" },
  danger:  { bg: "#FCEBEB", border: "#F09595", color: "#791F1F", bar: "#E24B4A" },
  info:    { bg: "#E6F1FB", border: "#85B7EB", color: "#0C447C", bar: "#378ADD" },
  warning: { bg: "#FAEEDA", border: "#FAC775", color: "#633806", bar: "#EF9F27" },
};

const css = `
  @keyframes nmIn  { from { opacity:0; transform:translateX(36px) scale(.95) } to { opacity:1; transform:translateX(0) scale(1) } }
  @keyframes nmOut { from { opacity:1; transform:translateX(0) scale(1) } to { opacity:0; transform:translateX(36px) scale(.95) } }
  @keyframes nmBar { from { width:100% } to { width:0% } }
`;

function Toast({ id, type, message, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const s = STYLES[type];

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 220);
  }, [id, onDismiss]);

  useEffect(() => {
    const t = setTimeout(dismiss, 3000);
    return () => clearTimeout(t);
  }, [dismiss]);

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "12px 14px", borderRadius: 12, marginBottom: 10,
      border: `1.5px solid ${s.border}`,
      background: s.bg, color: s.color,
      fontSize: 13, lineHeight: 1.5, position: "relative", overflow: "hidden",
      animation: exiting
        ? "nmOut 0.22s cubic-bezier(0.4,0,1,1) both"
        : "nmIn 0.28s cubic-bezier(0.22,1,0.36,1) both",
      width: 300,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{ICONS[type]}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>{type}</p>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
      <button onClick={dismiss} style={{ background: "none", border: "none", cursor: "pointer", color: s.color, opacity: 0.45, flexShrink: 0, padding: 0, marginTop: 1 }}>
        <svg viewBox="0 0 12 12" fill="none" width={12} height={12}><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: s.bar, animation: "nmBar 3s linear both", borderRadius: "0 0 12px 12px" }} />
    </div>
  );
}

// ─── Singleton state ──────────────────────────────────────────────────────────
let _addToast = null;
const _queue = [];

function NotificationContainer() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((type, message) => {
    setToasts(prev => [...prev, { id: Date.now() + Math.random(), type, message }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    _addToast = add;

    // Drain anything that was queued before we were ready
    while (_queue.length > 0) {
      const { type, message } = _queue.shift();
      add(type, message);
    }

    return () => { _addToast = null; };
  }, [add]);

  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, pointerEvents: "none" }}>
      <style>{css}</style>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <Toast {...t} onDismiss={remove} />
        </div>
      ))}
    </div>
  );
}

// ─── Auto-mount once ──────────────────────────────────────────────────────────
function mountIfNeeded() {
  if (document.getElementById("__nm_root__")) return;
  const div = document.createElement("div");
  div.id = "__nm_root__";
  document.body.appendChild(div);
  createRoot(div).render(<NotificationContainer />);
}

// ─── Core dispatcher ──────────────────────────────────────────────────────────
function dispatch(type, message) {
  mountIfNeeded();
  if (_addToast) {
    // Component already mounted — call directly
    _addToast(type, message);
  } else {
    // Component still rendering — queue it for draining in useEffect
    _queue.push({ type, message });
  }
}

// ─── Static API ───────────────────────────────────────────────────────────────
const NotificationManager = {
  success: (message) => dispatch("success", message),
  danger:  (message) => dispatch("danger",  message),
  info:    (message) => dispatch("info",    message),
  warning: (message) => dispatch("warning", message),
};

export default NotificationManager;