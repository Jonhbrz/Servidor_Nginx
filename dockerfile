FROM ubuntu:22.04

# Evita prompts interactivos
ENV DEBIAN_FRONTEND=noninteractive

# Instalamos Nginx y limpiamos basura
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copiamos las dos apps
COPY app1 /var/www/app1
COPY app2 /var/www/app2

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Damos permisos correctos
RUN chmod -R 755 /var/www && chown -R www-data:www-data /var/www

# Exponemos los puertos de ambas apps
EXPOSE 80 81

# Comando por defecto: inicia Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]