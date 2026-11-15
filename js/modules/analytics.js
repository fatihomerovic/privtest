const Analytics = Altasera.modules.analytics = {};
Analytics.charts = {}; Analytics.drawers = [];
Analytics.data = () => ({ tasks: Store.get('tasks', []), ses: Store.get('sessions', []), subj: Store.get('subjects', []) });
Analytics.init = function () {
  $('#view-analytics').innerHTML = '<h2>Analitika</h2><div class="grid stats" id="a-stats"></div><div class="grid two" id="a-charts"></div>';
};
Analytics.render = function () {
  const { tasks, ses } = Analytics.data();
  const done = tasks.filter(t => t.status === 'Done').length, mins = ses.reduce((a, s) => a + s.minutes, 0);
  $('#a-stats').innerHTML = [['Završeni zadaci', done], ['Aktivni zadaci', tasks.length - done], ['Vrijeme učenja', (mins / 60).toFixed(1) + ' h'], ['Fokus sesije', ses.length]]
    .map(([l, v]) => `<div class="card stat"><span class="muted">${l}</span><b>${v}</b></div>`).join('');
  if (typeof Chart === 'undefined') { $('#a-charts').innerHTML = '<p class="muted">Chart.js nije učitan (provjeri internet vezu).</p>'; return; }
  Analytics.drawers.forEach(f => f(Analytics.data()));
};
// Kreira ili osvježava jedan graf unutar kartice
Analytics.chart = (id, title, cfg) => {
  let c = $('#' + id);
  if (!c) { $('#a-charts').insertAdjacentHTML('beforeend', `<div class="card"><h3>${title}</h3><canvas id="${id}" height="200"></canvas></div>`); c = $('#' + id); }
  if (Analytics.charts[id]) Analytics.charts[id].destroy();
  Analytics.charts[id] = new Chart(c, cfg);
};
Analytics.drawers.push(({ ses }) => {
  const days = [...Array(7)].map((_, k) => { const d = new Date(); d.setDate(d.getDate() - 6 + k); return d; });
  Analytics.chart('ch-week', 'Minute učenja (zadnjih 7 dana)', {
    type: 'bar',
    data: { labels: days.map(d => d.toLocaleDateString('bs', { weekday: 'short' })), datasets: [{ data: days.map(d => ses.filter(s => s.date === dateKey(d)).reduce((a, s) => a + s.minutes, 0)), backgroundColor: '#8B5CF6', borderRadius: 6 }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
});
Analytics.drawers.push(({ tasks }) => {
  const st = ['Todo', 'In Progress', 'Done'];
  Analytics.chart('ch-status', 'Zadaci po statusu', {
    type: 'doughnut',
    data: { labels: st, datasets: [{ data: st.map(s => tasks.filter(t => t.status === s).length), backgroundColor: ['#6B7280', '#8B5CF6', '#34D399'], borderWidth: 0 }] },
    options: { cutout: '65%' }
  });
});
