# Guide de déploiement

Ce dépôt utilise GitHub Actions pour la CI et le déploiement du frontend (GitHub Pages), et un webhook Render pour le backend.

## Frontend (GitHub Pages)

- Workflow: `.github/workflows/deploy-frontend.yml`
- URL: `https://georgesedimo.github.io/jardinier/`

### Prérequis
- Dans GitHub → Settings → Pages
  - Source: `Deploy from branch`
  - Branche: `gh-pages`

### Déclenchement
- Automatique sur `push` vers `main` touchant `packages/frontend/**`
- Ou manuel: GitHub → Actions → `Deploy Frontend (GitHub Pages)` → Run workflow

### Détails build
- Commande: `npm run build --workspace=@jardinier/frontend -- --base-href /jardinier/`
- Publish dir: `packages/frontend/dist/frontend`
- En local, l'app garde `<base href="/">` pour `ng serve`.

## Backend (Render)

- Workflow: `.github/workflows/deploy-backend.yml`
- Déclenché sur `main`, tags `v*.*.*`, ou manuellement.
- Appelle le webhook Render: secret `RENDER_DEPLOY_HOOK`.

### Étapes Render
1. Créez un service **Web Service** sur https://render.com pour `packages/backend/`.
   - Build Command: `npm ci && npm run build --workspace=@jardinier/backend`
   - Start Command: `npm run start:prod --workspace=@jardinier/backend`
   - Node 18 (ou 20) selon votre préférence.
2. Dans Render, activez un **Deploy Hook** et copiez l’URL.
3. Dans GitHub → Settings → Secrets and variables → Actions:
   - Créez le secret `RENDER_DEPLOY_HOOK` avec l’URL copiée.
4. Déclenchez le workflow `Deploy Backend (Render)` (ou poussez sur `main`).

### Variables d’environnement Backend
- Ajoutez vos variables (JWT_SECRET, DATABASE_URL, etc.) dans Render → Settings → Environment.

## CI

- Workflow: `.github/workflows/ci.yml`
- Jobs:
  - `build` (Node 18/20) + artifacts `dist`
  - `backend-lint`
  - `backend-test`
  - `frontend-test` (ChromeHeadless)

## Dépannage
- Pages 404: vérifiez `Settings → Pages` sur `gh-pages` et que `publish_dir` pointe vers le bon dossier.
- Assets manquants: assurez-vous que `--base-href /jardinier/` est bien appliqué dans le workflow.
- Render non déclenché: vérifiez que `RENDER_DEPLOY_HOOK` est défini dans les secrets du repo.
