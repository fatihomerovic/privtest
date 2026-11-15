// Jezgro aplikacije: svaki modul se registrira u Altasera.modules i ima init() + render()
window.Altasera = {
  modules: {},
  views: ['dashboard', 'tasks', 'subjects', 'focus', 'notes', 'calendar', 'analytics', 'settings'],
  show(v) {
    if (!this.views.includes(v)) v = 'dashboard';
    document.querySelectorAll('.view').forEach(s => s.hidden = s.id !== 'view-' + v);
    document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('active', a.dataset.view === v));
    const m = this.modules[v]; if (m && m.render) m.render();
    document.body.classList.remove('nav-open');
  },
  start() {
    Object.values(this.modules).forEach(m => m.init && m.init());
    addEventListener('hashchange', () => this.show(location.hash.slice(1)));
    $('#menu-btn').onclick = () => document.body.classList.toggle('nav-open');
    $('#today').textContent = new Date().toLocaleDateString('bs', { weekday: 'long', day: 'numeric', month: 'long' });
    $('#top-search').onkeydown = e => {
      const t = this.modules.tasks;
      if (e.key !== 'Enter' || !t.state) return;
      t.state.q = e.target.value; location.hash = 'tasks';
      const i = $('#task-tools [data-k="q"]'); if (i) i.value = e.target.value; t.render();
    };
    this.show(location.hash.slice(1));
  }
};
addEventListener('DOMContentLoaded', () => Altasera.start());
