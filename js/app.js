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
function hero(index, kicker, title, desc, modifier = '') {
  return `<section class="page-hero${modifier ? ` page-hero--${modifier}` : ''}"><div class="hero-copy"><span class="kicker">${esc(kicker)}</span><h1>${title}</h1>${desc ? `<p>${esc(desc)}</p>` : ''}</div><span class="page-no">FINALSOFT / ${index}</span></section>`;
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
function figure(path, caption, label = '', big = false, kind) {
  return `<figure class="evidence-card${big ? ' big' : ''}${kind === 'webterm' ? ' webterm-capture' : ''}" data-group="${esc(label)}"><button type="button" class="thumb" data-lightbox="evidencias/${esc(path)}" data-caption="${esc(caption)}" aria-label="Ampliar: ${esc(caption)}"><img src="evidencias/${esc(path)}" alt="${esc(caption)}" loading="lazy"><span class="zoom" aria-hidden="true">⤢ Ampliar</span></button><figcaption>${label ? `<b>${esc(label)}</b> ` : ''}${esc(caption)}</figcaption></figure>`;
}
function codeBlock(name, code, open, explanation) {
  return `<details class="code-card"${open ? ' open' : ''}><summary><span>${esc(name)}</span><i aria-hidden="true">▾</i></summary><div class="code-body">${explanation ? `<p class="config-explanation">${esc(explanation)}</p>` : ''}<button type="button" class="copy-btn" data-copy="${encodeURIComponent(code)}">Copiar código</button><pre><code>${esc(code)}</code></pre></div></details>`;
}
function resultList(items) {
  const results = items.map(([title, description, extra = {}], i) => {
    const details = extra.details ? `<ul class="result-details">${extra.details.map(([label, value]) =>
      `<li><strong>${esc(label)}</strong> <code>${esc(value)}</code></li>`).join('')}</ul>` : '';
    const evidence = extra.images
      ? `<div class="evidence-grid single">${extra.images.map(([path, caption, kind]) => figure(path, caption, '', false, kind)).join('')}</div>`
      : extra.image ? figure(extra.image[0], extra.image[1], '', false, extra.image[2]) : '';
    return `<li class="result">
    <span class="result-no">${String(i + 1).padStart(2, '0')}</span>
    <div class="result-copy"><h4>${esc(title)}</h4><p>${esc(description)}</p>${details}</div>
    ${evidence}
  </li>`;
  }).join('');
  return `<ol class="results-list">${results}</ol>`;
}
function picker(page, items) {
  return `<nav class="picker" aria-label="Capítulos de esta sección"><div class="picker-in">${items.map(([id, label, small]) =>
    `<a href="#${page}/${id}" class="chip-link" data-chapter="${id}"><b>${esc(label)}</b>${small ? `<small>${esc(small)}</small>` : ''}</a>`).join('')}</div></nav><div id="chapters-top"></div>`;
}
function chapter(c) {
  const resumen = `<div class="details-grid"><div class="details-card"><h3>¿Por qué se implementó?</h3><p>${esc(c.reason)}</p></div><div class="details-card"><h3>¿Cómo se configuró?</h3><p>${esc(c.setup)}</p></div></div>`;
  const config = `<div class="code-tools"><button type="button" class="chip" data-toggle-code>Abrir todos</button></div>${c.blocks.map(([n, code, explanation], i) => codeBlock(n, code, i === 0, explanation)).join('')}${c.note ? `<p class="callout">${esc(c.note)}</p>` : ''}`;
  const items = [
    ['resumen', 'Resumen', resumen],
    ['config', `Configuración <small>${c.blocks.length}</small>`, config],
    ['pruebas', `Pruebas <small>${c.tests.length}</small>`, `<p class="tab-intro">Verificaciones realizadas en el laboratorio para confirmar el funcionamiento de este equipo o servicio.</p>${resultList(c.tests)}`]
  ];
  return `<article class="chapter" id="${c.id}" hidden><header class="chapter-header"><div><span class="section-label">${c.number} / ${esc(c.sub.toUpperCase())}</span><h2 class="chapter-title">${esc(c.title)}</h2><p>${esc(c.lead)}</p></div><span class="ip-tag">${esc(c.ip)}</span></header>${tabs(items)}</article>`;
}
const chaptersOf = group => data.chapters.filter(c => c.group === group);

/* ---------- páginas ---------- */
function addressTable(id, title, headers, rows, codeColumns) {
  const columns = headers.map(label => `<th scope="col">${esc(label)}</th>`).join('');
  const body = rows.map(([label, ...values]) => {
    const cells = values.map((value, i) => `<td>${i < codeColumns ? `<code>${esc(value)}</code>` : esc(value)}</td>`).join('');
    return `<tr><th scope="row">${esc(label)}</th>${cells}</tr>`;
  }).join('');
  return `<h2 class="subhead" id="${id}">${esc(title)}</h2>
    <div class="table-scroll address-scroll" role="region" tabindex="0" aria-labelledby="${id}">
      <table class="network-table address-table" aria-labelledby="${id}">
        <thead><tr>${columns}</tr></thead><tbody>${body}</tbody>
      </table>
    </div>`;
}

function infraestructura() {
  const topo = [
    ['general', 'Vista general', 'topologia/gns3-general.png', 'Topología completa de las dos sedes, routers, servidores y NAT1'],
    ['principal', 'Sede principal', 'topologia/sede-principal.png', 'Detalle de la sede principal'],
    ['secundaria', 'Sede secundaria', 'topologia/sede-secundaria.png', 'Detalle de la sede secundaria'],
    ['wan', 'Enlace WAN', 'topologia/enlace-wan.png', 'Detalle del enlace WAN entre R1 y R2'],
    ['externos', 'Dispositivos externos', 'topologia/dispositivos-externos.png', 'Detalle de los dispositivos externos']
  ];
  const topoTabs = tabs(topo.map(([k, l, p, cap]) => [k, l, `<div class="evidence-grid single">${figure(p, cap, '', true)}</div>`]), 'sub');
  const redes = addressTable(
    'direccionamiento-sedes', 'Direccionamiento de las sedes',
    ['Sede', 'Dirección de red', 'Máscara', 'Gateway', 'Broadcast', 'Rango DHCP'],
    data.networks.sedes, 5
  ) + addressTable(
    'redes-interconexion', 'Redes de interconexión y acceso externo',
    ['Red', 'Dirección / Prefijo', 'Máscara', 'Uso'],
    data.networks.interconexion, 2
  ) + `<p class="wan-endpoints">${data.networks.extremosWan.map(([router, ip]) => `<span>${esc(router)} <code>${esc(ip)}</code></span>`).join('')}</p>`;
  const equipos = `<div class="table-scroll"><table class="network-table"><thead><tr><th>DISPOSITIVO</th><th>DIRECCIÓN IP</th><th>FUNCIÓN</th></tr></thead><tbody>${data.devices.map(([n, a],i) => `<tr><td><span class="row-no">${String(i+1).padStart(2,'0')}</span>${esc(n)}</td><td><code>${esc(a)}</code></td><td>${esc(['Router de la sede secundaria','Router de la sede principal','Gateway y firewall','Asignación DHCP','Resolución de nombres','Portal corporativo','Correo institucional','Copias de seguridad'][i])}</td></tr>`).join('')}</tbody></table></div>`;
  return hero('01', '01 / TOPOLOGÍA Y DIRECCIONAMIENTO', 'Infraestructura<br>de red.', 'Dos sedes comunicadas mediante routers Debian y un enlace punto a punto, con servicios centralizados y acceso controlado a Internet.')
    + lead('ARQUITECTURA DEL PROYECTO', 'Se diseñó una LAN para la sede principal, otra para la sede secundaria y un enlace WAN dedicado entre R1 y R2. Los servicios se alojaron en la sede principal; el gateway R3 conecta las redes internas con la red externa.')
    + `<section class="content-wrap block">${tabs([['topologia', 'Topología', topoTabs], ['redes', 'Redes', redes], ['equipos', 'Equipos', equipos]])}</section>`;
}
function routers() {
  const chs = chaptersOf('routers');
  return hero('02', '02 / ENRUTAMIENTO', 'Conectando<br>las sedes.', 'Dos nodos Debian configurados como routers para enlazar la sede principal y la secundaria mediante 200.10.20.0/30.')
    + lead('EL ENLACE WAN', 'Cada router usa dos adaptadores virtio-net-pci: uno hacia el enlace WAN y otro hacia la LAN de su sede. Las rutas estáticas y el reenvío IPv4 hacen posible la comunicación.')
    + `<section class="content-wrap" aria-label="Recorrido entre las sedes">
      <ol class="route-path" role="list">
        <li class="route-node"><code>194.170.200.0/24</code><span class="route-arrow" aria-hidden="true">→</span></li>
        <li class="route-node route-node--router"><strong>R1</strong><span aria-hidden="true">·</span><code>200.10.20.2</code><span class="route-arrow" aria-hidden="true">→</span></li>
        <li class="route-node route-node--router"><strong>R2</strong><span aria-hidden="true">·</span><code>200.10.20.1</code><span class="route-arrow" aria-hidden="true">→</span></li>
        <li class="route-node"><code>194.170.100.0/24</code></li>
      </ol>
    </section>`
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
  return hero('04', '04 / GATEWAY Y SEGURIDAD', 'Salida segura<br>a Internet.', 'Enrutamiento, NAT y firewall en R3 para dar acceso externo al portal y controlar el tráfico de ambas sedes.', 'gateway')
    + lead('ENRUTAMIENTO Y PROTECCIÓN', 'R3 conecta la LAN principal con NAT1, recibe tráfico de ambas sedes a través de R2 y aplica las reglas de NAT y filtrado necesarias para el funcionamiento de la infraestructura.')
    + `<div id="chapters-top"></div><div class="content-wrap">${chaptersOf('gateway').map(chapter).join('')}</div>`;
}
function pruebas() {
  const principal = [
    ["01","DHCP","PC2-PRI solicitó una concesión DHCP y recibió 194.170.100.105/24 con puerta de enlace 194.170.100.1.",[["show ip muestra la dirección de PC2-PRI y el servidor que la entregó (194.170.100.3).","dhcp/dhcp_principal.png"]]],
    ["02","DNS","PC2-PRI consultó los nombres de WEB y CORREO al hacer ping desde la sede principal. Ambos se resolvieron y respondieron.",[["La consola traduce www.finalsoft.net a 194.170.100.5 y correo.finalsoft.net a 194.170.100.6.","dns/dns_principal.png"]]],
    ["03","WEB","El Webterm de la sede principal abrió el portal que documenta la infraestructura de red por HTTP en 194.170.100.5.",[["La barra del navegador muestra http://194.170.100.5 y la portada de FinalSoft.","web/web_principal.png","webterm"]]],
    ["04","BACKUP","Se verificó la programación del respaldo en cron y la existencia de archivos .tar.gz.",[["cron está activo y el crontab programa backup_web.sh a las 8:15 a. m.","backup/backup_cron.png"],["El directorio /backups/web contiene los .tar.gz y el registro muestra entradas «COPIA EXITOSA».","backup/backup_archivo.png"]]],
    ["05","CORREO — Envío","Se redactó un mensaje desde la cuenta de Ingeniería para Lucas. La captura del destinatario muestra la entrega del correo.",[["El formulario de composición tiene a lucas@finalsoft.net como destinatario.","correo/correo_envio.png","webterm"],["El mensaje abierto en INBOX identifica a ingenieria@finalsoft.net como remitente.","correo/correo_recepcion.png","webterm"]]],
    ["06","CORREO — Recepción","Lucas abrió en SquirrelMail el mensaje que recibió de Ingeniería. Se puede consultar su contenido en el buzón.",[["La bandeja muestra el encabezado con remitente, destinatario y fecha, seguido del cuerpo del mensaje.","correo/correo_recepcion.png","webterm"]]],
    ["07","Acceso a Internet","PC2-PRI hizo ping a 8.8.8.8 desde la sede principal y recibió cinco respuestas.",[["La secuencia ICMP del 1 al 5 confirma que respondieron los cinco paquetes.","gateway/gateway_internet_principal.png"]]]
  ];
  const secundaria = [
    ["08","Conectividad entre sedes","Desde PC1-SEC se hizo ping a los servidores WEB (194.170.100.5) y CORREO (194.170.100.6) de la sede principal. Ambos respondieron.",[["La consola de PC1-SEC muestra respuestas ICMP de las dos IP de la sede principal.","dns/dns_secundaria.png"]]],
    ["09","DHCP","PC1-SEC solicitó su configuración por DHCP desde la sede secundaria. El servicio le asignó 194.170.200.101/24.",[["show ip confirma la concesión y la puerta de enlace 194.170.200.254.","dhcp/dhcp_secundaria.png"]]],
    ["10","DNS","PC1-SEC probó los nombres de WEB y CORREO. El cliente obtuvo las direcciones de ambos servicios y recibió respuestas al ping.",[["La consola muestra www.finalsoft.net resuelto a 194.170.100.5 y correo.finalsoft.net a 194.170.100.6.","dns/dns_secundaria.png"]]],
    ["11","Acceso a Internet","PC1-SEC hizo ping a 8.8.8.8 desde la sede secundaria y recibió cinco respuestas.",[["La consola muestra cinco respuestas ICMP de 8.8.8.8 en PC1-SEC.","gateway/gateway_internet_secundaria.png"]]],
    ["12","Acceso externo al WEB","El Webterm externo abrió FinalSoft mediante la dirección 192.168.42.87. Una consulta de cabeceras confirmó la respuesta HTTP.",[["El navegador muestra el portal al abrir la dirección externa de R3.","web/web_externo.png","webterm"],["curl -I recibe HTTP/1.1 200 OK desde 192.168.42.87.","web/web_externo_consola.png"]]]
  ];
  const firewall = [
    ["13","Salida a Internet desde ambas sedes","Las reglas ACCEPT de FORWARD permiten el tránsito de ambas LAN desde ens3 hacia ens4. Los contadores de R3 registran paquetes de las dos redes.",[["FORWARD registra paquetes de 194.170.100.0/24 y 194.170.200.0/24 en las respectivas reglas ACCEPT.","gateway/gateway_forward.png"]]],
    ["14","Acceso HTTP externo al servidor WEB","Desde la red externa se consultaron las cabeceras HTTP de 192.168.42.87. La redirección en R3 publica por el puerto 80 al servidor WEB 194.170.100.5.",[["curl -I a 192.168.42.87 devuelve HTTP/1.1 200 OK y una cabecera de Apache.","web/web_externo_consola.png"]]],
    ["15","Bloqueo de conexiones SSH externas","El intento de conexión SSH a 192.168.42.87 desde la red externa agotó el tiempo de espera sin establecer sesión.",[["La consola muestra «Connection timed out» para el puerto 22 de R3.","gateway/gateway_ssh.png"]]],
    ["16","Bloqueo del tráfico entrante no autorizado","El ping externo a 192.168.42.87 no recibió respuesta. Las cadenas INPUT y FORWARD muestran las reglas que descartan tráfico externo no autorizado.",[["El resumen de ping registra 4 paquetes enviados, 0 recibidos y 100 % de pérdida.","gateway/gateway_bloqueo_icmp.png"],["INPUT y FORWARD muestran las reglas DROP para paquetes entrantes por ens4.","gateway/gateway_bloqueo_firewall.png"]]]
  ];

  function testRow([number, title, description, evidence]) {
    const captures = evidence.map(([caption, path, kind]) => path
      ? figure(path, caption, '', false, kind)
      : `<div class="test-pending"><span>Evidencia pendiente</span><strong>${esc(caption)}</strong></div>`).join('');
    return `<article class="test-row">
      <div class="test-description">
        <h2><span class="test-no">${number}</span><span>${esc(title)}</span></h2>
        <p>${esc(description)}</p>
      </div>
      <div class="evidence-grid test-evidence">${captures}</div>
    </article>`;
  }

  const groups = [
    ['principal', 'Sede principal', principal],
    ['secundaria', 'Sede secundaria', secundaria],
    ['firewall', 'Firewall', firewall]
  ];
  const panels = groups.map(([key, label, tests]) => [
    key,
    `${label} — ${tests.length} ${tests.length === 1 ? 'prueba' : 'pruebas'}`,
    `<div class="test-list">${tests.map(testRow).join('')}</div>`
  ]);
  return hero('05', '05 / VALIDACIÓN DEL LABORATORIO', 'Pruebas', '')
    + `<section class="content-wrap block test-section">${tabs(panels)}</section>`;
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
const lbControls = $('#lightboxControls');
let lbList = [], lbIndex = 0, lbOpener = null;
function lbShow() {
  const b = lbList[lbIndex];
  lbImg.src = b.dataset.lightbox; lbImg.alt = b.dataset.caption; lbCap.textContent = `${b.dataset.caption}  (${lbIndex + 1}/${lbList.length})`;
  lbControls.hidden = lbList.length < 2;
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
    syncLandingMotion();
    document.title = 'FinalSoft | Infraestructura Telemática';
    window.scrollTo({ top: 0, behavior: 'instant' }); current = 'inicio'; return;
  }
  landing.hidden = true; interior.hidden = false; document.body.classList.remove('on-home');
  syncLandingMotion();
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
  if (anchor && target && top) requestAnimationFrame(() => top.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start' }));
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
  if (t.closest('#floatTop')) return window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
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
      const f = lbControls.hidden ? [lbClose] : [lbClose, lbPrev, lbNext];
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

const landingVideo = $('#heroVideo');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function syncLandingMotion() {
  if (landing.hidden || reduceMotion.matches || document.hidden) landingVideo.pause();
  else landingVideo.play().catch(() => {});
}

reduceMotion.addEventListener('change', syncLandingMotion);
document.addEventListener('visibilitychange', syncLandingMotion);

showPage(decodeURIComponent(location.hash.slice(1)) || 'inicio');
})();
