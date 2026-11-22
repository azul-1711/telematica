# Lista de evidencias de FinalSoft

Las capturas se muestran dentro de **Pruebas**. Algunas respaldan varias verificaciones y se guardan en un solo archivo.

## Pruebas de equipos y servicios

| Equipo o sede | Verificación | Archivo | Carpeta | Estado |
| --- | --- | --- | --- | --- |
| Router R1 | Comunicación entre routers | `r1-ping-interfaces.png` | `routers` | Real |
| Router R1 | Direcciones de las interfaces | `r1_interfaces.png` | `routers` | Real |
| Router R1 | Enrutamiento | `r1-rutas.png` | `routers` | Real |
| Router R1 | Servicio DHCP Relay | `r1-dhcp-relay.png` | `routers` | Real |
| Router R1 | Asignación IP al cliente de la sede secundaria | `dhcp_secundaria.png` | `dhcp` | Real |
| Router R2 | Comunicación con R1 | `r2_ping_r1.png` | `routers` | Real |
| Router R2 | Direcciones de las interfaces | `r2_interfaces.png` | `routers` | Real |
| Router R2 | Ruta hacia la sede secundaria | `r2_ruta_secundaria.png` | `routers` | Real |
| Router R2 | Ruta hacia el Gateway R3 — La tabla de rutas muestra la salida por defecto hacia R3 por ens4. | `r2-config.png` | `routers` | Real |
| Router R2 | Ruta hacia el Gateway R3 — La consulta a 8.8.8.8 selecciona 194.170.100.2 como siguiente salto. | `r2_ruta_gateway.png` | `routers` | Real |
| Router R2 | Comunicación con PC1-SEC | `r2_ping_sec.png` | `routers` | Real |
| Servidor DHCP | Validación de la configuración DHCP | `dhcp_configuracion.png` | `dhcp` | Real |
| Servidor DHCP | Estado del servidor DHCP | `dhcp_estado.png` | `dhcp` | Real |
| Servidor DHCP | Asignación IP en la sede principal | `dhcp_principal.png` | `dhcp` | Real |
| Servidor DHCP | Asignación IP en la sede secundaria | `dhcp_secundaria.png` | `dhcp` | Real |
| Servidor DNS | Validación de la configuración DNS | `dns_zonas.png` | `dns` | Real |
| Servidor DNS | Resolución de nombres de los servidores | `dns_resolucion.png` | `dns` | Real |
| Servidor DNS | Resolución inversa de direcciones IP | `dns_inversa.png` | `dns` | Real |
| Servidor DNS | Resolución de nombres desde la sede principal | `dns_principal.png` | `dns` | Real |
| Servidor DNS | Resolución de nombres desde la sede secundaria | `dns_secundaria.png` | `dns` | Real |
| Servidor WEB | Validación de la configuración Apache | `web_configuracion.png` | `web` | Real |
| Servidor WEB | Funcionamiento del servicio Apache2 | `web_estado.png` | `web` | Real |
| Servidor WEB | Acceso al portal desde la sede principal | `web_principal.png` | `web` | Real |
| Servidor WEB | Acceso al portal desde la sede secundaria | `web_secundaria.png` | `web` | Real |
| Servidor WEB | Acceso al portal desde la red externa — El navegador externo muestra la portada al abrir 192.168.42.87. | `web_externo.png` | `web` | Real |
| Servidor WEB | Acceso al portal desde la red externa — curl -I a 192.168.42.87 devuelve HTTP/1.1 200 OK y una cabecera de Apache. | `web_externo_consola.png` | `web` | Real |
| Servidor CORREO | Funcionamiento de los servicios de correo — postfix check termina sin mostrar errores. Los estados indican active (exited) para Postfix y active (running) para Dovecot. | `correo_servicios.png` | `correo` | Real |
| Servidor CORREO | Funcionamiento de los servicios de correo — Apache2 devuelve Syntax OK y active. ss muestra Postfix en el puerto 25 y Dovecot en los puertos 110 y 143. | `correo_apache.png` | `correo` | Real |
| Servidor CORREO | Resolución DNS y acceso al Webmail desde la sede secundaria — La consola de PC1-SEC resuelve correo.finalsoft.net a 194.170.100.6 y recibe cinco respuestas. | `dns_secundaria.png` | `dns` | Real |
| Servidor CORREO | Resolución DNS y acceso al Webmail desde la sede secundaria — Firefox muestra el formulario de SquirrelMail al abrir correo.finalsoft.net. | `correo_webmail_secundaria.png` | `correo` | Real |
| Servidor CORREO | Inicio de sesión del usuario Ingeniería — El formulario de SquirrelMail muestra el usuario ingenieria con la contraseña oculta. | `correo_login_ingenieria.png` | `correo` | Real |
| Servidor CORREO | Inicio de sesión del usuario Ingeniería — La sesión muestra la carpeta INBOX y el enlace Sign Out. La bandeja estaba vacía. | `correo_bandeja_ingenieria.png` | `correo` | Real |
| Servidor CORREO | Envío y recepción de correo interno — La ventana Compose tiene a lucas@finalsoft.net como destinatario. | `correo_envio.png` | `correo` | Real |
| Servidor CORREO | Envío y recepción de correo interno — Lucas abrió el mensaje recibido de ingenieria@finalsoft.net. | `correo_recepcion.png` | `correo` | Real |
| Servidor CORREO | Bloqueo de correos externos | `correo_bloqueo.png` | `correo` | Real |
| Servidor BACKUP | Conectividad con el servidor WEB | `backup_ping_web.png` | `backup` | Real |
| Servidor BACKUP | Transferencia mediante rsync — El script usa rsync por SSH. La sesión interactiva se rechaza, como muestra la consola. | `backup_rsync.png` | `backup` | Real |
| Servidor BACKUP | Transferencia mediante rsync — El script de respaldo termina con código de salida 0. | `backup_ejecucion.png` | `backup` | Real |
| Servidor BACKUP | Transferencia mediante rsync — El listado del respaldo muestra html/index.html. | `backup_contenido.png` | `backup` | Real |
| Servidor BACKUP | Ejecución del script de respaldo | `backup_ejecucion.png` | `backup` | Real |
| Servidor BACKUP | Archivo de respaldo generado | `backup_archivo.png` | `backup` | Real |
| Servidor BACKUP | Contenido del archivo respaldado | `backup_contenido.png` | `backup` | Real |
| Servidor BACKUP | Programación diaria con cron | `backup_cron.png` | `backup` | Real |
| Gateway R3 | Direcciones de las interfaces del Gateway | `gateway_interfaces.png` | `gateway` | Real |
| Gateway R3 | Rutas del Gateway | `gateway_rutas.png` | `gateway` | Real |
| Gateway R3 | Comunicación del Gateway con R2 | `gateway_ping_r2.png` | `gateway` | Real |
| Gateway R3 | Comunicación del Gateway con PC1-SEC | `gateway_ping_sec.png` | `gateway` | Real |
| Gateway R3 | Acceso a Internet desde el Gateway | `gateway_internet.png` | `gateway` | Real |
| Gateway R3 | Acceso a Internet desde ambas sedes — PC2-PRI registra cinco respuestas de 8.8.8.8. | `gateway_internet_principal.png` | `gateway` | Real |
| Gateway R3 | Acceso a Internet desde ambas sedes — PC1-SEC registra cinco respuestas de 8.8.8.8. | `gateway_internet_secundaria.png` | `gateway` | Real |
| Gateway R3 | Acceso a Internet desde ambas sedes — Los contadores de FORWARD muestran paquetes aceptados de 194.170.100.0/24 y 194.170.200.0/24. | `gateway_forward.png` | `gateway` | Real |
| Gateway R3 | NAT de salida y redirección | `gateway_nat.png` | `gateway` | Real |
| Gateway R3 | Redirección HTTP al servidor WEB — La portada se muestra al abrir la IP externa de R3 desde el navegador. | `web_externo.png` | `web` | Real |
| Gateway R3 | Redirección HTTP al servidor WEB — curl -I a 192.168.42.87 devuelve HTTP/1.1 200 OK. | `web_externo_consola.png` | `web` | Real |
| Gateway R3 | Bloqueo de SSH externo | `gateway_ssh.png` | `gateway` | Real |
| Gateway R3 | Bloqueo del tráfico entrante no autorizado — El resumen del ping externo registra 4 enviados, 0 recibidos y 100 % de pérdida. | `gateway_bloqueo_icmp.png` | `gateway` | Real |
| Gateway R3 | Bloqueo del tráfico entrante no autorizado — Las cadenas INPUT y FORWARD muestran las reglas DROP aplicadas al tráfico externo. | `gateway_bloqueo_firewall.png` | `gateway` | Real |
| Gateway R3 | Persistencia de las reglas después del reinicio | `gateway_persistencia.png` | `gateway` | Real |

## Pruebas generales

| Equipo o sede | Verificación | Archivo | Carpeta | Estado |
| --- | --- | --- | --- | --- |
| Sede principal | 01. DHCP | `dhcp_principal.png` | `dhcp` | Real |
| Sede principal | 02. DNS | `dns_principal.png` | `dns` | Real |
| Sede principal | 03. WEB | `web_principal.png` | `web` | Real |
| Sede principal | 04. BACKUP — cron está activo y el crontab programa backup_web.sh a las 8:15 a. m. | `backup_cron.png` | `backup` | Real |
| Sede principal | 04. BACKUP — El directorio /backups/web contiene los .tar.gz y el registro muestra entradas «COPIA EXITOSA». | `backup_archivo.png` | `backup` | Real |
| Sede principal | 05. CORREO — Envío — El formulario de composición tiene a lucas@finalsoft.net como destinatario. | `correo_envio.png` | `correo` | Real |
| Sede principal | 05. CORREO — Envío — El mensaje abierto en INBOX identifica a ingenieria@finalsoft.net como remitente. | `correo_recepcion.png` | `correo` | Real |
| Sede principal | 06. CORREO — Recepción | `correo_recepcion.png` | `correo` | Real |
| Sede principal | 07. Acceso a Internet | `gateway_internet_principal.png` | `gateway` | Real |
| Sede secundaria | 08. Conectividad entre sedes | `dns_secundaria.png` | `dns` | Real |
| Sede secundaria | 09. DHCP | `dhcp_secundaria.png` | `dhcp` | Real |
| Sede secundaria | 10. DNS | `dns_secundaria.png` | `dns` | Real |
| Sede secundaria | 11. Acceso a Internet | `gateway_internet_secundaria.png` | `gateway` | Real |
| Sede secundaria | 12. Acceso externo al WEB — El navegador muestra el portal al abrir la dirección externa de R3. | `web_externo.png` | `web` | Real |
| Sede secundaria | 12. Acceso externo al WEB — curl -I recibe HTTP/1.1 200 OK desde 192.168.42.87. | `web_externo_consola.png` | `web` | Real |
| Firewall | 13. Salida a Internet desde ambas sedes | `gateway_forward.png` | `gateway` | Real |
| Firewall | 14. Acceso HTTP externo al servidor WEB | `web_externo_consola.png` | `web` | Real |
| Firewall | 15. Bloqueo de conexiones SSH externas | `gateway_ssh.png` | `gateway` | Real |
| Firewall | 16. Bloqueo del tráfico entrante no autorizado — El resumen de ping registra 4 paquetes enviados, 0 recibidos y 100 % de pérdida. | `gateway_bloqueo_icmp.png` | `gateway` | Real |
| Firewall | 16. Bloqueo del tráfico entrante no autorizado — INPUT y FORWARD muestran las reglas DROP para paquetes entrantes por ens4. | `gateway_bloqueo_firewall.png` | `gateway` | Real |
