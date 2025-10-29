# Configuración del Servidor Nginx para Servir la Aplicación

En esta sección se explica cómo configurar **Nginx** dentro del contenedor Docker para servir una aplicación web local desde la carpeta del proyecto.

---

## 1️. Estructura del proyecto

Supongamos que tu proyecto tiene esta estructura:

```
SERVIDOR-NGINX/
├── app/
│   ├── index.html
│   ├── styles.css
│   └── dist/
│       └── main.js
├── Dockerfile
└── nginx.conf
```

* `app/` → Carpeta que contiene tu aplicación web.
* `nginx.conf` → Archivo de configuración de Nginx.

---

## 2️. Configurar Nginx

Crea un archivo llamado `nginx.conf` en la raíz del proyecto con el siguiente contenido:

```nginx
events {}

http {
    server {
        listen 80;
        server_name localhost;

        root /var/www/app;
        index index.html;

        location / {
            try_files $uri $uri/ =404;
        }
    }
}
```

**Explicación:**

* `listen 80;` → El servidor escuchará en el puerto 80 del contenedor.
* `root /var/www/app;` → La carpeta dentro del contenedor donde estarán los archivos de tu app.
* `index index.html;` → Archivo principal de la aplicación.
* `location / { try_files $uri $uri/ =404; }` → Sirve archivos existentes y devuelve 404 si no existen.

---

## 3️. Modificar el Dockerfile

Actualiza tu `Dockerfile` para copiar la aplicación y la configuración:

```dockerfile
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copiar los archivos de la aplicación
COPY app /var/www/app

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto: inicia Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
```

---

## 4️. Construir y ejecutar el contenedor

Construye la imagen y ejecuta el contenedor:

```bash
docker build -t sw-nginx .
docker run -d -p 8080:80 --name sw-nginx sw-nginx
```

---

## 5️. Verificar la aplicación

Abre tu navegador y entra a:

```
http://localhost:8080
```

Deberías ver tu aplicación web funcionando correctamente dentro del contenedor Docker con Nginx.