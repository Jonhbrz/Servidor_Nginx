FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Instalamos Nginx y OpenSSL (necesario en contenedor)
RUN apt-get update && \
    apt-get install -y nginx openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Creamos carpeta SSL dentro del contenedor
RUN mkdir -p /etc/nginx/ssl

# Copiamos los certificados generados en Windows
COPY ssl/selfsigned.crt /etc/nginx/ssl/
COPY ssl/selfsigned.key /etc/nginx/ssl/

# Copiamos las aplicaciones
COPY app1 /var/www/app1
COPY app2 /var/www/app2

# Copiamos la configuración de Nginx personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Permisos correctos
RUN chmod -R 755 /var/www && chown -R www-data:www-data /var/www

# Exponemos los puertos:
# 80  → redirección HTTP
# 443 → app1 HTTPS
# 444 → app2 HTTPS
EXPOSE 80 443 444

CMD ["nginx", "-g", "daemon off;"]