# FinalSoft · Portal de infraestructura telemática

Portal estático (HTML, CSS y JavaScript) del proyecto *Sistemas y Servicios Telemáticos*:
dos sedes, routers Debian, servicios corporativos y gateway con NAT y firewall, hechos en GNS3.

## Cómo abrir
Haz doble clic en `index.html` (Chrome, Firefox o Edge). No necesita instalar nada ni conexión a Internet.

## Publicar en Apache (Debian)
Copia `index.html`, `css/`, `js/`, `assets/` y `evidencias/` a `/var/www/html/`.
No hace falta publicar `docs/`, `extras/` ni los archivos `.md`.

## Capturas
Las imágenes viven en `evidencias/<servicio>/` y cada una se declara en `js/content.js` (campo `images` del capítulo).
Para agregar una nueva: copia el PNG a su carpeta y añade `["carpeta/archivo.png", "descripción"]` al capítulo. Al hacer clic se amplía.

Capturas incluidas: topología (5), routers, DHCP (2), DNS, WEB, correo (5), backup e Internet/firewall.
El sitio solo muestra las que existen; no hay espacios vacíos.

## Navegación
- Cada sección tiene un selector fijo de capítulos (`#servicios/dns`, `#routers/r2`...) y cada capítulo se organiza en pestañas: Resumen, Configuración, Pruebas y Evidencias.
- Los comandos están plegados (se abren con un clic) y las imágenes se amplían en una ventana flotante con flechas.
- Barra flotante inferior para ir a la sección anterior/siguiente.

## Archivos
- `index.html`: estructura.
- `css/styles.css`: apariencia.
- `js/content.js`: contenido técnico (direcciones, comandos, pruebas, lista de capturas).
- `js/app.js`: navegación, pestañas, selector de capítulos, galería con filtros y copiar código.
- `assets/video/router-hero.mp4` y `assets/img/router-poster.jpg`: video de la portada.
- `docs/Proyecto_Final_Routers_Sedes.docx`: documento fuente con las configuraciones completas.

## Advertencias
- Las pruebas son documentación histórica del laboratorio, no lectura en vivo.
- Algunos bloques de comandos son extractos; la configuración completa está en el documento.
- Dovecot sin TLS y SquirrelMail 1.4.22 son solo para laboratorio: no exponer a Internet pública.
- No publiques contraseñas ni claves privadas.
# a
