# ---- Dockerfile Backend SmartTask (API REST Node.js/Express) ----
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /usr/src/app

# Copie des fichiers de dependances et installation
COPY package*.json ./
RUN npm install --production

# Copie du code source
COPY . .

# Port expose par l'API
EXPOSE 5000

# Commande de demarrage
CMD ["npm", "start"]
