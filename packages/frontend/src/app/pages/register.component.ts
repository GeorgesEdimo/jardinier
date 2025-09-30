import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-bg">
      <div class="auth-overlay"></div>
      <div class="auth-center">
        <div class="auth-card">
          <h2>Créer un compte</h2>
          <form (ngSubmit)="submit()" #f="ngForm" class="auth-form">
            <label>
              <span>Email</span>
              <input name="email" [(ngModel)]="email" type="email" required placeholder="vous@exemple.com" />
            </label>
            <label>
              <span>Nom</span>
              <input name="name" [(ngModel)]="name" type="text" placeholder="Votre nom" />
            </label>
            <label>
              <span>Mot de passe</span>
              <input name="password" [(ngModel)]="password" type="password" required placeholder="••••••••" />
            </label>
            <button type="submit" [disabled]="loading" class="btn-primary">Créer</button>
            <div *ngIf="error" class="error">{{ error }}</div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-bg {
      position: relative;
      min-height: 100vh;
      background: url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat fixed;
    }
    .auth-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.25); backdrop-filter: blur(1.5px); }
    .auth-center { position: relative; z-index: 1; display: grid; place-items: center; min-height: inherit; padding: 2rem 1rem; }
    .auth-card {
      width: 100%; max-width: 460px; padding: 2rem; border-radius: 16px;
      background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25);
      backdrop-filter: blur(8px); color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.25);
    }
    .auth-form { display: flex; flex-direction: column; gap: 1rem; }
    .auth-form input {
      width: 100%; box-sizing: border-box;
      padding: .85rem 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,.35);
      background: rgba(255,255,255,.15); color: #fff;
    }
    .auth-form input::placeholder { color: rgba(255,255,255,.85); }
    .btn-primary { width: 100%; background: #34a853; color: #fff; border: none; padding: .9rem 1rem; border-radius: 12px; cursor: pointer; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .error { color: #ffb4a9; margin-top: .5rem; }
    @media (max-width: 480px) { .auth-card { padding: 1.5rem; } }
  `]
})
export class RegisterComponent {
  email = '';
  name = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.register(this.email, this.password, this.name || undefined);
      this.router.navigate(['/plants']);
    } catch (e: any) {
      this.error = e?.message || "Erreur d'inscription";
    } finally {
      this.loading = false;
    }
  }
}
