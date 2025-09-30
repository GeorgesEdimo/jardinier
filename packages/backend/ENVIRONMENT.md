# Configuration d'environnement (Backend)

Le backend utilise une base SQLite via Prisma, et un secret JWT pour l’authentification. Les fichiers `.env*` sont ignorés par git (voir `.gitignore`).

Créez un fichier `.env` dans `packages/backend/` avec le contenu suivant:

```
# Fichier: packages/backend/.env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="change_me_in_prod"
```

- `DATABASE_URL`: chemin de la base SQLite (par défaut `prisma/dev.db` si non précisé explicitement). Avec `file:./dev.db`, Prisma créera le fichier dans `packages/backend/prisma/dev.db`.

## Commandes Prisma (à lancer dans `packages/backend/`)

- Générer le client:
```
npm run prisma:generate
```

- Créer/mettre à jour le schéma de base (migration de dev):
```
npm run prisma:migrate
```

- Ouvrir Prisma Studio:
```
npm run prisma:studio
```

Note: Si l'installation de `@prisma/client`/`prisma` échoue pour des raisons réseau, réessayez plus tard:
```
npm install prisma @prisma/client --save
```

## Authentification JWT

- Enregistrer un utilisateur:
```
POST /auth/register
{
  "email": "user@example.com",
  "password": "pass1234",
  "name": "User"
}
```

- Se connecter (récupère `access_token`):
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "pass1234"
}
```

- Dans Swagger (/api), cliquer sur "Authorize" et coller `Bearer <access_token>`.
