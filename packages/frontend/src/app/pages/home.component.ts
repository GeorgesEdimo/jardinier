import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-fixed">
      <div class="hero-overlay">
        <div class="overlay-content">
          <div class="hero-icon">🌿</div>
          <h1>Jardinier</h1>
          <p class="hero-subtitle">Votre assistant pour des plantes rayonnantes, à l'intérieur comme à l'extérieur</p>
          <div class="cta">
            <a routerLink="/register" class="btn btn-primary">Créer un compte</a>
            <a routerLink="/login" class="btn btn-secondary">Se connecter</a>
          </div>
        </div>
      </div>
    </section>
    
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Fonctionnalités</h2>
        <div class="grid grid-3">
          <div class="card feature-card">
            <div class="feature-icon">🪴</div>
            <h3>Gestion des plantes</h3>
            <p>Ajoutez vos plantes avec leurs caractéristiques, notes personnalisées et photos. Consultez l'historique complet des arrosages.</p>
          </div>
          <div class="card feature-card">
            <div class="feature-icon">💧</div>
            <h3>Arrosages dus</h3>
            <p>Visualisez en un coup d'œil les plantes à arroser aujourd'hui. Marquez les arrosages effectués en un clic.</p>
          </div>
          <div class="card feature-card">
            <div class="feature-icon">🌤️</div>
            <h3>Météo intelligente</h3>
            <p>Ajustez automatiquement la fréquence d'arrosage selon la température et l'humidité de votre région.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-card card">
          <h2>Prêt à commencer ?</h2>
          <p>Créez votre compte gratuitement et commencez à gérer vos plantes dès aujourd'hui.</p>
          <a routerLink="/register" class="btn btn-primary">Créer un compte</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-fixed { position: relative; height: 60vh; min-height: 420px; background: url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat; }
    .hero-overlay { position: absolute; inset: 0; display: grid; place-items: center; }
    .overlay-content { text-align: center; color: #fff; padding: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,.4); }
    .hero-icon { font-size: 4rem; margin-bottom: .75rem; animation: float 3s ease-in-out infinite; }
    @keyframes float { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
    h1 { font-size: 3rem; margin: 0 0 .75rem; letter-spacing: -0.02em; }
    .hero-subtitle { font-size: 1.2rem; margin: 0 auto 1.2rem; max-width: 760px; opacity: .95; }
    .cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

    .features-section {
      padding: 4rem 1rem;
    }

    .section-title {
      text-align: center;
      font-size: 2rem;
      margin: 0 0 3rem;
      color: var(--green-900);
    }

    .feature-card {
      text-align: center;
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: var(--green-800);
      margin: 0 0 0.75rem;
      font-size: 1.3rem;
    }

    .feature-card p {
      color: var(--text);
      margin: 0;
      line-height: 1.6;
    }

    .cta-section {
      padding: 3rem 1rem 4rem;
      background: var(--green-100);
    }

    .cta-card {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }

    .cta-card h2 {
      color: var(--green-900);
      margin: 0 0 1rem;
      font-size: 2rem;
    }

    .cta-card p {
      color: var(--text);
      margin: 0 0 2rem;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .hero-icon { font-size: 3rem; }
      h1 { font-size: 2.2rem; }
      .hero-subtitle { font-size: 1rem; }
      .cta-section .card { padding: 2rem 1.5rem; }
      .cta-card h2 { font-size: 1.6rem; }
    }
  `]
})
export class HomeComponent {}
