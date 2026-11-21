# FinalSoft · Portal de infraestructura telemática

## Cómo abrir

1. Extrae el ZIP completo (no abras index.html dentro del ZIP).
2. Haz doble clic en `index.html` en Chrome o Firefox.
3. La portada no tiene desplazamiento vertical. Usa **Inicio** para abrir el menú desplegable o **Explorar**.
4. Las páginas internas tienen navegación superior y desplazamiento vertical. El menú **Inicio** solo está en la portada.

## Secciones implementadas

- Inicio con video MP4 original, sin alterarlo.
- Infraestructura: topología, sedes, direccionamiento.
- Routers: R1 y R2, enlace punto a punto y DHCP Relay en R1.
- Servicios: DHCP, DNS, WEB, CORREO y BACKUP.
- Gateway R3: NAT, DNAT, firewall y acceso externo.
- Pruebas y resultados: galería y descripción de las verificaciones.

Los textos, direcciones, comandos y pruebas se basan en `Proyecto_Final_Routers_Sedes (4).docx`. Algunos bloques de comandos son **extractos o resúmenes** y están marcados como tales. No ejecutes configuraciones de ejemplo sin revisar el documento completo y respaldar la configuración real.

## Capturas reales

Las capturas NO se inventaron. Para integrarlas, guarda los archivos exactamente con las rutas indicadas en cada espacio de evidencia. Ejemplos:

- `evidencias/topologia/gns3-general.png`
- `evidencias/routers/ping-enlace.png`
- `evidencias/correo/correo-recibido.png`
- `evidencias/correo/bloqueo-gmail.png`
- `evidencias/internet/google-principal.png`
- `evidencias/internet/google-secundaria.png`

Al recargar la web, aparecerán automáticamente; haz clic para ampliarlas.

## Archivos

- `index.html` estructura principal.
- `css/styles.css` apariencia.
- `js/content.js` configuraciones documentadas.
- `js/app.js` navegación, páginas, galería y copiar código.
- `assets/video/router-hero.mp4` video que proporcionaste.

No necesita instalación de Node.js, frameworks o CDN. Puede desplegarse como contenido estático en `/var/www/html` del Apache2 de FinalSoft. Para probar enlaces desde Webterm, verifica primero la resolución DNS y el acceso al servidor Apache.

No hay sección de conclusiones ni de contacto.
