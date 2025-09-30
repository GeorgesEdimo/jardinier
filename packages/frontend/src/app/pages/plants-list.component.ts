import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  standalone: true,
  selector: 'app-plants-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container page-container">
      <div class="page-header">
        <h2>Mes plantes</h2>
        <a routerLink="/plants/add" class="btn btn-primary">
          <span>➕</span> Ajouter une plante
        </a>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner">🌿</div>
        <p>Chargement...</p>
      </div>

      <div *ngIf="error" class="error-message card">
        ⚠️ {{ error }}
      </div>

      <div *ngIf="!loading && plants.length === 0" class="empty-state card">
        <div class="empty-icon">🪴</div>
        <h3>Aucune plante pour le moment</h3>
        <p>Commencez par ajouter votre première plante !</p>
        <a routerLink="/plants/add" class="btn btn-primary">Ajouter une plante</a>
      </div>

      <div *ngIf="!loading && plants.length > 0" class="grid grid-2">
        <div *ngFor="let p of plants" class="card plant-card">
          <div class="plant-icon">🌱</div>
          <h3>{{ p.name }}</h3>
          <p *ngIf="p.species" class="species">{{ p.species }}</p>
          <p *ngIf="p.notes" class="notes">{{ p.notes }}</p>
          <a [routerLink]="['/plants', p.id]" class="btn btn-secondary">Voir détails</a>
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
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
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

    .plant-card {
      text-align: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .plant-card:hover {
      transform: translateY(-4px);
    }

    .plant-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .plant-card h3 {
      color: var(--green-800);
      margin: 0 0 0.5rem;
      font-size: 1.3rem;
    }

    .species {
      color: var(--green-600);
      font-style: italic;
      margin: 0 0 0.5rem;
      font-size: 0.95rem;
    }

    .notes {
      color: var(--text);
      margin: 0 0 1rem;
      font-size: 0.9rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .page-header h2 {
        font-size: 1.6rem;
      }

      .page-container {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class PlantsListComponent implements OnInit {
  plants: any[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetch();
  }

  async fetch() {
    this.loading = true;
    this.error = '';
    try {
      this.plants = await this.api.get<any[]>('/plants');
    } catch (e: any) {
      this.error = e?.message || 'Erreur de chargement';
    } finally {
      this.loading = false;
    }
  }
}
