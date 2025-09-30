# Jardinier

Application web de gestion de plantes d'intérieur (Angular + Nest.js) avec PWA, notifications et intégrations IA/Météo.

## Monorepo

- workspace root: `Jardinier/`
- workspaces: `packages/*`
  - backend: `packages/backend` (Nest.js)
  - frontend: `packages/frontend` (Angular)

## Prérequis

- Node.js >= 18
- npm >= 9

## Démarrage (après scaffolding)

- Backend: `npm run start --workspace=@jardinier/backend`
- Frontend: `npm run start --workspace=@jardinier/frontend`

## Roadmap (extrait)

- Auth multi-utilisateurs (JWT + rôles)
- CRUD plantes + upload images
- Besoins en eau (quantité, fréquence) + calendrier d'arrosage
- Notifications push / email / SMS
- Géolocalisation + météo locale (OpenWeatherMap ou MeteoAPI)
- IA reconnaissance de plante et analyse de santé (provider pluggable)
- PWA + offline

## Scripts racine

- `npm run dev` lance les workspaces (quand disponibles)
- `npm run build` build les workspaces

Voir `/packages/*` pour les détails une fois les projets générés.
