const Tasks = Altasera.modules.tasks = {};
// Tačke za proširenje (hooks) — kasniji commitovi ih popunjavaju
Tasks.state = { q: '', status: 'all', prio: 'all' };
Tasks.filterFns = []; Tasks.rowExtras = []; Tasks.formExtras = []; Tasks.toolbars = []; Tasks.actions = {};
Tasks.all = () => Store.get('tasks', []);
Tasks.save = l => Store.set('tasks', l);
Tasks.row = t => `<li class="item ${t.status === 'Done' ? 'done' : ''}" data-id="${t.id}"><span class="grow">${esc(t.title)}</span>${Tasks.rowExtras.map(f => f(t)).join('')}</li>`;
Tasks.init = function () {
  $('#view-tasks').innerHTML = `<h2>Zadaci</h2>
    <form id="task-form" class="card row"><input id="t-title" class="grow" placeholder="Novi zadatak" required><input id="t-due" type="date"><select id="t-prio"><option>Low</option><option selected>Medium</option><option>High</option></select>${Tasks.formExtras.map(f => f()).join('')}<button class="btn">Dodaj</button></form>
    <div id="task-tools" class="row">${Tasks.toolbars.map(f => f()).join('')}</div><ul id="task-list" class="list"></ul>`;
  $('#task-form').onsubmit = e => { e.preventDefault(); Tasks.add && Tasks.add(); };
  $('#task-tools').oninput = e => { const k = e.target.dataset.k; if (k) { Tasks.state[k] = e.target.value; Tasks.render(); } };
  $('#task-list').onclick = e => { const b = e.target.closest('[data-act]'); if (b && Tasks.actions[b.dataset.act]) Tasks.actions[b.dataset.act](b.dataset.id); };
};
Tasks.render = function () {
  const l = Tasks.all().filter(t => Tasks.filterFns.every(f => f(t)));
  $('#task-list').innerHTML = l.map(Tasks.row).join('') || '<li class="muted">Nema zadataka.</li>';
};
