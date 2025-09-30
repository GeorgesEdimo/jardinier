import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/api.service';
import { NotificationsService } from '../core/notifications.service';

interface Plant {
  id: number;
  name: string;
  species?: string;
}

@Component({
  standalone: true,
  selector: 'app-notification-add',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-container">
      <h2>Créer un rappel</h2>

      <form (ngSubmit)="submit()" #f="ngForm" class="form-card card">
        <div class="form-group">
          <label for="plantId">Plante (optionnel)</label>
          <select id="plantId" name="plantId" [(ngModel)]="plantId" class="form-control">
            <option [value]="null">-- Aucune plante --</option>
            <option *ngFor="let plant of plants" [value]="plant.id">
              {{ plant.name }} <span *ngIf="plant.species">({{ plant.species }})</span>
            </option>
          </select>
          <small>Associez ce rappel à une plante spécifique</small>
        </div>

        <div class="form-group">
          <label for="channel">Canal de notification *</label>
          <select id="channel" name="channel" [(ngModel)]="channel" required class="form-control">
            <option value="in-app">📱 Application</option>
            <option value="email">📧 Email</option>
            <option value="sms">💬 SMS</option>
            <option value="push">🔔 Notification push</option>
          </select>
        </div>

        <div class="form-group">
          <label for="subject">Titre</label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            [(ngModel)]="subject" 
            placeholder="Ex: Arrosage de ma plante"
            class="form-control" />
        </div>

        <div class="form-group">
          <label for="message">Message</label>
          <textarea 
            id="message" 
            name="message" 
            [(ngModel)]="message" 
            rows="3"
            placeholder="Ex: Il est temps d'arroser votre plante !"
            class="form-control"></textarea>
        </div>

        <div class="form-group">
          <label for="sendAt">Date et heure du rappel</label>
          <input 
            type="datetime-local" 
            id="sendAt" 
            name="sendAt" 
            [(ngModel)]="sendAt" 
            class="form-control" />
          <small>Laissez vide pour un rappel immédiat</small>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              name="isRecurring" 
              [(ngModel)]="isRecurring" />
            <span>Rappel récurrent</span>
          </label>
        </div>

        <div class="form-group" *ngIf="isRecurring">
          <label for="recurringDays">Fréquence (en jours)</label>
          <input 
            type="number" 
            id="recurringDays" 
            name="recurringDays" 
            [(ngModel)]="recurringDays" 
            min="1"
            placeholder="Ex: 7 pour chaque semaine"
            class="form-control" />
          <small>Le rappel sera répété tous les X jours</small>
        </div>

        <div *ngIf="error" class="error-message">
          ⚠️ {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" (click)="cancel()" class="btn btn-secondary">
            Annuler
          </button>
          <button type="submit" [disabled]="loading || !f.valid" class="btn btn-primary">
            {{ loading ? 'Création...' : 'Créer le rappel' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem 1rem;
      max-width: 700px;
      margin: 0 auto;
    }

    h2 {
      color: var(--green-900);
      margin: 0 0 2rem;
      font-size: 2rem;
    }

    .form-card {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--green-900);
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-family: inherit;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--green-600);
      box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    small {
      display: block;
      margin-top: 0.35rem;
      color: #666;
      font-size: 0.85rem;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-left: 4px solid #c62828;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--green-100);
    }

    @media (max-width: 768px) {
      h2 {
        font-size: 1.6rem;
      }

      .form-card {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class NotificationAddComponent implements OnInit {
  plants: Plant[] = [];
  plantId: number | null = null;
  channel = 'in-app';
  subject = '';
  message = '';
  sendAt = '';
  isRecurring = false;
  recurringDays: number | null = null;
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loadPlants();
  }

  async loadPlants() {
    try {
      this.plants = await this.api.get<Plant[]>('/plants');
    } catch (e: any) {
      console.error('Erreur lors du chargement des plantes', e);
    }
  }

  async submit() {
    this.loading = true;
    this.error = '';
    try {
      const payload: any = {
        channel: this.channel,
        isRecurring: this.isRecurring,
      };

      // Convertir plantId en nombre si présent
      if (this.plantId !== null && this.plantId !== undefined) {
        payload.plantId = Number(this.plantId);
      }

      if (this.subject && this.subject.trim()) {
        payload.subject = this.subject.trim();
      }

      if (this.message && this.message.trim()) {
        payload.message = this.message.trim();
      }

      if (this.sendAt) {
        payload.sendAt = new Date(this.sendAt).toISOString();
      }

      if (this.isRecurring && this.recurringDays) {
        payload.recurringDays = Number(this.recurringDays);
      }

      console.log('📤 Payload envoyé:', JSON.stringify(payload, null, 2));

      await this.api.post('/notifications', payload);
      // Rafraîchir le service pour mettre à jour le compteur
      await this.notificationsService.refresh();
      this.router.navigate(['/notifications']);
    } catch (e: any) {
      console.error('❌ Erreur complète:', e);
      this.error = e?.error?.message || e?.message || 'Erreur lors de la création du rappel';
      
      // Afficher les détails de validation si disponibles
      if (e?.error?.message && Array.isArray(e.error.message)) {
        this.error = 'Erreurs de validation: ' + e.error.message.join(', ');
      }
    } finally {
      this.loading = false;
    }
  }

  cancel() {
    this.router.navigate(['/notifications']);
  }
}
