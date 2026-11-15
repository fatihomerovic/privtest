const Subjects = Altasera.modules.subjects = {};
Subjects.extras = [];
Subjects.all = () => Store.get('subjects', []);
Subjects.init = function () {
  $('#view-subjects').innerHTML = `<h2>Predmeti</h2>
    <form id="subj-form" class="card row"><input id="s-name" class="grow" placeholder="Naziv predmeta" required><input id="s-color" type="color" value="#8b5cf6"><button class="btn">Dodaj</button></form>
    <div id="subj-list" class="grid"></div>`;
  $('#subj-form').onsubmit = e => {
    e.preventDefault(); if (!$('#s-name').value.trim()) return toast('Unesi naziv predmeta'); const l = Subjects.all();
    l.push({ id: Store.uid(), name: $('#s-name').value.trim(), color: $('#s-color').value });
    Store.set('subjects', l); e.target.reset(); Subjects.render(); toast('Predmet dodan');
  };
  $('#subj-list').onclick = e => {
    const b = e.target.closest('[data-del]');
    if (b) { Store.set('subjects', Subjects.all().filter(s => s.id !== b.dataset.del)); Subjects.render(); }
    const ed = e.target.closest('[data-edit]');
    if (ed) {
      const s = Subjects.all().find(x => x.id === ed.dataset.edit), n = prompt('Izmijeni predmet', s.name);
      if (n && n.trim()) { Store.set('subjects', Subjects.all().map(x => x.id === s.id ? { ...x, name: n.trim() } : x)); Subjects.render(); toast('Predmet izmijenjen'); }
    }
  };
};
Subjects.card = s => `<div class="card subj" style="--c:${esc(s.color)}"><div class="row"><b class="grow">${esc(s.name)}</b><button class="btn ghost" data-edit="${s.id}" title="Uredi">✎</button><button class="btn ghost" data-del="${s.id}" title="Obriši">✕</button></div>${Subjects.extras.map(f => f(s)).join('')}</div>`;
Subjects.render = () => { $('#subj-list').innerHTML = Subjects.all().map(Subjects.card).join('') || '<p class="muted">Dodaj prvi predmet.</p>'; };
