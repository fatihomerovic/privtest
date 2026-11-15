const Calendar = Altasera.modules.calendar = {};
Calendar.ym = { y: new Date().getFullYear(), m: new Date().getMonth() };
Calendar.sel = null; Calendar.cellExtras = []; Calendar.rowExtras = []; Calendar.panelExtras = [];
Calendar.names = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
Calendar.init = function () {
  $('#view-calendar').innerHTML = `<h2>Kalendar</h2>
    <div class="card"><div class="row"><button class="btn ghost" id="c-prev">‹</button><h3 id="c-title" class="grow" style="text-align:center;margin:0"></h3><button class="btn ghost" id="c-next">›</button></div><div class="cal" id="c-grid"></div></div>
    <div class="card" id="c-day" style="margin-top:16px" hidden></div>`;
  $('#c-prev').onclick = () => Calendar.go && Calendar.go(-1);
  $('#c-next').onclick = () => Calendar.go && Calendar.go(1);
  $('#c-grid').onclick = e => { const c = e.target.closest('[data-d]'); if (c && Calendar.pick) Calendar.pick(c.dataset.d); };
};
Calendar.render = function () {
  const { y, m } = Calendar.ym, first = new Date(y, m, 1), lead = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
  $('#c-title').textContent = first.toLocaleDateString('bs', { month: 'long', year: 'numeric' });
  let h = Calendar.names.map(n => `<div class="cal-h">${n}</div>`).join('');
  for (let i = 0; i < lead; i++) h += '<div></div>';
  for (let d = 1; d <= days; d++) {
    const key = dateKey(new Date(y, m, d));
    h += `<div class="cal-d ${key === todayStr() ? 'today' : ''} ${Calendar.sel === key ? 'sel' : ''}" data-d="${key}"><span>${d}</span>${Calendar.cellExtras.map(f => f(key)).join('')}</div>`;
  }
  $('#c-grid').innerHTML = h;
};
Calendar.go = n => {
  let { y, m } = Calendar.ym; m += n;
  if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
  Calendar.ym = { y, m }; Calendar.render();
};
Calendar.cellExtras.push(key => {
  const n = Store.get('tasks', []).filter(t => t.due === key && t.status !== 'Done').length;
  return n ? `<i class="dot ${key < todayStr() ? 'late' : ''}" title="${n} zadatak(a)"></i>` : '';
});
