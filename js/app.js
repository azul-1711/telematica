(() => {
'use strict';
const data = window.FINALSOFT;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const PAGES = [
  ['infraestructura', 'Infraestructura'],
  ['routers', 'Enlace y routers'],
  ['servicios', 'Servicios'],
  ['gateway', 'Gateway y seguridad'],
  ['pruebas', 'Pruebas y evidencias']
];
const GROUP_LABEL = { r1: 'Routers', r2: 'Routers', dhcp: 'DHCP', dns: 'DNS', web: 'WEB', correo: 'Correo', backup: 'Backup', r3: 'Gateway' };

const landing = $('#landing'), interior = $('#interior'), content = $('#pageContent');
const toggle = $('#landingToggle'), pop = $('#landingMenu');
const mobile = $('#mobileMenu'), mobileLinks = $('#mobileLinks');

/* ---------- bloques reutilizables ---------- */
let uid = 0;
function hero(index, kicker, title, desc) {
  return `<section class="page-hero"><div class="hero-copy"><span class="kicker">${esc(kicker)}</span><h1>${title}</h1><p>${esc(desc)}</p></div><span class="page-no">FINALSOFT / ${index}</span></section>`;
}
function lead(kicker, desc) {
  return `<section class="lead-strip content-wrap"><span class="section-label">${esc(kicker)}</span><p>${esc(desc)}</p></section>`;
}
function tabs(items, cls = '') {
  const id = 't' + (++uid);
  const list = items.map(([k, label], i) =>
    `<button type="button" role="tab" id="${id}-${k}-tab" data-tab="${k}" aria-controls="${id}-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`).join('');
  const panels = items.map(([k, , html], i) =>
    `<div role="tabpanel" class="tab-panel" id="${id}-${k}" aria-labelledby="${id}-${k}-tab"${i ? ' hidden' : ''}>${html}</div>`).join('');
  return `<div class="tabs ${cls}"><div class="tab-list" role="tablist">${list}</div>${panels}</div>`;
}
function figure(path, caption, label = '', big = false) {
  return `<figure class="evidence-card${big ? ' big' : ''}" data-group="${esc(label)}"><button type="button" class="thumb" data-lightbox="evidencias/${esc(path)}" data-caption="${esc(caption)}" aria-label="Ampliar: ${esc(caption)}"><img src="evidencias/${esc(path)}" alt="${esc(caption)}" loading="lazy"><span class="zoom" aria-hidden="true">⤢ Ampliar</span></button><figcaption>${label ? `<b>${esc(label)}</b> ` : ''}${esc(caption)}</figcaption></figure>`;
}
function codeBlock(name, code, open) {
  return `<details class="code-card"${open ? ' open' : ''}><summary><span>${esc(name)}</span><i aria-hidden="true">▾</i></summary><div class="code-body"><button type="button" class="copy-btn" data-copy="${encodeURIComponent(code)}">Copiar código</button><pre><code>${esc(code)}</code></pre></div></details>`;
}
function resultList(items) {
  return `<ol class="results-list">${items.map((r, i) => `<li class="result"><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(r)}</p></li>`).join('')}</ol>`;
}
function picker(page, items) {
  return `<nav class="picker" aria-label="Capítulos de esta sección"><div class="picker-in">${items.map(([id, label, small]) =>
    `<a href="#${page}/${id}" class="chip-link" data-chapter="${id}"><b>${esc(label)}</b>${small ? `<small>${esc(small)}</small>` : ''}</a>`).join('')}</div></nav><div id="chapters-top"></div>`;
}
function chapter(c) {
  const resumen = `<div class="details-grid"><div class="details-card"><h3>¿Por qué se implementó?</h3><p>${esc(c.reason)}</p></div><div class="details-card"><h3>¿Cómo se configuró?</h3><p>${esc(c.setup)}</p></div></div>`;
  const config = `<div class="code-tools"><button type="button" class="chip" data-toggle-code>Abrir todos</button></div>${c.blocks.map(([n, code], i) => codeBlock(n, code, i === 0)).join('')}${c.note ? `<p class="callout">${esc(c.note)}</p>` : ''}`;
  const items = [
    ['resumen', 'Resumen', resumen],
    ['config', `Configuración <small>${c.blocks.length}</small>`, config],
    ['pruebas', `Pruebas <small>${c.tests.length}</small>`, resultList(c.tests)]
  ];
  if (c.images.length) items.push(['evid', `Evidencias <small>${c.images.length}</small>`, `<div class="evidence-grid">${c.images.map(([p, s]) => figure(p, s)).join('')}</div>`]);
  return `<article class="chapter" id="${c.id}" hidden><header class="chapter-header"><div><span class="section-label">${c.number} / ${esc(c.sub.toUpperCase())}</span><h2 class="chapter-title">${esc(c.title)}</h2><p>${esc(c.lead)}</p></div><span class="ip-tag">${esc(c.ip)}</span></header>${tabs(items)}</article>`;
}
const chaptersOf = group => data.chapters.filter(c => c.group === group);

/* ---------- páginas ---------- */
function infraestructura() {
  const topo = [
    ['general', 'Vista general', 'topologia/gns3-general.png', 'Topología completa de las dos sedes, routers, servidores y NAT1'],
    ['principal', 'Sede principal', 'topologia/sede-principal.png', 'Detalle de la sede principal'],
    ['secundaria', 'Sede secundaria', 'topologia/sede-secundaria.png', 'Detalle de la sede secundaria'],
    ['wan', 'Enlace WAN', 'topologia/enlace-wan.png', 'Detalle del enlace WAN entre R1 y R2'],
    ['externos', 'Dispositivos externos', 'topologia/dispositivos-externos.png', 'Detalle de los dispositivos externos']
  ];
  const topoTabs = tabs(topo.map(([k, l, p, cap]) => [k, l, `<div class="evidence-grid single">${figure(p, cap, '', true)}</div>`]), 'sub');
  const redes = `<div class="number-grid">${data.networks.map(([n, a]) => `<article><strong>${esc(a)}</strong><span>${esc(n)}</span></article>`).join('')}</div><div class="device-strip"><span class="pill">Sede principal: clientes .100–.200</span><span class="pill">Sede secundaria: clientes .100–.200</span><span class="pill">Servidores: reservas DHCP por MAC</span></div>`;
  const equipos = `<div class="number-grid">${data.devices.map(([n, a]) => `<article><strong style="font-size:22px">${esc(a)}</strong><span>${esc(n)}</span></article>`).join('')}</div>`;
  return hero('01', '01 / TOPOLOGÍA Y DIRECCIONAMIENTO', 'Infraestructura<br>de red.', 'Dos sedes comunicadas mediante routers Debian y un enlace punto a punto, con servicios centralizados y acceso controlado a Internet.')
    + lead('ARQUITECTURA DEL PROYECTO', 'Se diseñó una LAN para la sede principal, otra para la sede secundaria y un enlace WAN dedicado entre R1 y R2. Los servicios se alojaron en la sede principal; el gateway R3 conecta las redes internas con la red externa.')
    + `<section class="content-wrap block">${tabs([['topologia', 'Topología', topoTabs], ['redes', 'Redes', redes], ['equipos', 'Equipos', equipos]])}</section>`;
}
function routers() {
  const chs = chaptersOf('routers');
  return hero('02', '02 / ENRUTAMIENTO', 'Conectando<br>las sedes.', 'Dos nodos Debian configurados como routers para enlazar la sede principal y la secundaria mediante 200.10.20.0/30.')
    + lead('EL ENLACE WAN', 'Cada router usa dos adaptadores virtio-net-pci: uno hacia el enlace WAN y otro hacia la LAN de su sede. Las rutas estáticas y el reenvío IPv4 hacen posible la comunicación.')
    + `<section class="content-wrap"><div class="device-strip route"><span class="pill">194.170.200.0/24</span><span class="arrow">→</span><span class="pill">R1 · 200.10.20.2</span><span class="arrow">→</span><span class="pill">R2 · 200.10.20.1</span><span class="arrow">→</span><span class="pill">194.170.100.0/24</span></div></section>`
    + picker('routers', chs.map(c => [c.id, c.title, c.ip]))
    + `<div class="content-wrap">${chs.map(chapter).join('')}</div>`;
}
function servicios() {
  const chs = chaptersOf('servicios');
  return hero('03', '03 / SERVICIOS DE RED', 'Servicios<br>corporativos.', 'DHCP, DNS, WEB, CORREO y BACKUP, implementados en servidores Debian dentro de la sede principal.')
    + lead('SERVICIOS IMPLEMENTADOS', 'Cada servidor cumple una función: asignar direcciones, resolver nombres, publicar el portal, intercambiar correos internos y guardar copias de seguridad.')
    + picker('servicios', chs.map(c => [c.id, c.title.replace('Servidor ', ''), c.ip]))
    + `<div class="content-wrap">${chs.map(chapter).join('')}</div>`;
}
function gateway() {
  return hero('04', '04 / GATEWAY Y SEGURIDAD', 'Salida segura<br>a Internet.', 'Enrutamiento, NAT y firewall en R3 para dar acceso externo al portal y controlar el tráfico de ambas sedes.')
    + lead('ENRUTAMIENTO Y PROTECCIÓN', 'R3 conecta la LAN principal con NAT1, recibe tráfico de ambas sedes a través de R2 y aplica las reglas de NAT y filtrado necesarias para el funcionamiento de la infraestructura.')
    + `<div id="chapters-top"></div><div class="content-wrap">${chaptersOf('gateway').map(chapter).join('')}</div>`;
}
function pruebas() {
  const seen = new Set(), figs = [];
  data.chapters.forEach(c => c.images.forEach(([p, s]) => { if (!seen.has(p)) { seen.add(p); figs.push([p, s, GROUP_LABEL[c.id]]); } }));
  const groups = [...new Set(figs.map(f => f[2]))];
  const gallery = `<div class="filters" role="group" aria-label="Filtrar evidencias"><button type="button" class="chip active" data-filter="" aria-pressed="true">Todas <small>${figs.length}</small></button>${groups.map(g => `<button type="button" class="chip" data-filter="${esc(g)}" aria-pressed="false">${esc(g)}</button>`).join('')}</div><div class="evidence-grid" id="gallery">${figs.map(([p, s, g]) => figure(p, s, g)).join('')}</div>`;
  const results = resultList([
    'R1 y R2: comunicación verificada con ping, sin pérdida de paquetes en la prueba registrada.',
    'DHCP: equipos de ambas sedes reciben direcciones IP; sede secundaria mediante relay.',
    'DNS: resolución de www.finalsoft.net y correo.finalsoft.net desde la red secundaria.',
    'CORREO: intercambio entre cuentas finalsoft.net y rechazo de Gmail.',
    'BACKUP: respaldo comprimido guardado y tarea diaria programada.',
    'R3: salida a Internet y acceso web desde NAT1, con bloqueo de SSH externo.'
  ]);
  return hero('05', '05 / VERIFICACIÓN DEL LABORATORIO', 'Pruebas y<br>resultados.', 'Evidencias de conectividad, servicios y políticas de acceso recopiladas durante la implementación de FinalSoft.')
    + lead('EVIDENCIAS TÉCNICAS', 'Capturas del laboratorio en GNS3, Webterm y SquirrelMail. Toca una imagen para ampliarla y usa los filtros para ver solo un servicio.')
    + `<section class="content-wrap block">${tabs([['galeria', `Capturas <small>${figs.length}</small>`, gallery], ['resultados', 'Resultados documentados', results]])}</section>`;
}
function pageHtml(p) {
  return ({ infraestructura, routers, servicios, gateway, pruebas }[p] || infraestructura)();
}

/* ---------- pestañas, capítulos, filtros ---------- */
function activateTab(btn, focus) {
  const root = btn.closest('.tabs');
  const buttons = $$('[data-tab]', root.firstElementChild);
  const panels = Array.from(root.children).filter(c => c.classList.contains('tab-panel'));
  buttons.forEach(b => { const on = b === btn; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  panels.forEach(p => { p.hidden = p.id !== btn.getAttribute('aria-controls'); });
  if (focus) btn.focus();
}
function selectChapter(id) {
  const chapters = $$('.chapter', content);
  if (!chapters.length) return null;
  const target = chapters.find(c => c.id === id) || chapters[0];
  chapters.forEach(c => { c.hidden = c !== target; });
  $$('.chip-link', content).forEach(a => {
    const on = a.dataset.chapter === target.id;
    a.classList.toggle('active', on);
    on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
  });
  return target;
}
function applyFilter(btn) {
  const f = btn.dataset.filter;
  $$('[data-filter]', btn.parentElement).forEach(b => { const on = b === btn; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); });
  $$('#gallery .evidence-card').forEach(fig => { fig.hidden = !!f && fig.dataset.group !== f; });
}

/* ---------- lightbox ---------- */
const lb = $('#lightbox'), lbImg = $('#lightboxImage'), lbCap = $('#lightboxCaption');
const lbClose = $('#closeLightbox'), lbPrev = $('#lbPrev'), lbNext = $('#lbNext');
let lbList = [], lbIndex = 0, lbOpener = null;
function lbShow() {
  const b = lbList[lbIndex];
  lbImg.src = b.dataset.lightbox; lbImg.alt = b.dataset.caption; lbCap.textContent = `${b.dataset.caption}  (${lbIndex + 1}/${lbList.length})`;
  lbPrev.hidden = lbNext.hidden = lbList.length < 2;
}
function openLightbox(btn) {
  const scope = btn.closest('.evidence-grid') || btn.parentElement;
  lbList = $$('[data-lightbox]', scope).filter(b => !b.closest('[hidden]') || b === btn);
  lbIndex = Math.max(0, lbList.indexOf(btn)); lbOpener = btn;
  lbShow(); lb.hidden = false; lbClose.focus();
}
function closeLightbox() { if (lb.hidden) return; lb.hidden = true; lbImg.removeAttribute('src'); if (lbOpener) lbOpener.focus(); }
function lbStep(d) { if (lbList.length < 2) return; lbIndex = (lbIndex + d + lbList.length) % lbList.length; lbShow(); }
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => lbStep(-1));
lbNext.addEventListener('click', () => lbStep(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

/* ---------- copiar ---------- */
function flash(btn) { btn.textContent = 'Copiado ✓'; setTimeout(() => btn.textContent = 'Copiar código', 1300); }
function legacyCopy(s, btn) { const t = document.createElement('textarea'); t.value = s; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); flash(btn); }
function copyCode(btn) {
  const s = decodeURIComponent(btn.dataset.copy);
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(s).then(() => flash(btn)).catch(() => legacyCopy(s, btn));
  else legacyCopy(s, btn);
}

/* ---------- navegación ---------- */
function closeMenus() {
  pop.hidden = true; toggle.setAttribute('aria-expanded', 'false');
  mobileLinks.hidden = true; mobile.setAttribute('aria-expanded', 'false');
}
function updateFloat(p) {
  const i = PAGES.findIndex(x => x[0] === p);
  const prev = i > 0 ? PAGES[i - 1] : ['inicio', 'Inicio'];
  const next = i < PAGES.length - 1 ? PAGES[i + 1] : ['inicio', 'Inicio'];
  const a = $('#floatPrev'), b = $('#floatNext');
  a.href = '#' + prev[0]; $('span', a).textContent = prev[1];
  b.href = '#' + next[0]; $('span', b).textContent = next[1];
  $('#floatLabel').textContent = `${i + 1} de ${PAGES.length} · ${PAGES[i][1]}`;
}
let current = '';
function showPage(which) {
  let [p, anchor] = which.split('/');
  if (!PAGES.some(x => x[0] === p)) p = 'inicio';
  closeMenus(); closeLightbox();
  if (p === 'inicio') {
    landing.hidden = false; interior.hidden = true; document.body.classList.add('on-home');
    document.title = 'FinalSoft | Infraestructura Telemática';
    window.scrollTo({ top: 0, behavior: 'instant' }); current = 'inicio'; return;
  }
  landing.hidden = true; interior.hidden = false; document.body.classList.remove('on-home');
  if (current !== p) { content.innerHTML = pageHtml(p); current = p; }
  $$('.top-links a, .mobile-links a').forEach(a => {
    const on = a.dataset.page === p;
    a.classList.toggle('active', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  updateFloat(p);
  document.title = 'FinalSoft | ' + PAGES.find(x => x[0] === p)[1];
  const target = selectChapter(anchor);
  const top = $('#chapters-top');
  if (anchor && target && top) requestAnimationFrame(() => top.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ---------- eventos ---------- */
toggle.addEventListener('click', () => { pop.hidden = !pop.hidden; toggle.setAttribute('aria-expanded', String(!pop.hidden)); });
mobile.addEventListener('click', () => { mobileLinks.hidden = !mobileLinks.hidden; mobile.setAttribute('aria-expanded', String(!mobileLinks.hidden)); });
document.addEventListener('click', e => {
  const t = e.target; let b;
  if ((b = t.closest('[data-tab]'))) return activateTab(b);
  if ((b = t.closest('[data-copy]'))) return copyCode(b);
  if ((b = t.closest('[data-lightbox]'))) return openLightbox(b);
  if ((b = t.closest('[data-filter]'))) return applyFilter(b);
  if ((b = t.closest('[data-toggle-code]'))) {
    const all = $$('details.code-card', b.closest('.tab-panel'));
    const open = !all.every(d => d.open);
    all.forEach(d => d.open = open);
    b.textContent = open ? 'Cerrar todos' : 'Abrir todos'; return;
  }
  if (t.closest('#floatTop')) return window.scrollTo({ top: 0, behavior: 'smooth' });
  if (t.closest('a[href^="#"]')) {
    const href = t.closest('a').getAttribute('href').slice(1);
    if (href === location.hash.slice(1)) showPage(decodeURIComponent(href)); // mismo destino: refrescar
    closeMenus();
    return;
  }
  if (!pop.hidden && !t.closest('.landing-bottom')) { pop.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
  if (!mobileLinks.hidden && !t.closest('.site-header') && !t.closest('#mobileLinks')) { mobileLinks.hidden = true; mobile.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMenus(); closeLightbox(); return; }
  if (!lb.hidden) {
    if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'Tab') {
      const f = [lbPrev, lbNext, lbClose].filter(x => !x.hidden);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
    return;
  }
  const tabBtn = e.target.closest?.('[data-tab]');
  if (tabBtn && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    const list = $$('[data-tab]', tabBtn.parentElement), i = list.indexOf(tabBtn);
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length;
    e.preventDefault(); activateTab(list[n], true);
  }
});
window.addEventListener('hashchange', () => showPage(decodeURIComponent(location.hash.slice(1))));

/* video de portada: pausa accesible */
const vid = $('#heroVideo'), vbtn = $('#videoToggle');
function syncVideo() { const playing = !vid.paused; vbtn.textContent = playing ? '❚❚ Pausar video' : '▶ Reproducir video'; vbtn.setAttribute('aria-pressed', String(!playing)); }
vbtn.addEventListener('click', () => { vid.paused ? vid.play().catch(() => {}) : vid.pause(); });
vid.addEventListener('play', syncVideo); vid.addEventListener('pause', syncVideo);
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) vid.pause(); else vid.play().catch(() => {});
syncVideo();

showPage(decodeURIComponent(location.hash.slice(1)) || 'inicio');
})();
