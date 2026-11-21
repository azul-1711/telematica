# Cómo cambiar el diseño del repo y adaptar todo

## A) Pasar tu carpeta finalsoft al diseño nuevo (hazlo UNA vez)
1. En Claude Code escribe `/exit` para cerrarlo.
2. Guarda el estado actual por si quieres volver (en PowerShell, dentro de Desktop\finalsoft):
       git add -A
       git commit -m "Version anterior del sitio"
3. Borra el contenido viejo SIN borrar la carpeta .git:
       Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
4. Descomprime el zip y copia TODO el contenido de la carpeta finalsoft/ del zip dentro de Desktop\finalsoft.
5. Abre index.html con doble clic y comprueba: portada con video, menú "Inicio" y botón "Explorar".
6. Guarda el cambio:
       git add -A
       git commit -m "Nuevo diseño del portal"
       git push

## B) Seguir trabajando con Claude Code
1. En Desktop\finalsoft ejecuta: claude
2. Shift+Tab hasta "plan mode".
3. Escribe (a mano, es corto, y si no te deja pegar usa clic derecho o Shift+Insert):

   Lee CLAUDE.md y README.md. Revisa el sitio completo y dime qué falta o está roto antes de cambiar nada.

## C) Prompts útiles (uno por vez)
- Agregar capturas nuevas:
  "Puse capturas nuevas en evidencias/. Revisa cada imagen, confirma que corresponde a su espacio
   y renómbrala si hace falta. Dime cuáles siguen pendientes."
- Textos/colores:
  "Cambia [lo que quieras] en css/styles.css o js/content.js. No toques lo demás. Muéstrame el cambio antes."
- Accesibilidad:
  "Mejora la accesibilidad: foco del teclado dentro del lightbox, botón para pausar el video de la portada
   y aria-current en el menú. Sin cambiar el diseño."
- Revisión final antes de entregar:
  "Revisa que todo funcione abriendo index.html sin servidor, que no haya enlaces rotos ni textos de relleno,
   y que el contenido coincida con docs/Proyecto_Final_Routers_Sedes.docx."

## D) Dónde se cambia cada cosa
- Textos técnicos, comandos y pruebas: js/content.js
- Colores, tamaños, espacios: css/styles.css (variables al inicio)
- Estructura de las páginas: js/app.js
- Video de portada: assets/video/router-hero.mp4
- Capturas: evidencias/<servicio>/
