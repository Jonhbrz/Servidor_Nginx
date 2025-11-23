# Configuración del Certificado SSL Autofirmado

Este documento describe el proceso completo para instalar OpenSSL en Windows, generar un certificado SSL autofirmado y aplicarlo a un servidor NGINX dentro de un contenedor Docker.  
Además, se detallan las modificaciones realizadas tanto en `nginx.conf` como en el `Dockerfile`, junto con comandos de prueba para verificar el funcionamiento.

---

## 1. Instalación de OpenSSL en Windows

Para poder generar certificados desde Windows se utilizó OpenSSL.  
Como el PATH del sistema estaba saturado, se ejecutó mediante su ruta absoluta:

### Comprobación de OpenSSL:
```powershell
& "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" version
```

---

## 2. Generación del certificado SSL autofirmado

Dentro del directorio principal del proyecto:

```powershell
cd "C:\Users\jonat\Documents\DAWs\2º\DPL\SERVIDOR-NGINX\project"
mkdir ssl
```

Generación del certificado:

```powershell
& "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" req -x509 -nodes -days 365 `
  -newkey rsa:2048 `
  -keyout ssl/selfsigned.key `
  -out ssl/selfsigned.crt `
  -subj "/C=ES/ST=Tenerife/L=SantaCruz/O=Dev/OU=IT/CN=localhost"
```

Certificados generados:

```
ssl/selfsigned.key  
ssl/selfsigned.crt
```

---

## 3. Modificaciones realizadas en `nginx.conf`

Se añadieron tres bloques fundamentales:

### ✔ Redirección global HTTP → HTTPS
```nginx
server {
    listen 80 default_server;
    server_name _;

    return 301 https://$host$request_uri;
}
```

### ✔ Servidor HTTPS para app1
```nginx
server {
    listen 443 ssl;
    server_name app1;

    ssl_certificate     /etc/nginx/ssl/selfsigned.crt;
    ssl_certificate_key /etc/nginx/ssl/selfsigned.key;

    root /var/www/app1;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### ✔ Servidor HTTPS para app2 (puerto 444)
```nginx
server {
    listen 444 ssl;
    server_name app2;

    ssl_certificate     /etc/nginx/ssl/selfsigned.crt;
    ssl_certificate_key /etc/nginx/ssl/selfsigned.key;

    root /var/www/app2;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## 4. Modificaciones realizadas en el `Dockerfile`

Se añadió:

### ✔ Instalación de OpenSSL dentro del contenedor
```dockerfile
apt-get install -y nginx openssl
```

### ✔ Copia de certificados dentro del contenedor
```dockerfile
COPY ssl/selfsigned.crt /etc/nginx/ssl/
COPY ssl/selfsigned.key /etc/nginx/ssl/
```

### ✔ Exposición de puertos HTTPS
```dockerfile
EXPOSE 80 443 444
```

---

## 5. Construcción y ejecución del contenedor

Construir la imagen:

```powershell
docker build -t nginx-ssl .
```

Ejecutar el contenedor:

```powershell
docker run -d --name nginx-ssl -p 80:80 -p 443:443 -p 444:444 nginx-ssl
```

---

## 6. Comandos de prueba

### ✔ Verificar el certificado
```powershell
openssl x509 -in ssl/selfsigned.crt -text -noout
```

### ✔ Probar redirección HTTP
```powershell
curl -I http://localhost
```

Salida esperada:
```
HTTP/1.1 301 Moved Permanently
```

### ✔ Probar HTTPS de app1
```powershell
curl -kI https://localhost
```

### ✔ Probar HTTPS de app2
```powershell
curl -kI https://localhost:444
```

---

## Resultado final

Se obtiene un entorno Docker con NGINX configurado para:

- HTTPS con certificado autofirmado  
- Redirección de HTTP → HTTPS  
- Soporte para múltiples aplicaciones (app1 y app2)  
- Certificados gestionados correctamente dentro del contenedor  