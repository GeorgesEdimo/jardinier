import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

export interface Notification {
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

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private activeNotifications = signal<Notification[]>([]);
  private unreadCount = signal(0);
  private alarmNow = signal<Notification | null>(null);
  private alarmAudio?: HTMLAudioElement;

  constructor(private api: ApiService) {
    this.loadActiveNotifications();
    // lancer un premier check pour capter les rappels déjà échus
    this.checkDueAndNotify();
  }

  /**
   * Récupère les notifications actives
   */
  async loadActiveNotifications() {
    try {
      const notifications = await this.api.get<Notification[]>('/notifications/active');
      this.activeNotifications.set(notifications);
      
      // Compter les notifications non lues (pending et dans le futur proche)
      const now = new Date();
      const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h
      const unread = notifications.filter(n => {
        if (!n.sendAt) return false;
        const sendDate = new Date(n.sendAt);
        return sendDate <= soon && n.status === 'pending';
      });
      this.unreadCount.set(unread.length);
    } catch (e) {
      console.error('Erreur lors du chargement des notifications actives', e);
    }
  }

  /**
   * Retourne le signal des notifications actives
   */
  getActiveNotifications() {
    return this.activeNotifications.asReadonly();
  }

  /**
   * Retourne le signal du compteur de notifications non lues
   */
  getUnreadCount() {
    return this.unreadCount.asReadonly();
  }

  /**
   * Rafraîchit les notifications
   */
  refresh() {
    return this.loadActiveNotifications();
  }

  /**
   * Appelle le backend pour traiter les rappels arrivés à échéance
   * et affiche une notification navigateur + son si possible.
   */
  async checkDueAndNotify() {
    try {
      const processed = await this.api.post<Notification[]>('/notifications/process', {});
      if (processed && processed.length) {
        // Mettre à jour la liste et le compteur
        await this.loadActiveNotifications();

        // Demander la permission de notification si nécessaire
        if ('Notification' in window && Notification.permission === 'default') {
          try { await Notification.requestPermission(); } catch {}
        }

        // Jouer un son léger
        this.playChime();

        // Afficher une notif pour chaque rappel traité
        for (const n of processed) {
          this.showBrowserNotification(n);
        }

        // Déclencher une alarme plein écran pour le premier rappel traité
        const first = processed[0];
        if (first) {
          this.triggerAlarm(first);
        }
      }
    } catch (e) {
      // Silencieux: le polling ne doit pas casser l'app
      console.debug('checkDueAndNotify skipped', e);
    }
  }

  private showBrowserNotification(n: Notification) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const title = n.subject || 'Rappel Jardinier';
    const body = n.message || 'Un rappel est arrivé à échéance.';
    // Icônes inline (carré vert) pour éviter 404 si assets manquants
    const png1x1 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQotWQAAAABJRU5ErkJggg==';
    const opts: NotificationOptions = {
      body,
      icon: png1x1,
      badge: png1x1,
    } as any;
    try { new Notification(title, opts); } catch {}
  }

  private playChime() {
    try {
      const audio = new Audio('data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA...');
      // Rem: data URI court suffisant pour un clic sonore minimal; certains navigateurs exigent une interaction utilisateur préalable
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch {}
  }

  /**
   * Expose l'état de l'alarme en cours (plein écran)
   */
  getAlarm() {
    return this.alarmNow.asReadonly();
  }

  /**
   * Déclenche l'alarme plein écran et joue un son type alarme.
   */
  triggerAlarm(n: Notification) {
    this.alarmNow.set(n);
    this.playAlarm();
  }

  /**
   * Coupe l'alarme et nettoie l'audio.
   */
  stopAlarm() {
    this.alarmNow.set(null);
    try {
      if (this.alarmAudio) {
        this.alarmAudio.pause();
        this.alarmAudio.currentTime = 0;
        this.alarmAudio = undefined;
      }
    } catch {}
  }

  private playAlarm() {
    try {
      // Son d'alarme (bip) en data URI. Peut nécessiter une interaction utilisateur préalable selon le navigateur.
      const alarmData = 'data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA...';
      this.alarmAudio = new Audio(alarmData);
      this.alarmAudio.loop = true;
      this.alarmAudio.volume = 0.8;
      this.alarmAudio.play().catch(() => {});
    } catch {}
  }
}
