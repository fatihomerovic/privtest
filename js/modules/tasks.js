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
Tasks.add = function () {
  if (!$('#t-title').value.trim()) return toast('Unesi naziv zadatka');
  const l = Tasks.all();
  l.push({ id: Store.uid(), title: $('#t-title').value.trim(), due: $('#t-due').value, prio: $('#t-prio').value, status: 'Todo', subject: ($('#t-subj') || {}).value || '', created: Date.now() });
  Tasks.save(l); $('#task-form').reset(); Tasks.render(); toast('Zadatak dodan');
};
Tasks.update = (id, patch) => { Tasks.save(Tasks.all().map(t => t.id === id ? { ...t, ...patch } : t)); Tasks.render(); };
Tasks.actions.done = id => { const t = Tasks.all().find(x => x.id === id); Tasks.update(id, { status: t.status === 'Done' ? 'Todo' : 'Done' }); };
Tasks.actions.del = id => { Tasks.save(Tasks.all().filter(t => t.id !== id)); Tasks.render(); toast('Zadatak obrisan'); };
Tasks.rowExtras.push(t => `<button class="btn ghost" data-act="done" data-id="${t.id}" title="Završi">${t.status === 'Done' ? '↩' : '✓'}</button><button class="btn ghost" data-act="del" data-id="${t.id}" title="Obriši">✕</button>`);
Tasks.actions.edit = id => {
  const t = Tasks.all().find(x => x.id === id); const n = prompt('Izmijeni zadatak', t.title);
  if (n && n.trim()) { Tasks.update(id, { title: n.trim() }); toast('Zadatak izmijenjen'); }
};
Tasks.rowExtras.unshift(t => `<button class="btn ghost" data-act="edit" data-id="${t.id}" title="Uredi">✎</button>`);
Tasks.rowExtras.unshift(t => `<span class="badge p-${t.prio}">${t.prio}</span>${t.due ? `<span class="muted small">${t.due}</span>` : ''}`);
Tasks.next = { 'Todo': 'In Progress', 'In Progress': 'Done', 'Done': 'Todo' };
Tasks.actions.status = id => { const t = Tasks.all().find(x => x.id === id); Tasks.update(id, { status: Tasks.next[t.status] }); };
Tasks.rowExtras.unshift(t => `<button class="badge st" data-act="status" data-id="${t.id}" title="Promijeni status">${t.status}</button>`);
Tasks.toolbars.push(() => '<input data-k="q" class="grow" placeholder="Pretraži zadatke...">');
Tasks.filterFns.push(t => t.title.toLowerCase().includes(Tasks.state.q.toLowerCase()));
Tasks.toolbars.push(() => '<select data-k="status"><option value="all">Svi statusi</option><option>Todo</option><option>In Progress</option><option>Done</option></select><select data-k="prio"><option value="all">Svi prioriteti</option><option>Low</option><option>Medium</option><option>High</option></select>');
Tasks.filterFns.push(t => Tasks.state.status === 'all' || t.status === Tasks.state.status);
Tasks.filterFns.push(t => Tasks.state.prio === 'all' || t.prio === Tasks.state.prio);
Tasks.subjOpts = () => '<option value="">Predmet</option>' + Store.get('subjects', []).map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
Tasks.formExtras.push(() => `<select id="t-subj">${Tasks.subjOpts()}</select>`);
Tasks.rowExtras.push(t => { const s = Store.get('subjects', []).find(x => x.id === t.subject); return s ? `<span class="chip" style="--c:${esc(s.color)}">${esc(s.name)}</span>` : ''; });
{ const r = Tasks.render; Tasks.render = function () { const sel = $('#t-subj'); if (sel) { const v = sel.value; sel.innerHTML = Tasks.subjOpts(); sel.value = v; } r(); }; }
