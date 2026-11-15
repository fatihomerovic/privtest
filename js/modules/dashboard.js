const Dashboard = Altasera.modules.dashboard = {};
Dashboard.init = function () {
  $('#view-dashboard').innerHTML = `
    <h1>Dobrodošao u <span class="grad">Altasera</span></h1>
    <p class="muted" style="margin-bottom:20px">Per aspera ad astra — kroz trnje do zvijezda.</p>
    <div class="grid stats" id="d-stats"></div>
    <div class="grid two">
      <div class="card"><h3>Današnji zadaci</h3><ul class="list" id="d-today"></ul></div>
      <div class="card"><h3>Sedmična aktivnost (min učenja)</h3><div class="bars" id="d-week"></div></div>
    </div>
    <div class="card"><h3>Nadolazeći rokovi</h3><ul class="list" id="d-due"></ul></div>`;
};
Dashboard.render = function () {
  const tasks = Store.get('tasks', []), ses = Store.get('sessions', []), today = todayStr();
  const done = tasks.filter(t => t.status === 'Done').length;
  const mins = ses.reduce((a, s) => a + s.minutes, 0);
  const stats = [['Ukupno zadataka', tasks.length], ['Završeno', done], ['Sati učenja', (mins / 60).toFixed(1)],
    ['Produktivnost', (tasks.length ? Math.round(done / tasks.length * 100) : 0) + '%']];
  $('#d-stats').innerHTML = stats.map(([l, v]) => `<div class="card stat"><span class="muted">${l}</span><b>${v}</b></div>`).join('');
  const open = tasks.filter(t => t.status !== 'Done');
  const li = t => `<li class="item"><span class="grow">${esc(t.title)}</span><span class="muted small">${t.due || ''}</span></li>`;
  $('#d-today').innerHTML = open.filter(t => t.due === today).map(li).join('') || '<li class="muted">Ništa za danas ✨</li>';
  $('#d-due').innerHTML = open.filter(t => t.due > today).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5).map(li).join('') || '<li class="muted">Nema nadolazećih rokova.</li>';
  const days = [...Array(7)].map((_, k) => {
    const d = new Date(); d.setDate(d.getDate() - 6 + k); const key = dateKey(d);
    return { l: d.toLocaleDateString('bs', { weekday: 'short' }), m: ses.filter(s => s.date === key).reduce((a, s) => a + s.minutes, 0) };
  });
  const max = Math.max(60, ...days.map(d => d.m));
  $('#d-week').innerHTML = days.map(d => `<div><i style="height:${d.m / max * 100}%" title="${d.m} min"></i><small class="muted">${d.l}</small></div>`).join('');
};
