import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api.service';

@Component({
  standalone: true,
  selector: 'app-due-list',
  imports: [CommonModule],
  template: `
    <div class="container page-container">
      <div class="page-header">
        <h2>Arrosages dus</h2>
        <span class="badge" *ngIf="schedules.length > 0">{{ schedules.length }}</span>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner">💧</div>
        <p>Chargement...</p>
      </div>

      <div *ngIf="error" class="error-message card">
        ⚠️ {{ error }}
      </div>

      <div *ngIf="!loading && schedules.length === 0" class="empty-state card">
        <div class="empty-icon">✅</div>
        <h3>Aucun arrosage dû</h3>
        <p>Toutes vos plantes sont à jour ! Revenez plus tard.</p>
      </div>

      <div *ngIf="!loading && schedules.length > 0" class="schedules-grid">
        <div *ngFor="let s of schedules" class="card schedule-card">
          <div class="schedule-icon">💧</div>
          <div class="schedule-info">
            <h3>Plante #{{ s.plantId }}</h3>
            <div class="schedule-details">
              <div class="detail-item">
                <span class="label">Prochain arrosage:</span>
                <span class="value">{{ s.nextWateringAt | date:'short' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Quantité:</span>
                <span class="value">{{ s.waterQuantityMl }} ml</span>
              </div>
              <div class="detail-item" *ngIf="s.frequencyDays">
                <span class="label">Fréquence:</span>
                <span class="value">Tous les {{ s.frequencyDays }} jours</span>
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
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .page-header h2 {
      margin: 0;
      color: var(--green-900);
      font-size: 2rem;
    }

    .badge {
      background: var(--green-600);
      color: #fff;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .loading {
      text-align: center;
      padding: 3rem 1rem;
    }

    .spinner {
      font-size: 3rem;
      animation: bounce 1s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
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
      margin: 0;
    }

    .schedules-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }

    .schedule-card {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .schedule-card:hover {
      transform: translateY(-2px);
    }

    .schedule-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .schedule-info {
      flex: 1;
    }

    .schedule-info h3 {
      color: var(--green-800);
      margin: 0 0 1rem;
      font-size: 1.2rem;
    }

    .schedule-details {
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

    @media (max-width: 768px) {
      .page-header h2 {
        font-size: 1.6rem;
      }

      .page-container {
        padding: 1.5rem 1rem;
      }

      .schedules-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DueListComponent implements OnInit {
  schedules: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.fetch(); }

  async fetch() {
    this.loading = true;
    this.error = '';
    try {
      this.schedules = await this.api.get<any[]>('/watering/due');
    } catch (e: any) {
      this.error = e?.message || 'Erreur de chargement';
    } finally {
      this.loading = false;
    }
  }
}
