# Configuration des ports

## Architecture

- **Frontend (Angular)**: `http://localhost:3000`
- **Backend (Nest.js)**: `http://localhost:3001`
- **Swagger API**: `http://localhost:3001/api`

## Proxy

Le frontend utilise un proxy configuré dans `packages/frontend/proxy.conf.json` :
- Toutes les requêtes vers `/api/*` sont automatiquement redirigées vers `http://localhost:3001`
- Cela évite les problèmes CORS en développement

## Démarrage

### Option 1 : Démarrer les deux services ensemble
```bash
npm run dev
```

### Option 2 : Démarrer séparément

**Backend** (dans un terminal) :
```bash
npm run start:backend
```
Le backend démarre sur le port **3001**

**Frontend** (dans un autre terminal) :
```bash
npm run start:frontend
```
Le frontend démarre sur le port **3000**

## Accès à l'application

Une fois les deux services démarrés :
- **Application web**: http://localhost:3000
- **Documentation API (Swagger)**: http://localhost:3001/api

## Authentification

Les endpoints d'authentification sont :
- **Créer un compte**: `POST /api/auth/register`
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe" // optionnel
  }
  ```

- **Se connecter**: `POST /api/auth/login`
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

Les mots de passe doivent contenir au moins 6 caractères.
