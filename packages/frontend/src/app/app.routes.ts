import { Routes } from '@angular/router';
import { PlantsListComponent } from './pages/plants-list.component';
import { PlantAddComponent } from './pages/plant-add.component';
import { PlantDetailComponent } from './pages/plant-detail.component';
import { DueListComponent } from './pages/due-list.component';
import { NotificationsListComponent } from './pages/notifications-list.component';
import { NotificationAddComponent } from './pages/notification-add.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { authGuard } from './core/auth.guard';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, title: 'Accueil' },
  { path: 'plants', component: PlantsListComponent, title: 'Plantes', canActivate: [authGuard] },
  { path: 'plants/add', component: PlantAddComponent, title: 'Ajouter une plante', canActivate: [authGuard] },
  { path: 'plants/:id', component: PlantDetailComponent, title: 'Détail plante', canActivate: [authGuard] },
  { path: 'due', component: DueListComponent, title: 'Arrosages dus', canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsListComponent, title: 'Rappels', canActivate: [authGuard] },
  { path: 'notifications/add', component: NotificationAddComponent, title: 'Créer un rappel', canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, title: 'Se connecter' },
  { path: 'register', component: RegisterComponent, title: 'Créer un compte' },
  { path: '**', redirectTo: 'plants' },
];
