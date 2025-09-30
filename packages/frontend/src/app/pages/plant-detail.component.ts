import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  standalone: true,
  selector: 'app-plant-detail',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" *ngIf="plant">
      <h2>{{ plant.name }} <small *ngIf="plant.species">({{ plant.species }})</small></h2>
      <p *ngIf="plant.notes">{{ plant.notes }}</p>

      <section>
        <h3>Arroser</h3>
        <form (ngSubmit)="water()">
          <label>Quantité (ml): <input type="number" [(ngModel)]="waterForm.quantityMl" name="quantityMl" /></label>
          <label>Notes: <input type="text" [(ngModel)]="waterForm.notes" name="notes" /></label>
          <button type="submit" [disabled]="loadingWater">Arroser</button>
          <span *ngIf="errorWater" class="error">{{ errorWater }}</span>
        </form>
      </section>

      <section>
        <h3>Historique</h3>
        <ul>
          <li *ngFor="let w of history">{{ w.wateredAt | date:'short' }} - {{ w.quantityMl || 'N/A' }} ml <small *ngIf="w.notes">({{ w.notes }})</small></li>
        </ul>
      </section>

      <section>
        <h3>Images</h3>
        <div class="images">
          <img *ngFor="let img of plant.images" [src]="apiBase + img.url" alt="plant" />
        </div>
        <label>Ajouter une image:
          <input type="file" (change)="onFile($event)" />
        </label>
        <span *ngIf="errorUpload" class="error">{{ errorUpload }}</span>
      </section>
    </div>
  `,
  styles: [`.container{padding:1rem}.error{color:#c62828}.images img{max-width:120px; margin:.25rem}`]
})
export class PlantDetailComponent implements OnInit {
  apiBase = 'http://localhost:3000';
  id!: number;
  plant: any;
  history: any[] = [];
  waterForm: any = { quantityMl: 500, notes: '' };
  loadingWater = false;
  errorWater = '';
  errorUpload = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  async load() {
    this.plant = await this.api.get<any>(`/plants/${this.id}`);
    this.history = await this.api.get<any[]>(`/plants/${this.id}/history`);
  }

  async water() {
    this.loadingWater = true;
    this.errorWater = '';
    try {
      await this.api.post(`/plants/${this.id}/water`, {
        quantityMl: this.waterForm.quantityMl || undefined,
        notes: this.waterForm.notes || undefined,
      });
      await this.load();
    } catch (e: any) {
      this.errorWater = e?.message || 'Erreur arrosage';
    } finally {
      this.loadingWater = false;
    }
  }

  async onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.errorUpload = '';
    try {
      await this.api.upload(`/media-upload/${this.id}`, file);
      await this.load();
      input.value = '';
    } catch (e: any) {
      this.errorUpload = e?.message || "Erreur d'upload";
    }
  }
}
