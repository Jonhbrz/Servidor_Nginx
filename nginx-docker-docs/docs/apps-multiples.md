# Servir Múltiples Aplicaciones con Nginx en Docker

En esta sección configuraremos **Nginx** dentro de un contenedor Docker para servir **dos aplicaciones diferentes**, cada una en un puerto distinto.

---

## 1️. Estructura del proyecto

Supongamos que tu proyecto tiene esta estructura:

```
SERVIDOR-NGINX/
├── app1/
│   ├── index.html
│   └── dist/
│       └── main.js
├── app2/
│   ├── index.html
│   └── dist/
│       └── main.js
├── Dockerfile
└── nginx.conf
```

* `app1/` → Primera aplicación.
* `app2/` → Segunda aplicación.

---

## 2️. Configurar Nginx para múltiples aplicaciones

Edita tu `nginx.conf` con el siguiente contenido:

```nginx
events {}

http {
    # Aplicación 1
    server {
        listen 80;
        server_name localhost;

        root /var/www/app1;
        index index.html;

        location / {
            try_files $uri $uri/ =404;
        }
    }

    # Aplicación 2
    server {
        listen 81;
        server_name localhost;

        root /var/www/app2;
        index index.html;

        location / {
            try_files $uri $uri/ =404;
        }
    }
}
```

**Explicación:**

* Cada `server` escucha en un puerto diferente (80 para app1 y 81 para app2).
* Cada `root` apunta a la carpeta de la aplicación correspondiente.
* Esto permite escalar y servir múltiples apps desde un mismo contenedor.

---

## 3️. Modificar el Dockerfile

Actualiza tu Dockerfile para copiar ambas aplicaciones y la configuración de Nginx:

```dockerfile
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copiar las dos aplicaciones
COPY app1 /var/www/app1
COPY app2 /var/www/app2

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer los puertos 80 y 81
EXPOSE 80 81

# Comando por defecto: inicia Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
```

---

## 4️. Construir y ejecutar el contenedor

```bash
docker build -t sw-nginx .
docker run -d -p 8080:80 -p 9090:81 --name sw-nginx sw-nginx
```
<p align="center">
  <img src="img/cambio_volumenes.png" alt="Cambio de volúmenes" width="80%">
</p>

Esto hará que:

* **app1** se vea en [http://localhost:8080](http://localhost:8080)
* **app2** se vea en [http://localhost:9090](http://localhost:9090)

---

## 5️. Verificar las aplicaciones

Abre tu navegador y prueba ambos puertos. Cada aplicación debería cargarse con sus respectivos cambios y archivos estáticos.
