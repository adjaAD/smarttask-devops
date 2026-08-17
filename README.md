# SmartTask - DevOps Project

Application de gestion de taches developpee pour SmartTech, conteneurisee et
deployee via une chaine CI/CD complete (Docker, Docker Compose, GitHub,
Jenkins).

## Auteur
Constantin S.E BASSENE - Master 1 ISI 2025-2026
Examen Microservices, Docker, Jenkins

## Architecture

| Service   | Description                     | Port  |
|-----------|----------------------------------|-------|
| frontend  | Interface utilisateur (HTML/JS via Nginx) | 8080 |
| backend   | API REST (Node.js / Express)     | 5000  |
| db        | Base de donnees (PostgreSQL)     | 5432  |

## Structure du depot

```
smarttask-devops/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

## Projet 1 - Conteneurisation

Construction des images :
```bash
docker build -t smarttask-backend:latest ./backend
docker build -t smarttask-frontend:latest ./frontend
docker pull postgres:16-alpine
```

Lancement manuel des conteneurs (verification individuelle) :
```bash
docker network create smarttask-net

docker run -d --name smarttask-db --network smarttask-net \
  -e POSTGRES_USER=smarttask -e POSTGRES_PASSWORD=smarttask \
  -e POSTGRES_DB=smarttask_db -v db_data:/var/lib/postgresql/data \
  postgres:16-alpine

docker run -d --name smarttask-backend --network smarttask-net \
  -e DB_HOST=smarttask-db -e DB_USER=smarttask -e DB_PASSWORD=smarttask \
  -e DB_NAME=smarttask_db -p 5000:5000 smarttask-backend:latest

docker run -d --name smarttask-frontend --network smarttask-net \
  -p 8080:80 smarttask-frontend:latest
```

Verification :
```bash
docker ps
curl http://localhost:5000/api/health
```

## Projet 2 - Deploiement avec Docker Compose

Lancement complet de l'application :
```bash
docker-compose up -d --build
```

Verification :
```bash
docker-compose ps
docker-compose logs -f backend
```

Ouvrir ensuite http://localhost:8080 dans le navigateur.

Arret :
```bash
docker-compose down
```

## Projet 3 - Gestion du code source (GitHub)

```bash
git init
git checkout -b Dev
git add .
git commit -m "Initial commit - SmartTask DevOps project"
git remote add origin https://github.com/<votre-utilisateur>/smarttask-devops.git
git push -u origin Dev

git checkout -b Prod
git push -u origin Prod
```

## Projet 4 - CI/CD avec Jenkins

Le `Jenkinsfile` a la racine du depot definit un pipeline qui :
1. Recupere le code depuis GitHub (Pipeline Multibranch) ;
2. Construit les images Docker (backend et frontend) ;
3. Tague les images avec le nom de la branche et le numero de build ;
4. Se connecte a Docker Hub via les identifiants stockes dans Jenkins ;
5. Publie les images sur Docker Hub.

Voir la section "Configuration Jenkins" du rapport pour le detail de
l'installation et de la configuration du Pipeline Multibranch.

## Lien du depot GitHub
https://github.com/<votre-utilisateur>/smarttask-devops
