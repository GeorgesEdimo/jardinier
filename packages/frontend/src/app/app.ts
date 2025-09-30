import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { NotificationsService } from './core/notifications.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');

  constructor(
    private auth: AuthService, 
    private router: Router,
    protected notificationsService: NotificationsService
  ) {
    // Demander la permission de notifications si supporté
    if ('Notification' in window && Notification.permission === 'default') {
      try { Notification.requestPermission(); } catch {}
    }

    // Poll: vérifier les rappels dûs et rafraîchir régulièrement si connecté
    effect(() => {
      if (this.isLoggedIn()) {
        const interval = setInterval(() => {
          this.notificationsService.checkDueAndNotify();
          this.notificationsService.refresh();
        }, 15000); // toutes les 15s
        return () => clearInterval(interval);
      }
      return undefined;
    });
  }

  get unreadCount() {
    return this.notificationsService.getUnreadCount();
  }

  // Alarme plein écran
  alarm() {
    return this.notificationsService.getAlarm();
  }

  stopAlarm() {
    this.notificationsService.stopAlarm();
  }

  get currentYear() {
    return new Date().getFullYear();
  }

  // Masque la navbar sur les pages d'authentification
  isAuthRoute() {
    const path = this.router.url.split('?')[0];
    return path === '/login' || path === '/register';
  }

  logout() {
    this.auth.clearToken();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!this.auth.getToken();
  }
}
