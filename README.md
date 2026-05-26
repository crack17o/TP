# Todo App — React + Django + SQLite + Docker

Application de gestion de tâches : API REST Django, interface React (Vite), SQLite, conteneurisée avec Docker.

## Architecture

```
Navigateur → Nginx (frontend:80) → /api/* → Gunicorn (backend:8000) → SQLite (/data)
```

| Composant | Technologie |
|-----------|-------------|
| Frontend  | React 18, Vite, Nginx |
| Backend   | Django 5, DRF, Gunicorn |
| BDD       | SQLite (volume Docker `todo-data`) |

## Démarrage rapide

```powershell
cd c:\Users\USER\Documents\TP
docker compose up --build -d
```

→ **http://localhost**

---

## Commandes Django (backend)

Toutes les commandes ci-dessous s'exécutent depuis le dossier `backend/`, avec l'environnement virtuel activé.

### Installation et environnement

```powershell
cd backend

# Créer l'environnement virtuel
python -m venv .venv

# Activer (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Activer (Windows CMD)
.\.venv\Scripts\activate.bat

# Activer (Linux / macOS)
source .venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Mettre à jour pip (optionnel)
python -m pip install --upgrade pip
```

### Base de données (SQLite)

```powershell
# Appliquer les migrations
python manage.py migrate

# Créer de nouvelles migrations après modification des models
python manage.py makemigrations

# Créer les migrations pour une app précise
python manage.py makemigrations todos

# Voir le SQL d'une migration (sans l'exécuter)
python manage.py sqlmigrate todos 0001

# Annuler la dernière migration (todos)
python manage.py migrate todos zero

# Afficher l'état des migrations
python manage.py showmigrations
```

### Serveur de développement

```powershell
# Lancer le serveur (port 8000)
python manage.py runserver

# Sur un autre port
python manage.py runserver 8080

# Écouter sur toutes les interfaces (accès réseau local)
python manage.py runserver 0.0.0.0:8000
```

### Administration Django

```powershell
# Créer un superutilisateur (accès /admin/)
python manage.py createsuperuser

# Ouvrir le shell Django (Python interactif avec ORM)
python manage.py shell

# Exemple dans le shell : créer une tâche
# from todos.models import Todo
# Todo.objects.create(title="Ma tâche")
```

### Fichiers statiques et utilitaires

```powershell
# Collecter les fichiers statiques (production)
python manage.py collectstatic --noinput

# Vérifier la configuration du projet
python manage.py check

# Lister toutes les commandes manage.py disponibles
python manage.py help

# Aide sur une commande précise
python manage.py help migrate
```

### Tests

```powershell
# Lancer tous les tests
python manage.py test

# Tests d'une app uniquement
python manage.py test todos
```

### API REST (URLs utiles en local)

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | http://127.0.0.1:8000/api/todos/ | Liste des tâches |
| POST | http://127.0.0.1:8000/api/todos/ | Créer `{"title": "...", "completed": false}` |
| GET | http://127.0.0.1:8000/api/todos/1/ | Détail d'une tâche |
| PATCH | http://127.0.0.1:8000/api/todos/1/ | Modifier |
| PUT | http://127.0.0.1:8000/api/todos/1/ | Remplacer |
| DELETE | http://127.0.0.1:8000/api/todos/1/ | Supprimer |
| — | http://127.0.0.1:8000/admin/ | Interface admin |

Exemple avec `curl` :

```powershell
curl http://127.0.0.1:8000/api/todos/

curl -X POST http://127.0.0.1:8000/api/todos/ `
  -H "Content-Type: application/json" `
  -d "{\"title\": \"Acheter du lait\", \"completed\": false}"

curl -X PATCH http://127.0.0.1:8000/api/todos/1/ `
  -H "Content-Type: application/json" `
  -d "{\"completed\": true}"

curl -X DELETE http://127.0.0.1:8000/api/todos/1/
```

### Variables d'environnement (backend)

| Variable | Exemple | Description |
|----------|---------|-------------|
| `DJANGO_SECRET_KEY` | `ma-cle-secrete` | Clé secrète Django |
| `DJANGO_DEBUG` | `true` | Mode debug |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Hôtes autorisés |
| `DATABASE_PATH` | `C:\data\db.sqlite3` | Chemin du fichier SQLite |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Origines CORS |

```powershell
# Exemple : lancer avec variables (PowerShell)
$env:DJANGO_DEBUG = "true"
$env:DATABASE_PATH = ".\db.sqlite3"
python manage.py runserver
```

---

## Commandes React / Vite (frontend)

Toutes les commandes ci-dessous s'exécutent depuis le dossier `frontend/`.

### Installation

```powershell
cd frontend

# Installer les dépendances (package-lock créé au premier install)
npm install

# Réinstaller proprement (en cas de problème)
Remove-Item -Recurse -Force node_modules
npm install
```

### Développement

```powershell
# Serveur de dev avec rechargement à chaud (port 5173)
npm run dev

# Serveur sur un port précis
npm run dev -- --port 3000

# Exposer sur le réseau local
npm run dev -- --host
```

→ **http://localhost:5173** (le proxy Vite redirige `/api` vers Django sur `:8000`)

### Build et prévisualisation

```powershell
# Compiler pour la production (dossier dist/)
npm run build

# Prévisualiser le build localement
npm run preview

# Prévisualiser sur un port précis
npm run preview -- --port 4173
```

### Dépendances npm

```powershell
# Ajouter une dépendance
npm install nom-du-package

# Ajouter une dépendance de dev
npm install -D nom-du-package

# Mettre à jour les paquets (selon package.json)
npm update

# Lister les paquets obsolètes
npm outdated

# Audit de sécurité
npm audit

# Corriger les vulnérabilités automatiquement
npm audit fix
```

### Variables d'environnement (frontend)

Créez un fichier `frontend/.env` si besoin :

```env
# URL de l'API (vide = proxy /api en dev, nginx en prod Docker)
VITE_API_URL=http://127.0.0.1:8000/api
```

```powershell
# En dev sans proxy : pointer directement vers Django
# (créer frontend/.env avec VITE_API_URL=http://127.0.0.1:8000/api)
npm run dev
```

> Les variables Vite doivent commencer par `VITE_` pour être exposées au client.

---

## Commandes Docker

Toutes les commandes ci-dessous s'exécutent depuis la racine du projet (`TP/`), sauf indication contraire.

### Docker Compose — développement / production locale

```powershell
cd c:\Users\USER\Documents\TP

# Construire et démarrer (premier lancement ou après changements)
docker compose up --build -d

# Démarrer sans reconstruire
docker compose up -d

# Démarrer au premier plan (voir les logs en direct)
docker compose up --build

# Arrêter les conteneurs
docker compose down

# Arrêter et supprimer les volumes (⚠ efface la BDD SQLite)
docker compose down -v

# Reconstruire une seule image
docker compose build backend
docker compose build frontend

# Reconstruire sans cache
docker compose build --no-cache

# Voir l'état des services
docker compose ps

# Voir les logs (tous les services)
docker compose logs

# Logs en temps réel
docker compose logs -f

# Logs d'un service précis
docker compose logs -f backend
docker compose logs -f frontend

# Redémarrer un service
docker compose restart backend
docker compose restart frontend
```

### Commandes dans les conteneurs

```powershell
# Shell dans le conteneur backend
docker compose exec backend sh

# Migrations manuelles dans le conteneur
docker compose exec backend python manage.py migrate

# Créer un superuser dans le conteneur
docker compose exec backend python manage.py createsuperuser

# Shell Django dans le conteneur
docker compose exec backend python manage.py shell
```

### Images Docker (build manuel)

```powershell
# Construire l'image backend
docker build -t todo-backend:local ./backend

# Construire l'image frontend
docker build -t todo-frontend:local ./frontend

# Lister les images locales
docker images

# Supprimer une image
docker rmi todo-backend:local

# Supprimer les images non utilisées
docker image prune
```

### Docker Hub — publication et utilisation

```powershell
# Se connecter à Docker Hub
docker login

# Se déconnecter
docker logout

# Script automatique (build + push)
.\scripts\push-dockerhub.ps1 -User VOTRE_USER

# Avec un tag précis (défaut : latest)
.\scripts\push-dockerhub.ps1 -User VOTRE_USER -Tag v1.0.0
```

**Build et push manuels :**

```powershell
docker build -t VOTRE_USER/todo-backend:latest ./backend
docker build -t VOTRE_USER/todo-frontend:latest ./frontend

docker push VOTRE_USER/todo-backend:latest
docker push VOTRE_USER/todo-frontend:latest

# Pousser un tag versionné
docker tag VOTRE_USER/todo-backend:latest VOTRE_USER/todo-backend:v1.0.0
docker push VOTRE_USER/todo-backend:v1.0.0
```

**Lancer avec les images Docker Hub (sans build local) :**

```powershell
$env:DOCKERHUB_USER = "VOTRE_USER"
$env:DJANGO_SECRET_KEY = "une-cle-secrete-longue"

docker compose -f docker-compose.hub.yml pull
docker compose -f docker-compose.hub.yml up -d

docker compose -f docker-compose.hub.yml down
```

### Volumes et données

```powershell
# Lister les volumes
docker volume ls

# Inspecter le volume SQLite
docker volume inspect tp_todo-data

# Supprimer le volume (⚠ perte des données)
docker volume rm tp_todo-data
```

### Nettoyage Docker

```powershell
# Conteneurs arrêtés
docker container prune

# Images non utilisées
docker image prune

# Volumes non utilisés (⚠ attention aux données)
docker volume prune

# Tout nettoyer (non utilisé : conteneurs, réseaux, images, cache)
docker system prune

# Nettoyage complet incluant les volumes
docker system prune -a --volumes
```

### Dépannage

```powershell
# Vérifier que Docker tourne
docker version
docker info

# Inspecter un conteneur
docker inspect todo-backend

# Voir les processus dans un conteneur
docker compose top

# Suivre les ressources (CPU, RAM)
docker stats
```

---

## Workflow recommandé

| Objectif | Commandes |
|----------|-----------|
| Dev full local | Terminal 1 : `python manage.py runserver` · Terminal 2 : `npm run dev` |
| Test en conteneurs | `docker compose up --build -d` → http://localhost |
| Publier sur Hub | `docker login` puis `.\scripts\push-dockerhub.ps1 -User VOTRE_USER` |
| Déployer depuis Hub | `$env:DOCKERHUB_USER="..."` puis `docker compose -f docker-compose.hub.yml up -d` |

## Structure du projet

```
TP/
├── backend/                 # Django + API
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── todos/               # App des tâches
├── frontend/                # React + Vite
│   ├── package.json
│   ├── Dockerfile
│   └── src/
├── scripts/
│   ├── push-dockerhub.ps1
│   └── push-dockerhub.sh
├── docker-compose.yml       # Build local
├── docker-compose.hub.yml   # Images Docker Hub
└── .env.example
```
