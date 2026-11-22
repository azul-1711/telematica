/* Contenido documentado en docs/Proyecto_Final_Routers_Sedes (4)(1).docx.
   Capturas: carpeta evidencias/ (solo se listan las que existen). */
window.FINALSOFT = {
 "networks": {
  "sedes": [
   [
    "Principal",
    "194.170.100.0/24",
    "255.255.255.0",
    "194.170.100.1",
    "194.170.100.255",
    "194.170.100.100 – 194.170.100.200"
   ],
   [
    "Secundaria",
    "194.170.200.0/24",
    "255.255.255.0",
    "194.170.200.254",
    "194.170.200.255",
    "194.170.200.100 – 194.170.200.200"
   ]
  ],
  "interconexion": [
   [
    "Enlace WAN R1 ↔ R2",
    "200.10.20.0/30",
    "255.255.255.252",
    "Comunicación punto a punto entre los routers"
   ],
   [
    "Red externa NAT1",
    "192.168.42.0/24",
    "255.255.255.0",
    "Conexión del Gateway con la red externa simulada"
   ]
  ],
  "extremosWan": [
   [
    "R1",
    "200.10.20.2"
   ],
   [
    "R2",
    "200.10.20.1"
   ]
  ]
 },
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
    [
     "Comunicación entre routers",
     "Se hizo ping a R2 en 200.10.20.1 por el enlace WAN. Respondieron los cuatro paquetes, sin pérdida.",
     {
      "image": [
       "routers/r1-ping-interfaces.png",
       "Al final de la consola, el resumen del ping registra 4 enviados y 4 recibidos."
      ]
     }
    ],
    [
     "Direcciones de las interfaces",
     "Se consultaron las interfaces de R1. Ens3 (WAN) estaba activa con 200.10.20.2/30 y ens4 (LAN secundaria) con 194.170.200.254/24.",
     {
      "image": [
       "routers/r1_interfaces.png",
       "La salida de ip addr muestra ambas interfaces en estado UP y sus prefijos."
      ]
     }
    ],
    [
     "Enrutamiento",
     "La tabla de rutas muestra la salida por defecto hacia R2 (200.10.20.1) y las redes conectadas de la WAN y de la sede secundaria.",
     {
      "image": [
       "routers/r1-rutas.png",
       "ip route indica la ruta por defecto por ens3 y la red 194.170.200.0/24 por ens4."
      ]
     }
    ],
    [
     "Servicio DHCP Relay",
     "Se revisó el estado de isc-dhcp-relay en R1. El servicio estaba en ejecución y apuntaba al servidor DHCP 194.170.100.3.",
     {
      "image": [
       "routers/r1-dhcp-relay.png",
       "La consola muestra active (running) y el proceso dhcrelay con ens3 y ens4."
      ]
     }
    ],
    [
     "Asignación IP al cliente de la sede secundaria",
     "PC1-SEC solicitó una dirección con ip dhcp. La salida de show ip confirmó la concesión y estos parámetros.",
     {
      "details": [
       [
        "Dirección IP",
        "194.170.200.101/24"
       ],
       [
        "Gateway",
        "194.170.200.254"
       ],
       [
        "DNS",
        "194.170.100.4"
       ],
       [
        "Servidor DHCP",
        "194.170.100.3"
       ]
      ],
      "image": [
       "dhcp/dhcp_secundaria.png",
       "PC1-SEC recibió 194.170.200.101/24 del servidor DHCP 194.170.100.3."
      ]
     }
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
   "setup": "R2 es un nodo Debian en QEMU con dos adaptadores virtio-net-pci. La interfaz ens3 conecta con R1 por la WAN y ens4 conecta con la sede principal. R2 envía el tráfico a la sede secundaria por R1 y el resto por R3.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet static\n        address 200.10.20.1\n        netmask 255.255.255.252\n        up ip route add 194.170.200.0/24 via 200.10.20.2\n\nauto ens4\niface ens4 inet static\n        address 194.170.100.1\n        netmask 255.255.255.0\n        up ip route add default via 194.170.100.2",
     "Las interfaces se configuraron con direcciones fijas. La ruta a la sede secundaria usa el extremo WAN de R1 y la ruta por defecto usa la dirección LAN de R3."
    ],
    [
     "/etc/sysctl.conf",
     "net.ipv4.ip_forward=1",
     "El reenvío IPv4 permite que R2 pase paquetes entre la WAN y la LAN."
    ],
    [
     "Aplicar los cambios",
     "sudo sysctl -p\nsudo systemctl restart networking",
     "Estos comandos aplican el reenvío y recargan la configuración de las interfaces."
    ]
   ],
   "tests": [
    [
     "Comunicación con R1",
     "R2 hizo ping a R1 en 200.10.20.2 por el enlace WAN. Los cuatro paquetes recibieron respuesta.",
     {
      "image": [
       "routers/r2_ping_r1.png",
       "El resumen del ping registra 0 % de pérdida hacia 200.10.20.2."
      ]
     }
    ],
    [
     "Direcciones de las interfaces",
     "Se consultaron las interfaces de R2. Ens3 estaba activa con 200.10.20.1/30 y ens4 con 194.170.100.1/24.",
     {
      "image": [
       "routers/r2_interfaces.png",
       "ip addr muestra ens3 y ens4 en estado UP con sus direcciones WAN y LAN."
      ]
     }
    ],
    [
     "Ruta hacia la sede secundaria",
     "Se consultó la ruta hacia PC1-SEC (194.170.200.101). R2 seleccionó a R1 (200.10.20.2) como siguiente salto por ens3.",
     {
      "image": [
       "routers/r2_ruta_secundaria.png",
       "ip route get muestra 194.170.200.101 via 200.10.20.2 dev ens3."
      ]
     }
    ],
    [
     "Ruta hacia el Gateway R3",
     "Se revisó la tabla de R2 y se consultó una ruta a Internet. La salida seleccionada pasa por 194.170.100.2 en ens4.",
     {
      "images": [
       [
        "routers/r2-config.png",
        "La tabla de rutas muestra la salida por defecto hacia R3 por ens4."
       ],
       [
        "routers/r2_ruta_gateway.png",
        "La consulta a 8.8.8.8 selecciona 194.170.100.2 como siguiente salto."
       ]
      ]
     }
    ],
    [
     "Comunicación con PC1-SEC",
     "Se hizo ping desde R2 a PC1-SEC en 194.170.200.101. El cliente respondió los cuatro paquetes.",
     {
      "image": [
       "routers/r2_ping_sec.png",
       "El resumen de ping a PC1-SEC registra 4 recibidos y 0 % de pérdida."
      ]
     }
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
   "setup": "ISC DHCP Server corre en Debian y atiende a las dos sedes desde 194.170.100.3. Para la sede secundaria recibe las solicitudes que reenvía el DHCP Relay de R1.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet static\n        address 194.170.100.3\n        netmask 255.255.255.0\n        gateway 194.170.100.1",
     "La dirección de DHCP es fija para que R1 y los clientes puedan ubicar el servicio."
    ],
    [
     "/etc/default/isc-dhcp-server",
     "INTERFACESv4=\"ens3\"\nINTERFACESv6=\"\"",
     "El servicio escucha solicitudes IPv4 en la interfaz ens3 de la sede principal."
    ],
    [
     "/etc/dhcp/dhcpd.conf · rangos y DNS",
     "authoritative;\ndefault-lease-time 600;\nmax-lease-time 7200;\nignore client-updates;\nsubnet 194.170.100.0 netmask 255.255.255.0 {\n        range 194.170.100.100 194.170.100.200;\n        option routers 194.170.100.1;\n        option subnet-mask 255.255.255.0;\n        option broadcast-address 194.170.100.255;\n        option domain-name-servers 194.170.100.4, 8.8.8.8;\n}\nsubnet 194.170.200.0 netmask 255.255.255.0 {\n        range 194.170.200.100 194.170.200.200;\n        option routers 194.170.200.254;\n        option subnet-mask 255.255.255.0;\n        option broadcast-address 194.170.200.255;\n        option domain-name-servers 194.170.100.4, 8.8.8.8;\n}",
     "Cada subred tiene su propio rango, gateway y broadcast. Ambas reciben el DNS interno 194.170.100.4 y el DNS de respaldo 8.8.8.8."
    ],
    [
     "/etc/dhcp/dhcpd.conf · reservas por MAC",
     "host servidor-dns {\n        hardware ethernet 0c:1e:54:48:00:00;\n        fixed-address 194.170.100.4;\n        option subnet-mask 255.255.255.0;\n        option broadcast-address 194.170.100.255;\n}\nhost servidor-web {\n        hardware ethernet 0c:2f:01:4c:00:00;\n        fixed-address 194.170.100.5;\n        option subnet-mask 255.255.255.0;\n        option broadcast-address 194.170.100.255;\n}\nhost servidor-correo {\n        hardware ethernet 0c:ef:06:a0:00:00;\n        fixed-address 194.170.100.6;\n        option subnet-mask 255.255.255.0;\n        option broadcast-address 194.170.100.255;\n}\nhost servidor-backup {\n        hardware ethernet 0c:71:63:a2:00:00;\n        fixed-address 194.170.100.7;\n        option subnet-mask 255.255.255.0;\n        option broadcast-address 194.170.100.255;\n}",
     "DNS, WEB, CORREO y BACKUP reciben direcciones constantes, fuera del rango dinámico."
    ],
    [
     "Validar y aplicar",
     "sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf\nsudo systemctl restart isc-dhcp-server",
     "La validación comprueba la sintaxis del archivo antes de reiniciar ISC DHCP Server."
    ]
   ],
   "tests": [
    [
     "Validación de la configuración DHCP",
     "Se revisó la sintaxis de dhcpd.conf con dhcpd -t. La consola volvió al indicador de comandos sin reportar errores.",
     {
      "image": [
       "dhcp/dhcp_configuracion.png",
       "La comprobación carga /etc/dhcp/dhcpd.conf y termina sin mostrar errores de sintaxis."
      ]
     }
    ],
    [
     "Estado del servidor DHCP",
     "Se consultó el servicio isc-dhcp-server. El proceso estaba en ejecución y el registro mostraba concesiones DHCP confirmadas.",
     {
      "image": [
       "dhcp/dhcp_estado.png",
       "El estado muestra active (running) y entradas DHCPACK, incluida la concesión 194.170.200.101."
      ]
     }
    ],
    [
     "Asignación IP en la sede principal",
     "PC2-PRI solicitó una concesión DHCP. El cliente recibió 194.170.100.105/24 y la puerta de enlace 194.170.100.1.",
     {
      "image": [
       "dhcp/dhcp_principal.png",
       "show ip identifica el servidor DHCP 194.170.100.3 y la IP obtenida por PC2-PRI."
      ]
     }
    ],
    [
     "Asignación IP en la sede secundaria",
     "PC1-SEC solicitó una concesión DHCP desde la sede secundaria. Recibió 194.170.200.101/24 del servidor 194.170.100.3.",
     {
      "image": [
       "dhcp/dhcp_secundaria.png",
       "show ip muestra la concesión del cliente y su puerta de enlace 194.170.200.254."
      ]
     }
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
   "setup": "BIND9 aloja el dominio interno finalsoft.net en 194.170.100.4. Las herramientas de dnsutils permiten consultar los nombres y comprobar la resolución inversa.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet dhcp",
     "La interfaz usa DHCP y recibe la IP reservada para el servidor DNS."
    ],
    [
     "/etc/bind/named.conf.local",
     "zone \"finalsoft.net\" IN {\n    type master;\n    file \"/etc/bind/finalsoft.net/db.finalsoft.net\";\n};\n\nzone \"100.170.194.in-addr.arpa\" IN {\n    type master;\n    file \"/etc/bind/finalsoft.net/db.194.170.100\";\n};",
     "Se declaran la zona del dominio y la zona inversa de la red principal y se indican sus archivos."
    ],
    [
     "/etc/bind/finalsoft.net/db.finalsoft.net · registros A",
     "dns     IN  A       194.170.100.4\nwww     IN  A       194.170.100.5\ncorreo  IN  A       194.170.100.6\nbackup  IN  A       194.170.100.7",
     "Los registros A relacionan los nombres de los cuatro servidores con sus direcciones."
    ],
    [
     "/etc/bind/finalsoft.net/db.194.170.100 · registros PTR",
     "4       IN  PTR     dns.finalsoft.net.\n5       IN  PTR     www.finalsoft.net.\n6       IN  PTR     correo.finalsoft.net.\n7       IN  PTR     backup.finalsoft.net.",
     "Los registros PTR permiten consultar el nombre de un servidor a partir de su IP."
    ],
    [
     "/etc/bind/named.conf.options",
     "options {\n    directory \"/var/cache/bind\";\n    recursion yes;\n    allow-query {\n        localhost;\n        194.170.100.0/24;\n        194.170.200.0/24;\n    };\n    allow-recursion {\n        localhost;\n        194.170.100.0/24;\n        194.170.200.0/24;\n    };\n    listen-on {\n        127.0.0.1;\n        194.170.100.4;\n    };\n    listen-on-v6 { none; };\n    dnssec-validation auto;\n};",
     "Se permiten consultas y recursión desde las dos sedes y desde el propio servidor. BIND escucha en localhost y en 194.170.100.4."
    ],
    [
     "Validar y aplicar",
     "sudo named-checkconf\nsudo systemctl restart bind9\nsudo systemctl status bind9",
     "Se valida la configuración, se reinicia BIND9 y se consulta su estado."
    ]
   ],
   "tests": [
    [
     "Validación de la configuración DNS",
     "Se validaron con named-checkzone las zonas directa e inversa. named-checkconf -z confirmó que el servidor pudo cargar ambas.",
     {
      "image": [
       "dns/dns_zonas.png",
       "Las dos verificaciones de zona devuelven OK y aparecen cargadas en named-checkconf."
      ]
     }
    ],
    [
     "Resolución de nombres de los servidores",
     "Se consultaron con host los cuatro nombres internos de finalsoft.net. El servidor devolvió las siguientes direcciones.",
     {
      "image": [
       "dns/dns_resolucion.png",
       "Las consultas directas devuelven .5 para WEB, .6 para CORREO, .4 para DNS y .7 para BACKUP."
      ],
      "details": [
       [
        "www.finalsoft.net",
        "194.170.100.5"
       ],
       [
        "correo.finalsoft.net",
        "194.170.100.6"
       ],
       [
        "dns.finalsoft.net",
        "194.170.100.4"
       ],
       [
        "backup.finalsoft.net",
        "194.170.100.7"
       ]
      ]
     }
    ],
    [
     "Resolución inversa de direcciones IP",
     "Se consultaron las direcciones de los cuatro servidores. Sus registros PTR devolvieron los nombres correspondientes de finalsoft.net.",
     {
      "image": [
       "dns/dns_inversa.png",
       "host 194.170.100.5 devuelve www.finalsoft.net. La consola muestra también las respuestas PTR de .6, .4 y .7."
      ]
     }
    ],
    [
     "Resolución de nombres desde la sede principal",
     "PC2-PRI probó WEB y CORREO por dirección IP y por nombre. La consola muestra que los nombres resolvieron y que los servidores respondieron.",
     {
      "image": [
       "dns/dns_principal.png",
       "PC2-PRI resuelve www.finalsoft.net a 194.170.100.5 y correo.finalsoft.net a 194.170.100.6 antes del ping."
      ]
     }
    ],
    [
     "Resolución de nombres desde la sede secundaria",
     "PC1-SEC probó WEB y CORREO desde la sede secundaria. Ambos nombres se resolvieron y los servidores respondieron al ping.",
     {
      "image": [
       "dns/dns_secundaria.png",
       "La consola de PC1-SEC muestra las IP resueltas de WEB y CORREO seguidas por las respuestas ICMP."
      ]
     }
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
   "lead": "Apache2 aloja la página FinalSoft en /var/www/html. El portal presenta las redes, los equipos y los servicios de la infraestructura implementada en GNS3.",
   "reason": "Apache sirve el contenido corporativo en la LAN y permite el acceso desde la red externa a través de la publicación HTTP configurada en R3.",
   "setup": "Apache2 publica el portal FinalSoft en el puerto 80. El sitio usa www.finalsoft.net y sirve /var/www/html/index.html, dentro del directorio que copia el servidor BACKUP.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet dhcp",
     "La interfaz ens3 obtiene por DHCP la dirección reservada 194.170.100.5."
    ],
    [
     "/etc/apache2/apache2.conf",
     "ServerName www.finalsoft.net",
     "ServerName establece el nombre del servidor."
    ],
    [
     "/etc/apache2/sites-available/finalsoft.conf",
     "<VirtualHost *:80>\n    ServerName www.finalsoft.net\n    DocumentRoot /var/www/html\n    ErrorLog ${APACHE_LOG_DIR}/finalsoft_error.log\n    CustomLog ${APACHE_LOG_DIR}/finalsoft_access.log combined\n</VirtualHost>",
     "El VirtualHost usa el puerto 80, sirve /var/www/html y mantiene archivos de registro propios del portal."
    ],
    [
     "Activar el portal",
     "sudo a2ensite finalsoft.conf\nsudo a2dissite 000-default.conf\nsudo apache2ctl configtest\nsudo systemctl restart apache2",
     "Se habilita el sitio FinalSoft, se desactiva el sitio predeterminado y se comprueba la sintaxis antes de reiniciar Apache."
    ]
   ],
   "tests": [
    [
     "Validación de la configuración Apache",
     "Se revisó la sintaxis de Apache2 con apache2ctl configtest. El comando devolvió Syntax OK.",
     {
      "image": [
       "web/web_configuracion.png",
       "La salida Syntax OK confirma que la configuración pasa la validación de sintaxis."
      ]
     }
    ],
    [
     "Funcionamiento del servicio Apache2",
     "Se consultó el estado de Apache2. El servicio estaba en ejecución y el listado de /var/www/html mostraba index.html.",
     {
      "image": [
       "web/web_estado.png",
       "La consola muestra active (running) y el archivo index.html en el directorio WEB."
      ]
     }
    ],
    [
     "Acceso al portal desde la sede principal",
     "El Webterm de la sede principal abrió FinalSoft por HTTP en 194.170.100.5.",
     {
      "image": [
       "web/web_principal.png",
       "La barra del navegador muestra http://194.170.100.5 y la página presenta la portada de FinalSoft.",
       "webterm"
      ]
     }
    ],
    [
     "Acceso al portal desde la sede secundaria",
     "El Webterm de la sede secundaria abrió el portal de la sede principal usando www.finalsoft.net.",
     {
      "image": [
       "web/web_secundaria.png",
       "Firefox muestra la portada junto a la dirección http://www.finalsoft.net/#inicio.",
       "webterm"
      ]
     }
    ],
    [
     "Acceso al portal desde la red externa",
     "Desde la red externa se abrió el portal en 192.168.42.87 y se consultaron sus cabeceras HTTP. R3 publica el servidor WEB 194.170.100.5 por el puerto 80.",
     {
      "images": [
       [
        "web/web_externo.png",
        "El navegador externo muestra la portada al abrir 192.168.42.87.",
        "webterm"
       ],
       [
        "web/web_externo_consola.png",
        "curl -I a 192.168.42.87 devuelve HTTP/1.1 200 OK y una cabecera de Apache."
       ]
      ]
     }
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
   "setup": "Postfix recibe y entrega mensajes por SMTP. Dovecot abre los buzones Maildir por IMAP y POP3. SquirrelMail ofrece acceso desde el navegador mediante Apache2 con PHP 7.3.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet dhcp",
     "Ens3 obtiene por DHCP la dirección reservada 194.170.100.6."
    ],
    [
     "/etc/postfix/main.cf",
     "myhostname = correo.finalsoft.net\nmydestination = $myhostname, finalsoft.net, localhost.localdomain, localhost\nmynetworks = 127.0.0.0/8 194.170.100.0/24 194.170.200.0/24\ninet_protocols = ipv4\nhome_mailbox = Maildir/\nmyorigin = /etc/mailname\nsmtpd_recipient_restrictions = check_recipient_access regexp:/etc/postfix/destinatarios_internos",
     "Postfix atiende finalsoft.net y reconoce las redes de ambas sedes. Los mensajes se entregan en Maildir. La restricción de destinatarios se aplica en SMTP."
    ],
    [
     "/etc/mailname y /etc/postfix/destinatarios_internos",
     "# /etc/mailname\nfinalsoft.net\n\n# /etc/postfix/destinatarios_internos\n/@finalsoft\\.net$/ DUNNO\n/.*/ REJECT Solo se permite correo interno",
     "El primer archivo fija el dominio de origen. Las reglas del segundo permiten continuar la evaluación para destinatarios internos y rechazan los demás dominios."
    ],
    [
     "/etc/dovecot/conf.d · buzón y acceso",
     "# 10-mail.conf\nmail_location = maildir:~/Maildir\n\n# 10-auth.conf\ndisable_plaintext_auth = no\n\n# 10-ssl.conf\nssl = no",
     "Dovecot lee el formato Maildir que escribe Postfix. En el laboratorio se habilitó el acceso sin cifrado."
    ],
    [
     "SquirrelMail 1.4.22 y PHP 7.3",
     "sudo a2dismod php8.2\nsudo a2enmod php7.3\nsudo systemctl restart apache2\n\nsudo chown -R www-data:www-data /var/www/html/webmail/data /var/www/html/webmail/attach\nsudo chmod 770 /var/www/html/webmail/data /var/www/html/webmail/attach",
     "El asistente ./configure dejó el dominio finalsoft.net, IMAP en localhost:143 y SMTP en localhost:25. El sitio /webmail/ usa Apache del servidor CORREO, con acceso de www-data a las carpetas de datos y adjuntos."
    ],
    [
     "Aplicar la configuración",
     "sudo /usr/sbin/postfix check\nsudo /usr/sbin/postfix reload\nsudo systemctl restart dovecot",
     "Se valida y recarga Postfix y se reinicia Dovecot para aplicar los ajustes de los buzones."
    ]
   ],
   "tests": [
    [
     "Funcionamiento de los servicios de correo",
     "Se revisaron Postfix y Dovecot. Apache2 pasó la prueba de sintaxis y estaba activo. La consola mostró los puertos 25, 110 y 143 en escucha.",
     {
      "images": [
       [
        "correo/correo_servicios.png",
        "postfix check termina sin mostrar errores. Los estados indican active (exited) para Postfix y active (running) para Dovecot."
       ],
       [
        "correo/correo_apache.png",
        "Apache2 devuelve Syntax OK y active. ss muestra Postfix en el puerto 25 y Dovecot en los puertos 110 y 143."
       ]
      ],
      "details": [
       [
        "Validación de Postfix",
        "sudo postfix check"
       ],
       [
        "Estado de Postfix",
        "sudo systemctl status postfix"
       ],
       [
        "Estado de Dovecot",
        "sudo systemctl status dovecot"
       ],
       [
        "Validación de Apache2",
        "sudo apache2ctl configtest"
       ],
       [
        "Estado de Apache2",
        "sudo systemctl is-active apache2"
       ],
       [
        "Puertos en escucha",
        "sudo ss -lntp | grep -E ':(25|110|143)\\b'"
       ]
      ]
     }
    ],
    [
     "Resolución DNS y acceso al Webmail desde la sede secundaria",
     "Desde la sede secundaria, PC1-SEC resolvió correo.finalsoft.net y recibió respuesta al ping. El Webterm abrió SquirrelMail con ese nombre.",
     {
      "images": [
       [
        "dns/dns_secundaria.png",
        "La consola de PC1-SEC resuelve correo.finalsoft.net a 194.170.100.6 y recibe cinco respuestas."
       ],
       [
        "correo/correo_webmail_secundaria.png",
        "Firefox muestra el formulario de SquirrelMail al abrir correo.finalsoft.net.",
        "webterm"
       ]
      ]
     }
    ],
    [
     "Inicio de sesión del usuario Ingeniería",
     "Se abrió SquirrelMail con el usuario ingenieria. La segunda captura muestra la bandeja de la sesión iniciada.",
     {
      "images": [
       [
        "correo/correo_login_ingenieria.png",
        "El formulario de SquirrelMail muestra el usuario ingenieria con la contraseña oculta.",
        "webterm"
       ],
       [
        "correo/correo_bandeja_ingenieria.png",
        "La sesión muestra la carpeta INBOX y el enlace Sign Out. La bandeja estaba vacía.",
        "webterm"
       ]
      ]
     }
    ],
    [
     "Envío y recepción de correo interno",
     "Se redactó un correo desde Ingeniería para Lucas. La captura del destinatario muestra el mensaje recibido con su remitente y destinatario.",
     {
      "images": [
       [
        "correo/correo_envio.png",
        "La ventana Compose tiene a lucas@finalsoft.net como destinatario.",
        "webterm"
       ],
       [
        "correo/correo_recepcion.png",
        "Lucas abrió el mensaje recibido de ingenieria@finalsoft.net.",
        "webterm"
       ]
      ]
     }
    ],
    [
     "Bloqueo de correos externos",
     "Se intentó enviar un correo a un dominio externo. Postfix rechazó el destinatario y SquirrelMail mostró la restricción de correo interno.",
     {
      "image": [
       "correo/correo_bloqueo.png",
       "La pantalla de error muestra SMTP 554 5.7.1 y el aviso «Solo se permite correo interno».",
       "webterm"
      ]
     }
    ]
   ],
   "note": "El acceso sin SSL/TLS descrito corresponde al laboratorio."
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
   "setup": "BACKUP usa rsync por SSH, tar y cron para guardar el contenido de /var/www/html del servidor WEB en /backups/web. El acceso por clave Ed25519 está limitado al usuario respaldo.",
   "blocks": [
    [
     "Herramientas instaladas",
     "# En BACKUP\nsudo apt install rsync openssh-client cron -y\n# En WEB\nsudo apt install openssh-server rsync -y",
     "BACKUP inicia la conexión con OpenSSH y rsync. WEB recibe la conexión con OpenSSH Server y permite leer los archivos con rrsync."
    ],
    [
     "/home/respaldo/.ssh/authorized_keys",
     "command=\"/usr/bin/rrsync -ro /var/www/html\",from=\"194.170.100.7\",no-pty,no-agent-forwarding,no-port-forwarding,no-X11-forwarding ssh-ed25519 CLAVE_PUBLICA root@BACKUP",
     "La clave pública se autorizó solo desde 194.170.100.7, con lectura de /var/www/html y sin terminal interactiva. CLAVE_PUBLICA representa la clave del laboratorio."
    ],
    [
     "/usr/local/bin/backup_web.sh · transferencia y archivo",
     "FECHA=$(date +%F_%H-%M)\nDESTINO=\"/backups/web\"\nTMP=$(mktemp -d)\nARCHIVO=\"$DESTINO/web_$FECHA.tar.gz\"\nTEMP_ARCHIVO=\"$ARCHIVO.tmp\"\n\nif ! rsync -az \\\n    -e \"ssh -i /root/.ssh/id_backup -o BatchMode=yes -o StrictHostKeyChecking=yes\" \\\n    respaldo@194.170.100.5:/ \"$TMP/html/\"; then\n    echo \"$(date) ERROR: No se pudo copiar el servidor WEB\" >> /backups/backup.log\n    exit 1\nfi\ntar -czf \"$TEMP_ARCHIVO\" -C \"$TMP\" html\nmv \"$TEMP_ARCHIVO\" \"$ARCHIVO\"\nfind \"$DESTINO\" -name 'web_*.tar.gz' -mtime +7 -delete\necho \"$(date) COPIA EXITOSA: web_$FECHA.tar.gz\" >> /backups/backup.log",
     "Extracto del script. Copia por SSH a un directorio temporal, comprime el contenido y guarda el resultado bajo /backups/web. Mantiene el registro y retira archivos con más de siete días."
    ],
    [
     "Crontab de root",
     "15 8 * * * /usr/local/bin/backup_web.sh",
     "Cron ejecuta el script a las 8:15 a. m. en la zona horaria America/Bogota."
    ],
    [
     "Validar el script y la programación",
     "sudo chmod +x /usr/local/bin/backup_web.sh\nsudo bash -n /usr/local/bin/backup_web.sh\nsudo crontab -l",
     "Se habilita la ejecución, se revisa la sintaxis del script y se comprueba la tarea de cron."
    ]
   ],
   "tests": [
    [
     "Conectividad con el servidor WEB",
     "Desde BACKUP se hizo ping al servidor WEB en 194.170.100.5. Los cuatro paquetes recibieron respuesta.",
     {
      "image": [
       "backup/backup_ping_web.png",
       "El resumen de ping registra 4 enviados, 4 recibidos y 0 % de pérdida."
      ]
     }
    ],
    [
     "Transferencia mediante rsync",
     "Se revisó el uso de rsync sobre SSH en el script y se ejecutó el respaldo. El archivo resultante incluye html/index.html.",
     {
      "images": [
       [
        "backup/backup_rsync.png",
        "El script usa rsync por SSH. La sesión interactiva se rechaza, como muestra la consola."
       ],
       [
        "backup/backup_ejecucion.png",
        "El script de respaldo termina con código de salida 0."
       ],
       [
        "backup/backup_contenido.png",
        "El listado del respaldo muestra html/index.html."
       ]
      ]
     }
    ],
    [
     "Ejecución del script de respaldo",
     "Se comprobó la sintaxis de /usr/local/bin/backup_web.sh y se ejecutó el script manualmente. La consola devolvió código 0.",
     {
      "image": [
       "backup/backup_ejecucion.png",
       "La consola muestra «Sintaxis del script: CORRECTA» y el código de salida 0."
      ]
     }
    ],
    [
     "Archivo de respaldo generado",
     "Se listó /backups/web y se consultó el registro. La consola muestra archivos .tar.gz y entradas que confirman copias generadas.",
     {
      "image": [
       "backup/backup_archivo.png",
       "El listado incluye web_2026-11-19_22-19.tar.gz y el registro contiene entradas «COPIA EXITOSA»."
      ]
     }
    ],
    [
     "Contenido del archivo respaldado",
     "Se listó el contenido del .tar.gz. El respaldo incluye la página principal, hojas de estilo, scripts y recursos multimedia.",
     {
      "image": [
       "backup/backup_contenido.png",
       "El listado del archivo comprimido muestra html/index.html, html/css/styles.css y html/js/app.js."
      ]
     }
    ],
    [
     "Programación diaria con cron",
     "Se comprobó que cron estaba activo y que el crontab de root programaba el respaldo diario para las 8:15 a. m.",
     {
      "image": [
       "backup/backup_cron.png",
       "crontab -l muestra 15 8 * * * /usr/local/bin/backup_web.sh. La captura verifica la programación."
      ]
     }
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
   "setup": "R3 es un nodo Debian que conecta la LAN principal con NAT1. Usa reenvío IPv4 e iptables para la salida de ambas sedes, la publicación HTTP y el control del tráfico externo.",
   "blocks": [
    [
     "/etc/network/interfaces",
     "auto ens3\niface ens3 inet static\n        address 194.170.100.2\n        netmask 255.255.255.0\n        up ip route add 194.170.200.0/24 via 194.170.100.1\n        down ip route del 194.170.200.0/24 via 194.170.100.1 || true\nauto ens4\niface ens4 inet dhcp",
     "Ens3 tiene la IP fija 194.170.100.2 y conoce la ruta de retorno a la sede secundaria por R2. Ens4 recibe la dirección externa por DHCP de NAT1."
    ],
    [
     "Ruta por defecto y reenvío IPv4",
     "sudo ip route replace default via 192.168.42.1 dev ens4\necho \"net.ipv4.ip_forward=1\" | sudo tee /etc/sysctl.d/99-gateway.conf\nsudo sysctl --system",
     "La salida externa usa 192.168.42.1. El archivo 99-gateway.conf conserva el reenvío IPv4 entre las interfaces."
    ],
    [
     "iptables · traducción de direcciones",
     "sudo iptables -t nat -A POSTROUTING -s 194.170.100.0/24 -o ens4 -j MASQUERADE\nsudo iptables -t nat -A POSTROUTING -s 194.170.200.0/24 -o ens4 -j MASQUERADE\nsudo iptables -t nat -A PREROUTING -i ens4 -p tcp --dport 80 \\\n  -j DNAT --to-destination 194.170.100.5:80",
     "MASQUERADE da salida a las dos redes internas por ens4. DNAT reenvía las solicitudes HTTP entrantes al puerto 80 del servidor WEB."
    ],
    [
     "iptables · filtrado de entrada",
     "sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A INPUT -i lo -j ACCEPT\nsudo iptables -A INPUT -i ens4 -p tcp --dport 22 -j DROP\nsudo iptables -A INPUT -i ens4 -j DROP",
     "INPUT admite las respuestas de conexiones establecidas y el tráfico local. Descarta SSH y las demás entradas externas no autorizadas."
    ],
    [
     "iptables · filtrado de tránsito",
     "sudo iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A FORWARD -i ens3 -o ens4 -s 194.170.100.0/24 -j ACCEPT\nsudo iptables -A FORWARD -i ens3 -o ens4 -s 194.170.200.0/24 -j ACCEPT\nsudo iptables -A FORWARD -i ens4 -o ens3 -p tcp -d 194.170.100.5 \\\n  --dport 80 -j ACCEPT\nsudo iptables -A FORWARD -i ens4 -p tcp --dport 22 -j DROP\nsudo iptables -A FORWARD -i ens4 -j DROP",
     "FORWARD permite la salida de las sedes, el tráfico de retorno y la publicación HTTP. Descarta el resto del tránsito entrante por ens4."
    ],
    [
     "/etc/iptables/rules.v4 · persistencia",
     "sudo DEBIAN_FRONTEND=noninteractive apt install -y iptables-persistent\nsudo netfilter-persistent save\nsudo systemctl enable netfilter-persistent\nsudo systemctl status netfilter-persistent",
     "iptables-persistent guarda las reglas y las restaura al arrancar el Gateway."
    ]
   ],
   "tests": [
    [
     "Direcciones de las interfaces del Gateway",
     "Se revisaron las direcciones de R3. Ens3 estaba activa con 194.170.100.2/24 y ens4 con la IP dinámica 192.168.42.87/24.",
     {
      "image": [
       "gateway/gateway_interfaces.png",
       "ip addr muestra la LAN en ens3 y la dirección externa en ens4."
      ]
     }
    ],
    [
     "Rutas del Gateway",
     "Se consultaron la tabla de rutas y los siguientes saltos de R3. La salida por defecto va a 192.168.42.1 y la sede secundaria se alcanza por R2 (194.170.100.1).",
     {
      "image": [
       "gateway/gateway_rutas.png",
       "Las consultas de ruta muestran la salida a Internet por ens4 y la salida hacia la sede secundaria por ens3."
      ]
     }
    ],
    [
     "Comunicación del Gateway con R2",
     "Se hizo ping desde R3 a R2 en 194.170.100.1. Los cuatro paquetes recibieron respuesta.",
     {
      "image": [
       "gateway/gateway_ping_r2.png",
       "El resumen del ping a R2 muestra 4 recibidos y 0 % de pérdida."
      ]
     }
    ],
    [
     "Comunicación del Gateway con PC1-SEC",
     "Se hizo ping desde R3 a PC1-SEC en 194.170.200.101. Llegaron las cuatro respuestas.",
     {
      "image": [
       "gateway/gateway_ping_sec.png",
       "El resumen de ping al cliente de la sede secundaria registra 0 % de pérdida."
      ]
     }
    ],
    [
     "Acceso a Internet desde el Gateway",
     "Desde R3 se hizo ping a 8.8.8.8 y a google.com. Cada prueba recibió tres respuestas sin pérdida.",
     {
      "image": [
       "gateway/gateway_internet.png",
       "La consola muestra 3 de 3 respuestas por destino y la IP a la que resolvió google.com."
      ]
     }
    ],
    [
     "Acceso a Internet desde ambas sedes",
     "PC2-PRI y PC1-SEC hicieron ping a 8.8.8.8. Cada cliente recibió cinco respuestas y FORWARD registró tráfico permitido de ambas redes.",
     {
      "images": [
       [
        "gateway/gateway_internet_principal.png",
        "PC2-PRI registra cinco respuestas de 8.8.8.8."
       ],
       [
        "gateway/gateway_internet_secundaria.png",
        "PC1-SEC registra cinco respuestas de 8.8.8.8."
       ],
       [
        "gateway/gateway_forward.png",
        "Los contadores de FORWARD muestran paquetes aceptados de 194.170.100.0/24 y 194.170.200.0/24."
       ]
      ]
     }
    ],
    [
     "NAT de salida y redirección",
     "Se revisaron el reenvío IP y las reglas NAT de R3. La captura muestra MASQUERADE para ambas sedes y DNAT de HTTP hacia 194.170.100.5.",
     {
      "image": [
       "gateway/gateway_nat.png",
       "POSTROUTING muestra tráfico de ambas redes y PREROUTING muestra el contador de la redirección al puerto 80."
      ]
     }
    ],
    [
     "Redirección HTTP al servidor WEB",
     "Desde la red externa se abrió FinalSoft a través de 192.168.42.87. Una consulta de cabeceras confirmó que el servidor respondió HTTP 200.",
     {
      "images": [
       [
        "web/web_externo.png",
        "La portada se muestra al abrir la IP externa de R3 desde el navegador.",
        "webterm"
       ],
       [
        "web/web_externo_consola.png",
        "curl -I a 192.168.42.87 devuelve HTTP/1.1 200 OK."
       ]
      ]
     }
    ],
    [
     "Bloqueo de SSH externo",
     "Se intentó conectar por SSH a 192.168.42.87 desde la red externa. El intento agotó el tiempo de espera sin establecer sesión.",
     {
      "image": [
       "gateway/gateway_ssh.png",
       "La consola muestra «Connection timed out» para el puerto 22 de R3."
      ]
     }
    ],
    [
     "Bloqueo del tráfico entrante no autorizado",
     "Se hizo ping desde la red externa a 192.168.42.87. Los cuatro paquetes quedaron sin respuesta. Después se revisaron las reglas de filtrado.",
     {
      "images": [
       [
        "gateway/gateway_bloqueo_icmp.png",
        "El resumen del ping externo registra 4 enviados, 0 recibidos y 100 % de pérdida."
       ],
       [
        "gateway/gateway_bloqueo_firewall.png",
        "Las cadenas INPUT y FORWARD muestran las reglas DROP aplicadas al tráfico externo."
       ]
      ]
     }
    ],
    [
     "Persistencia de las reglas después del reinicio",
     "Se consultaron el servicio netfilter-persistent y el archivo de reglas guardadas. La captura verifica la configuración de persistencia. Falta un registro que muestre su comprobación después del reinicio.",
     {
      "image": [
       "gateway/gateway_persistencia.png",
       "netfilter-persistent figura como enabled y active. rules.v4 contiene las reglas MASQUERADE y DNAT."
      ]
     }
    ]
   ]
  }
 ]
};
