# Jardinier

[![CI](https://github.com/GeorgesEdimo/jardinier/actions/workflows/ci.yml/badge.svg)](https://github.com/GeorgesEdimo/jardinier/actions/workflows/ci.yml)
[![Deploy Frontend](https://github.com/GeorgesEdimo/jardinier/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/GeorgesEdimo/jardinier/actions/workflows/deploy-frontend.yml)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-Live-green)](https://georgesedimo.github.io/jardinier/)

Application web de gestion de plantes (Angular + Nest.js) avec rappels, notifications et UI moderne.

## Monorepo

- Racine: `Jardinier/`
- Workspaces: `packages/*`
  - `packages/backend` — Nest.js (API, Prisma)
  - `packages/frontend` — Angular (SPA)

## Prérequis

- Node.js >= 18
- npm >= 9

## Installation

```
npm install
```

## Démarrage en développement

Deux options:

- Lancer les deux en parallèle depuis la racine:

```
npm run dev
```

- Ou séparément:

```
# Backend (Nest)
npm run start:backend

# Frontend (Angular)
npm run start:frontend
```

## Ports par défaut

- Frontend: http://localhost:3000
- Backend: selon configuration Nest (voir `packages/backend/`)

## Fonctionnalités clés

- Authentification JWT, formulaires Login/Register
- Gestion des plantes et rappels
- Notifications in-app, alarme plein écran avec son
- UI responsive avec fonds d’écran personnalisés

## Rappels et notifications

- Création de rappel sans date: `sendAt` est fixé à « maintenant » côté backend
- Polling auto côté frontend (toutes les 15s) et bouton « Vérifier maintenant » dans `/notifications`

## Build

```
npm run build
```

## Dépannage

- Port 3000 occupé: fermer le processus puis relancer `start:frontend`
- Pas de notification: vérifier que vous êtes connecté et observer `POST /notifications/process` dans l’onglet Network

## Licence

MIT
