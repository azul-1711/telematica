# Contexto del proyecto: FinalSoft (portal de infraestructura telemática)

Sitio ESTÁTICO (HTML/CSS/JS sin build, sin frameworks, sin CDN, sin fuentes externas).
Debe seguir abriéndose con doble clic en `index.html`. Idioma de toda la interfaz: español.

## Estructura
- `index.html`: portada (video + menú en píldora) y contenedor de páginas internas.
- `css/styles.css`: todo el diseño. Variables en `:root` (`--bg`, `--lime`, `--fg`...).
- `js/content.js`: ÚNICA fuente del contenido técnico (`window.FINALSOFT`: networks, devices, chapters).
  Cada capítulo tiene: id, group, number, title, sub, ip, lead, reason, setup, blocks, tests, images, note.
- `js/app.js`: genera las páginas (infraestructura, routers, servicios, gateway, pruebas), galería, lightbox, copiar código.
- `evidencias/<servicio>/<archivo>.png`: capturas. Solo se listan en content.js las que existen.
- `docs/Proyecto_Final_Routers_Sedes.docx`: fuente de verdad del contenido técnico.
- `extras/`: material que NO se publica.

## Diseño (no cambiar sin pedirlo)
Fondo #101114, acento lima #c8fc62, títulos grandes Arial con tracking negativo, textos pequeños en Courier New,
portada a pantalla completa sin scroll con video de fondo, encabezado "FinalSoft ——— & ——— Telemática",
menú flotante en píldora abajo y centrado, páginas internas con cabecera fija y animaciones .reveal.

## Red
Sede principal 194.170.100.0/24 · Secundaria 194.170.200.0/24 · WAN R1–R2 200.10.20.0/30 · NAT1 192.168.42.0/24
R1 (secundaria) LAN .200.254, WAN .2 · R2 (principal) LAN .100.1, WAN .1 · R3 gateway LAN .100.2, externa 192.168.42.87
DHCP .3 · DNS .4 · WEB .5 · CORREO .6 · BACKUP .7 · dominio finalsoft.net

## Capturas
Las capturas incluidas son de terminal con fondo transparente y texto dorado (se ven sobre el fondo oscuro de la tarjeta).
`evidencias/topologia/gns3-general.png` es una composición de las 4 secciones de la topología
(piezas sueltas en la misma carpeta). No inventes ni simules capturas; solo se muestran las que existen en evidencias/ (las faltantes se eliminaron del sitio por decisión del equipo).
`extras/r3-rutas-con-errores-iptables.png` NO sirve como evidencia (muestra errores de sintaxis de iptables).

## Reglas de trabajo
- Plan antes de editar; cambios pequeños; un commit por cambio lógico.
- No agregar dependencias, CDN ni fuentes de Internet.
- Mantener accesibilidad (teclado, aria, contraste) y responsive.
- El video de portada (`assets/video/router-hero.mp4`) debe tener derecho de uso confirmado por el equipo.
- No escribir contraseñas ni datos privados en el sitio.
