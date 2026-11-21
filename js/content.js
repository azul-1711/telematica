/* Contenido documentado en docs/Proyecto_Final_Routers_Sedes.docx.
   Capturas: carpeta evidencias/ (solo se listan las que existen). */
window.FINALSOFT = {
 "networks": [
  [
   "Sede principal",
   "194.170.100.0/24"
  ],
  [
   "Sede secundaria",
   "194.170.200.0/24"
  ],
  [
   "Enlace R1 ↔ R2",
   "200.10.20.0/30"
  ],
  [
   "Red externa NAT1",
   "192.168.42.0/24"
  ]
 ],
 "devices": [
  [
   "R1 · Secundaria",
   "194.170.200.254"
  ],
  [
   "R2 · Principal",
   "194.170.100.1"
  ],
  [
   "R3 · Gateway",
   "194.170.100.2"
  ],
  [
   "DHCP",
   "194.170.100.3"
  ],
  [
   "DNS",
   "194.170.100.4"
  ],
  [
   "WEB",
   "194.170.100.5"
  ],
  [
   "CORREO",
   "194.170.100.6"
  ],
  [
   "BACKUP",
   "194.170.100.7"
  ]
 ],
 "chapters": [
  {
   "id": "r1",
   "group": "routers",
   "number": "01",
   "title": "Router R1",
   "sub": "Sede secundaria · Enrutamiento y relay",
   "ip": "194.170.200.254",
   "lead": "Se utilizó un nodo Debian con dos interfaces virtio-net-pci para enlazar la sede secundaria con R2. La interfaz ens3 pertenece al enlace punto a punto; ens4 conecta la LAN secundaria.",
   "reason": "GNS3 empleó nodos Debian como routers porque en el entorno de trabajo se disponía de un switch de capa 2, pero no de un dispositivo router. Linux permite enrutar paquetes al habilitar ip_forward.",
   "setup": "En GNS3 se asignaron dos adaptadores a R1. Se configuraron las direcciones estáticas y la ruta por defecto hacia R2, se habilitó el reenvío IPv4 y se instaló isc-dhcp-relay para atender a los clientes de la sede secundaria.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet static\n    address 200.10.20.2\n    netmask 255.255.255.252\n    gateway 200.10.20.1\n\nauto ens4\niface ens4 inet static\n    address 194.170.200.254\n    netmask 255.255.255.0"
    ],
    [
     "/etc/sysctl.conf y aplicación",
     "net.ipv4.ip_forward=1\n\nsudo sysctl -p\nsudo systemctl restart networking"
    ],
    [
     "/etc/default/isc-dhcp-relay",
     "SERVERS=\"194.170.100.3\"\nINTERFACES=\"ens3 ens4\"\nOPTIONS=\"\""
    ]
   ],
   "tests": [
    "ping 200.10.20.1: verificar comunicación con R2",
    "ip a: ens3 = 200.10.20.2/30; ens4 = 194.170.200.254/24",
    "ip route: ruta por defecto hacia 200.10.20.1",
    "DHCP Relay: clientes secundarios obtuvieron IP del servidor 194.170.100.3"
   ],
   "images": [
    [
     "routers/r2-config.png",
     "Ping de R2 hacia R1 por el enlace WAN (0 % de pérdida)"
    ]
   ]
  },
  {
   "id": "r2",
   "group": "routers",
   "number": "02",
   "title": "Router R2",
   "sub": "Sede principal · Enlace entre redes",
   "ip": "194.170.100.1",
   "lead": "R2 conecta la sede principal con R1 por la red WAN 200.10.20.0/30. Es el siguiente salto para la red secundaria y envía el tráfico destinado a Internet hacia R3.",
   "reason": "Las dos sedes están en subredes distintas. R2 conoce la red secundaria mediante una ruta estática y recibe el tráfico de R1 para reenviarlo a los servicios de la sede principal.",
   "setup": "Se configuraron ens3 y ens4 con IP fija, una ruta hacia 194.170.200.0/24 y la ruta por defecto a 194.170.100.2. El reenvío IPv4 está activado.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet static\n    address 200.10.20.1\n    netmask 255.255.255.252\n    up ip route add 194.170.200.0/24 via 200.10.20.2\n\nauto ens4\niface ens4 inet static\n    address 194.170.100.1\n    netmask 255.255.255.0\n    up ip route add default via 194.170.100.2"
    ],
    [
     "/etc/sysctl.conf",
     "net.ipv4.ip_forward=1\n\nsudo sysctl -p\nsudo systemctl restart networking"
    ]
   ],
   "tests": [
    "ping 200.10.20.2: 0 % de paquetes perdidos en la prueba documentada",
    "ip route: ruta hacia la sede secundaria por R1",
    "ip route: ruta por defecto hacia el gateway R3"
   ],
   "images": [
    [
     "routers/r2-config.png",
     "Interfaces, rutas y ping de R2 hacia R1"
    ]
   ]
  },
  {
   "id": "dhcp",
   "group": "servicios",
   "number": "03",
   "title": "Servidor DHCP",
   "sub": "Asignación automática de direcciones IP",
   "ip": "194.170.100.3",
   "lead": "Un servidor DHCP centralizado asigna direcciones dinámicas a los equipos de ambas sedes y mantiene reservas por MAC para los servidores corporativos.",
   "reason": "El uso de DHCP evita configurar manualmente cada cliente. En la sede secundaria se necesita DHCP Relay porque las solicitudes iniciales se envían por broadcast y no atraviesan routers automáticamente.",
   "setup": "Se instaló isc-dhcp-server. Se definieron los rangos .100 a .200 por sede, el router de cada LAN y el DNS interno. Se configuraron reservas para DNS, WEB, CORREO y BACKUP.",
   "blocks": [
    [
     "/etc/default/isc-dhcp-server",
     "INTERFACESv4=\"ens3\"\nINTERFACESv6=\"\""
    ],
    [
     "/etc/dhcp/dhcpd.conf (extracto)",
     "authoritative;\ndefault-lease-time 600;\nmax-lease-time 7200;\n\nsubnet 194.170.100.0 netmask 255.255.255.0 {\n  range 194.170.100.100 194.170.100.200;\n  option routers 194.170.100.1;\n  option domain-name-servers 194.170.100.4, 8.8.8.8;\n}\nsubnet 194.170.200.0 netmask 255.255.255.0 {\n  range 194.170.200.100 194.170.200.200;\n  option routers 194.170.200.254;\n  option domain-name-servers 194.170.100.4, 8.8.8.8;\n}"
    ],
    [
     "Validación",
     "sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf\nsudo systemctl restart isc-dhcp-server\nip a"
    ]
   ],
   "tests": [
    "dhcpd -t: no mostró errores de sintaxis",
    "Clientes de sede principal: recibieron direcciones 194.170.100.100–200",
    "Clientes de sede secundaria: recibieron direcciones 194.170.200.100–200 mediante relay"
   ],
   "images": [
    [
     "dhcp/servidor-estado.png",
     "Servidor DHCP: sintaxis, estado del servicio y concesiones en el log"
    ],
    [
     "dhcp/cliente-secundaria.png",
     "IP obtenida por DHCP en la sede secundaria (relay)"
    ]
   ]
  },
  {
   "id": "dns",
   "group": "servicios",
   "number": "04",
   "title": "Servidor DNS",
   "sub": "Resolución de nombres con BIND9",
   "ip": "194.170.100.4",
   "lead": "El DNS interno resuelve el dominio finalsoft.net y los nombres de los servidores para los clientes de las dos sedes.",
   "reason": "El servicio permite usar nombres como www.finalsoft.net o correo.finalsoft.net en lugar de memorizar direcciones IP. Se configuraron zonas directa e inversa.",
   "setup": "Se instaló bind9, se declararon las zonas en named.conf.local y se crearon archivos de zona. En named.conf.options se habilitaron consultas de las redes principal y secundaria.",
   "blocks": [
    [
     "/etc/bind/named.conf.local",
     "zone \"finalsoft.net\" IN {\n  type master;\n  file \"/etc/bind/finalsoft.net/db.finalsoft.net\";\n};\nzone \"100.170.194.in-addr.arpa\" IN {\n  type master;\n  file \"/etc/bind/finalsoft.net/db.194.170.100\";\n};"
    ],
    [
     "Zona directa · registros A",
     "dns     IN A 194.170.100.4\nwww     IN A 194.170.100.5\ncorreo  IN A 194.170.100.6\nbackup  IN A 194.170.100.7"
    ],
    [
     "named.conf.options · reglas principales",
     "recursion yes;\nallow-query { localhost; 194.170.100.0/24; 194.170.200.0/24; };\nallow-recursion { localhost; 194.170.100.0/24; 194.170.200.0/24; };\nlisten-on { 127.0.0.1; 194.170.100.4; };"
    ],
    [
     "Comprobación DNS",
     "sudo named-checkconf\nsudo named-checkconf -z\ndig @127.0.0.1 www.finalsoft.net\nnslookup correo.finalsoft.net 194.170.100.4"
    ]
   ],
   "tests": [
    "named-checkzone: zonas directa e inversa cargaron correctamente",
    "www.finalsoft.net → 194.170.100.5",
    "correo.finalsoft.net → 194.170.100.6",
    "Desde PC1-SEC se resolvieron nombres internos y se confirmaron pings"
   ],
   "images": [
    [
     "dns/consulta-dns.png",
     "Zonas cargadas y consulta de www.finalsoft.net"
    ]
   ]
  },
  {
   "id": "web",
   "group": "servicios",
   "number": "05",
   "title": "Servidor WEB",
   "sub": "Portal de FinalSoft con Apache2",
   "ip": "194.170.100.5",
   "lead": "El servidor WEB aloja este portal informativo en Apache2 y lo publica mediante www.finalsoft.net. Los archivos se encuentran en /var/www/html.",
   "reason": "Apache sirve el contenido corporativo en la LAN y permite el acceso desde la red externa a través de la publicación HTTP configurada en R3.",
   "setup": "Se instaló Apache2, se configuró ServerName, se creó un VirtualHost y se estableció el directorio /var/www/html como DocumentRoot.",
   "blocks": [
    [
     "/etc/apache2/sites-available/finalsoft.conf",
     "<VirtualHost *:80>\n    ServerName www.finalsoft.net\n    DocumentRoot /var/www/html\n    ErrorLog ${APACHE_LOG_DIR}/finalsoft_error.log\n    CustomLog ${APACHE_LOG_DIR}/finalsoft_access.log combined\n</VirtualHost>"
    ],
    [
     "Habilitación y prueba",
     "sudo a2ensite finalsoft.conf\nsudo a2dissite 000-default.conf\nsudo apache2ctl configtest\nsudo systemctl restart apache2"
    ]
   ],
   "tests": [
    "apache2ctl configtest: Syntax OK",
    "Apache2: servicio activo",
    "Webterm de sede principal: acceso a http://194.170.100.5",
    "Webterm externo: acceso a http://192.168.42.87 mediante R3"
   ],
   "images": [
    [
     "web/apache-estado.png",
     "Apache2 activo y contenido de /var/www/html"
    ]
   ]
  },
  {
   "id": "correo",
   "group": "servicios",
   "number": "06",
   "title": "Servidor CORREO",
   "sub": "Postfix · Dovecot · SquirrelMail",
   "ip": "194.170.100.6",
   "lead": "Se implementó correo electrónico interno con cuentas del dominio finalsoft.net, buzones Maildir y acceso mediante webmail.",
   "reason": "Postfix se encarga del envío y la recepción SMTP; Dovecot permite consultar los buzones; SquirrelMail ofrece la interfaz web. Se restringieron los destinatarios externos desde Postfix.",
   "setup": "Se configuró Postfix con myhostname, mydestination, mynetworks y Maildir/. Se crearon cuentas locales, se configuró Dovecot y se habilitó SquirrelMail en Apache.",
   "blocks": [
    [
     "Postfix · parámetros principales",
     "myhostname = correo.finalsoft.net\nmydestination = $myhostname, finalsoft.net, localhost.localdomain, localhost\nmynetworks = 127.0.0.0/8 194.170.100.0/24 194.170.200.0/24\ninet_protocols = ipv4\nhome_mailbox = Maildir/"
    ],
    [
     "Dovecot · buzón y acceso",
     "mail_location = maildir:~/Maildir\ndisable_plaintext_auth = no\nssl = no"
    ],
    [
     "/etc/postfix/destinatarios_internos",
     "/@finalsoft\\.net$/ DUNNO\n/.*/ REJECT Solo se permite correo interno"
    ],
    [
     "Reglas y reinicio (comandos de la práctica)",
     "sudo cp /etc/postfix/main.cf /etc/postfix/main.cf.bak\nsudo /usr/sbin/postconf -e 'smtpd_recipient_restrictions = check_recipient_access regexp:/etc/postfix/destinatarios_internos'\nsudo /usr/sbin/postfix check\nsudo /usr/sbin/postfix reload"
    ]
   ],
   "tests": [
    "SquirrelMail: http://correo.finalsoft.net/webmail/",
    "Camilo → Lucas (@finalsoft.net): envío y recepción correctos",
    "SquirrelMail → Gmail: rechazado por la restricción de destinatarios",
    "Error observado: 554 5.7.1 Recipient address rejected: Solo se permite correo interno"
   ],
   "images": [
    [
     "correo/servicios-escucha.png",
     "Puertos SMTP, POP3 e IMAP en escucha y ajustes de Dovecot (laboratorio)"
    ],
    [
     "correo/squirrelmail-login.png",
     "Inicio de sesión en SquirrelMail"
    ],
    [
     "correo/correo-enviado.png",
     "Correo enviado de Camilo a Lucas"
    ],
    [
     "correo/correo-recibido.png",
     "Bandeja de entrada de Lucas con los correos recibidos"
    ],
    [
     "correo/bloqueo-gmail.png",
     "Rebote del envío a Gmail: Relay access denied"
    ]
   ],
   "note": "Los parámetros de Dovecot sin TLS corresponden únicamente al laboratorio descrito. Las restricciones originales de destinatarios documentan la prueba; para un entorno productivo hay que conservar los controles de autorización y antirrelay."
  },
  {
   "id": "backup",
   "group": "servicios",
   "number": "07",
   "title": "Servidor BACKUP",
   "sub": "Copias automáticas del portal WEB",
   "ip": "194.170.100.7",
   "lead": "Se implementaron copias automáticas de /var/www/html desde el servidor WEB hacia un equipo independiente, usando rsync, SSH, compresión y cron.",
   "reason": "Mantener una copia del portal en otro servidor permite recuperar contenido si los archivos del servidor WEB se pierden o alteran. La autenticación por claves posibilita ejecuciones automatizadas.",
   "setup": "Se creó el usuario respaldo en el servidor WEB, se generaron claves SSH Ed25519 desde BACKUP, se restringió su acceso de lectura y se instaló un script de respaldo ejecutado a diario a las 8:15 a. m.",
   "blocks": [
    [
     "Herramientas instaladas",
     "# En BACKUP\nsudo apt install rsync openssh-client cron -y\n# En WEB\nsudo apt install openssh-server rsync -y"
    ],
    [
     "/usr/local/bin/backup_web.sh (flujo resumido)",
     "#!/bin/bash\nset -euo pipefail\n# 1. Descargar /var/www/html mediante rsync y SSH\n# 2. Comprimir el contenido en .tar.gz\n# 3. Guardarlo en /backups/web/\n# 4. Eliminar archivos con más de siete días\n# 5. Registrar la ejecución en /backups/backup.log"
    ],
    [
     "Cron · tarea programada",
     "sudo crontab -e\n# Todos los días a las 08:15 (America/Bogota)\n15 8 * * * /usr/local/bin/backup_web.sh"
    ],
    [
     "Prueba manual",
     "sudo /usr/local/bin/backup_web.sh\nsudo ls -lh /backups/web/\nsudo cat /backups/backup.log"
    ]
   ],
   "tests": [
    "Ping exitoso desde BACKUP hacia WEB",
    "Transferencia de archivos verificada con rsync",
    "Se generó web_2026-11-19_22-19.tar.gz",
    "Registro: COPIA EXITOSA",
    "Cron programado diariamente a las 8:15 a. m."
   ],
   "images": [
    [
     "backup/copia-generada.png",
     "Cron 08:15, archivo .tar.gz y registro «COPIA EXITOSA»"
    ]
   ]
  },
  {
   "id": "r3",
   "group": "gateway",
   "number": "08",
   "title": "Gateway R3",
   "sub": "Internet, NAT y reglas de firewall",
   "ip": "194.170.100.2",
   "lead": "R3 es el gateway entre las redes internas y la red externa NAT1. Se configuró para dar salida a Internet a ambas sedes y publicar el servidor WEB por HTTP.",
   "reason": "Se utilizó MASQUERADE para compartir la dirección externa de R3; DNAT redirige conexiones HTTP al servidor WEB. El firewall permite tráfico autorizado y descarta accesos externos no permitidos.",
   "setup": "Se configuraron ens3 en la LAN principal y ens4 por DHCP en NAT1; se activó el reenvío IPv4, se estableció la ruta hacia la sede secundaria y se guardaron las reglas con iptables-persistent.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet static\n    address 194.170.100.2\n    netmask 255.255.255.0\n    up ip route add 194.170.200.0/24 via 194.170.100.1\n\nauto ens4\niface ens4 inet dhcp"
    ],
    [
     "Reenvío IPv4",
     "echo \"net.ipv4.ip_forward=1\" | sudo tee /etc/sysctl.d/99-gateway.conf\nsudo sysctl --system"
    ],
    [
     "NAT y acceso HTTP",
     "sudo iptables -t nat -A POSTROUTING -s 194.170.100.0/24 -o ens4 -j MASQUERADE\nsudo iptables -t nat -A POSTROUTING -s 194.170.200.0/24 -o ens4 -j MASQUERADE\nsudo iptables -t nat -A PREROUTING -i ens4 -p tcp --dport 80 -j DNAT --to-destination 194.170.100.5:80"
    ],
    [
     "Firewall · cadena INPUT (tráfico hacia R3)",
     "sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A INPUT -i lo -j ACCEPT\nsudo iptables -A INPUT -i ens4 -p tcp --dport 22 -j DROP\nsudo iptables -A INPUT -i ens4 -j DROP"
    ],
    [
     "Firewall · cadena FORWARD (tráfico que atraviesa R3)",
     "sudo iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A FORWARD -i ens3 -o ens4 -s 194.170.100.0/24 -j ACCEPT\nsudo iptables -A FORWARD -i ens3 -o ens4 -s 194.170.200.0/24 -j ACCEPT\nsudo iptables -A FORWARD -i ens4 -o ens3 -p tcp -d 194.170.100.5 --dport 80 -j ACCEPT\nsudo iptables -A FORWARD -i ens4 -p tcp --dport 22 -j DROP\nsudo iptables -A FORWARD -i ens4 -j DROP"
    ],
    [
     "Persistencia",
     "sudo apt install -y iptables-persistent\nsudo netfilter-persistent save\nsudo systemctl enable netfilter-persistent"
    ]
   ],
   "tests": [
    "R3 → 8.8.8.8: ping exitoso",
    "Ambas sedes: se comprobó salida a Internet",
    "Webterm externo: curl -I http://192.168.42.87 → HTTP/1.1 200 OK",
    "Acceso SSH externo a R3: tiempo de espera por el DROP del puerto 22 en INPUT",
    "Ping desde el Webterm externo a 192.168.42.87: 100 % de pérdida (INPUT descarta el tráfico no autorizado)",
    "NAT y FORWARD persistieron tras reiniciar"
   ],
   "images": [
    [
     "internet/acceso-web-externo.png",
     "Acceso web externo (HTTP 200) y tráfico no autorizado bloqueado (ping sin respuesta, SSH con tiempo agotado)"
    ]
   ]
  }
 ]
};
