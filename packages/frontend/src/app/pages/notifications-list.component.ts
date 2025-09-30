import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { NotificationsService } from '../core/notifications.service';

interface Notification {
  id: number;
  plantId?: number;
  plant?: { id: number; name: string; species?: string };
  channel: string;
  subject?: string;
  message?: string;
  sendAt?: string;
  isRecurring: boolean;
  recurringDays?: number;
  enabled: boolean;
  status: string;
  createdAt: string;
}

@Component({
  standalone: true,
  selector: 'app-notifications-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container page-container">
      <div class="page-header">
        <h2>Mes rappels</h2>
        <div style="display:flex; gap:.5rem; align-items:center;">
          <button type="button" class="btn btn-secondary" (click)="checkNow()" title="Vérifier les rappels arrivés à échéance">
            ⟳ Vérifier maintenant
          </button>
          <a routerLink="/notifications/add" class="btn btn-primary">
            <span>🔔</span> Créer un rappel
          </a>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner">🔔</div>
        <p>Chargement...</p>
      </div>

      <div *ngIf="error" class="error-message card">
        ⚠️ {{ error }}
      </div>

      <div *ngIf="!loading && notifications.length === 0" class="empty-state card">
        <div class="empty-icon">🔕</div>
        <h3>Aucun rappel configuré</h3>
        <p>Créez votre premier rappel pour ne jamais oublier d'arroser vos plantes !</p>
        <a routerLink="/notifications/add" class="btn btn-primary">Créer un rappel</a>
      </div>

      <div *ngIf="!loading && notifications.length > 0" class="notifications-grid">
        <div *ngFor="let notif of notifications" class="card notification-card" [class.disabled]="!notif.enabled">
          <div class="notification-header">
            <div class="notification-icon">{{ getChannelIcon(notif.channel) }}</div>
            <div class="notification-info">
              <h3>{{ notif.subject || 'Rappel' }}</h3>
              <p class="plant-name" *ngIf="notif.plant">
                🪴 {{ notif.plant.name }}
              </p>
            </div>
            <div class="notification-actions">
              <button 
                type="button" 
                class="btn-icon" 
                (click)="toggleNotification(notif.id)"
                [title]="notif.enabled ? 'Désactiver' : 'Activer'">
                {{ notif.enabled ? '🔔' : '🔕' }}
              </button>
              <button 
                *ngIf="notif.status === 'pending'"
                type="button" 
                class="btn-icon btn-success" 
                (click)="markAsSent(notif.id)"
                title="Marquer comme envoyé">
                ✓
              </button>
              <button 
                type="button" 
                class="btn-icon btn-danger" 
                (click)="deleteNotification(notif.id)"
                title="Supprimer">
                🗑️
              </button>
            </div>
          </div>

          <div class="notification-body">
            <p class="message">{{ notif.message }}</p>
            
            <div class="notification-details">
              <div class="detail-item" *ngIf="notif.sendAt">
                <span class="label">Prochain rappel:</span>
                <span class="value">{{ notif.sendAt | date:'short' }}</span>
              </div>
              
              <div class="detail-item" *ngIf="notif.isRecurring">
                <span class="label">Récurrence:</span>
                <span class="value">Tous les {{ notif.recurringDays }} jours</span>
              </div>
              
              <div class="detail-item">
                <span class="label">Canal:</span>
                <span class="value">{{ getChannelLabel(notif.channel) }}</span>
              </div>
              
              <div class="detail-item">
                <span class="label">Statut:</span>
                <span class="value" [class.status-pending]="notif.status === 'pending'" 
                      [class.status-sent]="notif.status === 'sent'"
                      [class.status-failed]="notif.status === 'failed'">
                  {{ getStatusLabel(notif.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem 1rem;
      min-height: 60vh;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-header h2 {
      margin: 0;
      color: var(--green-900);
      font-size: 2rem;
    }

    .loading {
      text-align: center;
      padding: 3rem 1rem;
    }

    .spinner {
      font-size: 3rem;
      animation: swing 1s ease-in-out infinite;
    }

    @keyframes swing {
      0%, 100% { transform: rotate(-10deg); }
      50% { transform: rotate(10deg); }
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-left: 4px solid #c62828;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      max-width: 500px;
      margin: 2rem auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: var(--green-800);
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      color: var(--text);
      margin: 0 0 1.5rem;
    }

    .notifications-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }

    .notification-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .notification-card.disabled {
      opacity: 0.6;
    }

    .notification-card:hover {
      transform: translateY(-2px);
    }

    .notification-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--green-100);
    }

    .notification-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .notification-info {
      flex: 1;
    }

    .notification-info h3 {
      color: var(--green-800);
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
    }

    .plant-name {
      color: var(--green-600);
      margin: 0;
      font-size: 0.9rem;
    }

    .notification-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: 1px solid var(--green-200);
      padding: 0.35rem 0.5rem;
      border-radius: 0.35rem;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.2s ease;
    }

    .btn-icon:hover {
      background: var(--green-100);
      border-color: var(--green-600);
    }

    .btn-icon.btn-danger:hover {
      background: #ffebee;
      border-color: #c62828;
    }

    .btn-icon.btn-success:hover {
      background: #e8f5e9;
      border-color: #4caf50;
    }

    .notification-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      color: var(--text);
      margin: 0;
      line-height: 1.5;
    }

    .notification-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: var(--green-100);
      border-radius: 0.35rem;
    }

    .label {
      color: var(--green-700);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .value {
      color: var(--green-900);
      font-weight: 600;
    }

    .status-pending { color: #ff9800; }
    .status-sent { color: #4caf50; }
    .status-failed { color: #f44336; }

    @media (max-width: 768px) {
      .page-header h2 {
        font-size: 1.6rem;
      }

      .page-container {
        padding: 1.5rem 1rem;
      }

      .notifications-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NotificationsListComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  async fetch() {
    this.loading = true;
    this.error = '';
    try {
      this.notifications = await this.api.get<Notification[]>('/notifications');
      // Rafraîchir le service pour mettre à jour le compteur
      await this.notificationsService.refresh();
    } catch (e: any) {
      this.error = e?.message || 'Erreur de chargement';
    } finally {
      this.loading = false;
    }
  }

  async checkNow() {
    try {
      await this.notificationsService.checkDueAndNotify();
      await this.fetch();
    } catch {}
  }

  async toggleNotification(id: number) {
    try {
      await this.api.patch(`/notifications/${id}/toggle`, {});
      await this.fetch();
    } catch (e: any) {
      this.error = e?.message || 'Erreur lors de la modification';
    }
  }

  async markAsSent(id: number) {
    try {
      await this.api.patch(`/notifications/${id}/mark-sent`, {});
      await this.fetch();
    } catch (e: any) {
      this.error = e?.message || 'Erreur lors de la mise à jour';
    }
  }

  async deleteNotification(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rappel ?')) {
      return;
    }
    try {
      await this.api.delete(`/notifications/${id}`);
      await this.fetch();
    } catch (e: any) {
      this.error = e?.message || 'Erreur lors de la suppression';
    }
  }

  getChannelIcon(channel: string): string {
    const icons: Record<string, string> = {
      'in-app': '📱',
      'email': '📧',
      'sms': '💬',
      'push': '🔔'
    };
    return icons[channel] || '🔔';
  }

  getChannelLabel(channel: string): string {
    const labels: Record<string, string> = {
      'in-app': 'Application',
      'email': 'Email',
      'sms': 'SMS',
      'push': 'Notification push'
    };
    return labels[channel] || channel;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'sent': 'Envoyé',
      'failed': 'Échec'
    };
    return labels[status] || status;
  }
}
