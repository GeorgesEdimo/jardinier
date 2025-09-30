# Guide du Système de Notifications

## ✅ Fonctionnalités Implémentées

### Backend (NestJS + Prisma)

#### Endpoints API
- `POST /api/notifications` - Créer un rappel
- `GET /api/notifications` - Lister tous les rappels
- `GET /api/notifications/active` - Lister les rappels actifs
- `GET /api/notifications/:id` - Récupérer un rappel spécifique
- `PATCH /api/notifications/:id` - Mettre à jour un rappel
- `PATCH /api/notifications/:id/toggle` - Activer/désactiver un rappel
- `PATCH /api/notifications/:id/mark-sent` - Marquer comme envoyé (et planifier le prochain si récurrent)
- `DELETE /api/notifications/:id` - Supprimer un rappel

#### Fonctionnalités Backend
- ✅ Validation des données avec `class-validator`
- ✅ Gestion des champs optionnels (plantId, subject, message, sendAt)
- ✅ Support des rappels récurrents avec fréquence en jours
- ✅ Gestion automatique du prochain rappel pour les notifications récurrentes
- ✅ Filtrage par utilisateur (sécurité JWT)
- ✅ Association optionnelle avec une plante

### Frontend (Angular 19)

#### Pages
1. **Liste des rappels** (`/notifications`)
   - Affichage en grille responsive
   - Icônes selon le canal (📱 app, 📧 email, 💬 SMS, 🔔 push)
   - Badge de statut (En attente, Envoyé, Échec)
   - Actions : Activer/Désactiver, Marquer comme envoyé, Supprimer

2. **Création de rappel** (`/notifications/add`)
   - Sélection de plante (optionnel)
   - Choix du canal de notification
   - Titre et message personnalisables
   - Date/heure du rappel (optionnel pour immédiat)
   - Option rappel récurrent avec fréquence

#### Navbar avec Cloche de Notification
- 🔔 Icône de cloche dans la navbar
- Badge rouge avec compteur de notifications non lues
- Compte les notifications actives dans les prochaines 24h
- Rafraîchissement automatique toutes les 60 secondes

#### Service de Notifications
- `NotificationsService` - Service Angular avec signals
- Gestion du compteur de notifications non lues
- Rafraîchissement automatique en arrière-plan
- Synchronisation avec le backend

## 🚀 Comment Utiliser

### Démarrer l'Application

**Option 1 : Tout démarrer ensemble**
```bash
npm run dev
```

**Option 2 : Démarrer séparément**

Backend :
```bash
cd packages/backend
npm run start:dev
```

Frontend :
```bash
cd packages/frontend
npm start
```

### Créer un Rappel

1. Connectez-vous à l'application
2. Cliquez sur "Rappels" dans la navbar ou sur la cloche 🔔
3. Cliquez sur "Créer un rappel"
4. Remplissez le formulaire :
   - **Plante** (optionnel) : Associer à une plante spécifique
   - **Canal** : Choisir le type de notification
   - **Titre** : Nom du rappel
   - **Message** : Description
   - **Date/heure** : Quand envoyer (vide = immédiat)
   - **Rappel récurrent** : Cocher pour répéter
   - **Fréquence** : Nombre de jours entre chaque rappel
5. Cliquez sur "Créer le rappel"

### Gérer les Rappels

- **Activer/Désactiver** : Cliquez sur 🔔 ou 🔕
- **Marquer comme envoyé** : Cliquez sur ✓ (pour les rappels en attente)
- **Supprimer** : Cliquez sur 🗑️

## 🔧 Corrections Apportées

### Problème Initial
- Erreur 400 Bad Request lors de la création de rappels
- Cause : Envoi de champs `undefined` dans le payload

### Solutions Implémentées

1. **Backend** (`notifications.controller.ts`)
   - Type `sendAt` changé de `Date` à `string` pour accepter les ISO strings
   - Ajout de `default: false` pour `isRecurring`

2. **Backend** (`notifications.service.ts`)
   - Conversion automatique de `sendAt` string vers Date
   - Gestion des valeurs par défaut

3. **Frontend** (`notification-add.component.ts`)
   - Ne plus envoyer les champs vides/undefined
   - Vérification stricte avant d'ajouter au payload
   - Trim des espaces pour subject et message

## 📊 Modèle de Données

```prisma
model Notification {
  id             Int       @id @default(autoincrement())
  userId         Int
  plantId        Int?
  channel        String    // 'in-app' | 'email' | 'sms' | 'push'
  subject        String?
  message        String?
  sendAt         DateTime?
  isRecurring    Boolean   @default(false)
  recurringDays  Int?
  enabled        Boolean   @default(true)
  status         String    @default("pending") // 'pending' | 'sent' | 'failed'
  createdAt      DateTime  @default(now())
  
  user           User      @relation(...)
  plant          Plant?    @relation(...)
}
```

## 🎨 Interface Utilisateur

- Design moderne avec thème vert (jardin)
- Cards responsive avec hover effects
- Badges colorés pour les statuts
- Icônes emoji pour une meilleure UX
- Animations subtiles (swing pour le spinner)

## 🔐 Sécurité

- Authentification JWT requise
- Filtrage par userId sur toutes les requêtes
- Validation des données côté backend
- Protection contre les injections

## 📝 Notes

- Les notifications "in-app" sont affichées dans l'interface
- Les autres canaux (email, SMS, push) nécessitent une intégration supplémentaire
- Le système est prêt pour l'ajout de vrais services de notification
- Le compteur affiche les notifications des 24 prochaines heures
