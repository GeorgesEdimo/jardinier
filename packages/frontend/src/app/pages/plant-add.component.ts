import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  standalone: true,
  selector: 'app-plant-add',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Ajouter une plante</h2>
      <form (ngSubmit)="submit()" #f="ngForm">
        <label>Nom<br /><input name="name" [(ngModel)]="form.name" required /></label><br />
        <label>Espèce<br /><input name="species" [(ngModel)]="form.species" /></label><br />
        <label>Date d'achat<br /><input name="purchaseDate" [(ngModel)]="form.purchaseDate" type="date" /></label><br />
        <label>Notes<br /><textarea name="notes" [(ngModel)]="form.notes"></textarea></label><br />
        <button type="submit" [disabled]="loading">Créer</button>
        <span *ngIf="error" class="error">{{ error }}</span>
      </form>
    </div>
  `,
  styles: [`.container{padding:1rem}.error{color:#c62828}`]
})
export class PlantAddComponent {
  form: any = { name: '', species: '', purchaseDate: '', notes: '' };
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  async submit() {
    this.loading = true;
    this.error = '';
    try {
      await this.api.post('/plants', {
        name: this.form.name,
        species: this.form.species || undefined,
        purchaseDate: this.form.purchaseDate ? new Date(this.form.purchaseDate).toISOString() : undefined,
        notes: this.form.notes || undefined,
      });
      this.router.navigate(['/plants']);
    } catch (e: any) {
      this.error = e?.message || "Erreur d'enregistrement";
    } finally {
      this.loading = false;
    }
  }
}
