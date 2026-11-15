const Store = {
  get(k, d) { try { const v = localStorage.getItem('altasera_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { localStorage.setItem('altasera_' + k, JSON.stringify(v)); },
  uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
};
