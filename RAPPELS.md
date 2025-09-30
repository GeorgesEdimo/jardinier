# Système de Rappels

## Vue d'ensemble

Le système de rappels permet aux utilisateurs de configurer des notifications pour ne jamais oublier d'arroser leurs plantes.

## Fonctionnalités

### Types de rappels

- **Rappel unique** : Notification envoyée une seule fois à une date/heure précise
- **Rappel récurrent** : Notification répétée automatiquement tous les X jours

### Canaux de notification

- **📱 Application** (in-app) : Notification dans l'application
- **📧 Email** : Notification par email
- **💬 SMS** : Notification par SMS
- **🔔 Push** : Notification push mobile

### Gestion des rappels

- ✅ Créer un rappel personnalisé
- 📝 Associer un rappel à une plante spécifique
- 🔄 Configurer la récurrence (tous les X jours)
- 🔔/🔕 Activer/désactiver un rappel
- 🗑️ Supprimer un rappel
- 📊 Voir tous les rappels actifs et leur statut

## API Backend

### Endpoints disponibles

**Authentification requise** : Tous les endpoints nécessitent un token JWT (`Authorization: Bearer <token>`)

#### Créer un rappel
```http
POST /api/notifications
Content-Type: application/json

{
  "plantId": 1,              // optionnel
  "channel": "in-app",       // in-app | email | sms | push
  "subject": "Arrosage",     // optionnel
  "message": "Il est temps d'arroser !",  // optionnel
  "sendAt": "2025-01-15T10:00:00Z",  // optionnel
  "isRecurring": true,       // optionnel, défaut: false
  "recurringDays": 7         // optionnel, requis si isRecurring=true
}
```

#### Lister tous les rappels
```http
GET /api/notifications
```

#### Lister les rappels actifs
```http
GET /api/notifications/active
```

#### Récupérer un rappel
```http
GET /api/notifications/:id
```

#### Mettre à jour un rappel
```http
PATCH /api/notifications/:id
Content-Type: application/json

{
  "subject": "Nouveau titre",
  "enabled": false,
  "status": "sent"
}
```

#### Activer/désactiver un rappel
```http
PATCH /api/notifications/:id/toggle
```

#### Supprimer un rappel
```http
DELETE /api/notifications/:id
```

## Frontend

### Pages disponibles

- **`/notifications`** : Liste de tous les rappels
- **`/notifications/add`** : Formulaire pour créer un nouveau rappel

### Navigation

Le lien "Rappels" est disponible dans la barre de navigation principale (nécessite d'être connecté).

## Schéma de base de données

```prisma
model Notification {
  id            Int      @id @default(autoincrement())
  userId        Int
  plantId       Int?
  channel       String   // push | email | sms | in-app
  subject       String?
  message       String?
  status        String   @default("pending") // pending | sent | failed
  sendAt        DateTime?
  isRecurring   Boolean  @default(false)
  recurringDays Int?     // Nombre de jours entre chaque rappel
  enabled       Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user  User   @relation(fields: [userId], references: [id])
  plant Plant? @relation(fields: [plantId], references: [id])
}
```

## Cas d'usage

### 1. Rappel simple pour arroser une plante
```json
{
  "plantId": 1,
  "channel": "in-app",
  "subject": "Arrosage du Monstera",
  "message": "Il est temps d'arroser votre Monstera !",
  "sendAt": "2025-01-15T10:00:00Z"
}
```

### 2. Rappel récurrent hebdomadaire
```json
{
  "plantId": 2,
  "channel": "email",
  "subject": "Arrosage hebdomadaire",
  "message": "N'oubliez pas d'arroser votre plante cette semaine !",
  "sendAt": "2025-01-15T09:00:00Z",
  "isRecurring": true,
  "recurringDays": 7
}
```

### 3. Rappel général (sans plante)
```json
{
  "channel": "push",
  "subject": "Vérifier les plantes",
  "message": "Pensez à vérifier l'état de vos plantes !",
  "sendAt": "2025-01-15T18:00:00Z",
  "isRecurring": true,
  "recurringDays": 3
}
```

## Migration de la base de données

Pour appliquer le nouveau schéma :

```bash
cd packages/backend
npx prisma migrate dev --name add_notification_features
npx prisma generate
```

## Développements futurs

- 🔄 Envoi automatique des notifications (cron job)
- 📧 Intégration avec un service d'email (SendGrid, Mailgun)
- 💬 Intégration avec un service SMS (Twilio)
- 🔔 Notifications push via Firebase Cloud Messaging
- 📊 Historique des notifications envoyées
- 🎯 Rappels intelligents basés sur les conditions météo
- 🌡️ Rappels adaptatifs selon la température et l'humidité
