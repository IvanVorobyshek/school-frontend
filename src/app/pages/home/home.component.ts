import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="home">
      <h1>School Frontend</h1>
      <p class="api-url">API: {{ apiUrl }}</p>
      <p class="api-status">Status: {{ status() }}</p>
      <button (click)="checkApi()">Check API (/v1/auth/me)</button>
      <button (click)="checkUsers()">Check Users ({{ apiUrl }})</button>
      @if (users()) {
        <pre class="users">{{ users() | json }}</pre>
      }
    </div>
  `,
  styles: `
    .home { padding: 2rem; font-family: system-ui; }
    .api-url { color: #666; font-size: 0.9rem; }
    .api-status { margin: 1rem 0; }
    button { padding: 0.5rem 1rem; cursor: pointer; margin-right: 0.5rem; margin-bottom: 0.5rem; }
    .users { margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px; font-size: 0.85rem; overflow-x: auto; }
  `
})
export class HomeComponent {
  private api = inject(ApiService);
  apiUrl = environment.apiUrl;
  status = signal<string>('—');
  users = signal<unknown>(null);
  private readonly usersUrl = `${environment.apiUrl}/api/users`;

  checkApi(): void {
    this.status.set('Checking...');
    this.users.set(null);
    this.api.get<unknown>('/v1/auth/me').subscribe({
      next: (res) => this.status.set(`OK: ${(res as { name?: string })?.name ?? 'connected'}`),
      error: (err) => this.status.set(`Error: ${err.status || err.message}`)
    });
  }

  checkUsers(): void {
    this.users.set(null);
    this.api.getFromUrl<{ data?: unknown[] }>(this.usersUrl).subscribe({
      next: (res) => this.users.set(res.data ?? res),
      error: (err) => this.users.set({ error: err?.message ?? 'API unavailable' })
    });
  }
}
