# ---- Dockerfile Frontend SmartTask ----
FROM nginx:alpine

# Suppression de la config par defaut et copie des fichiers statiques
RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html

# Port expose par nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
