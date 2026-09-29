import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class TheameService {
  private readonly theme = signal<Theme>('light');
  readonly currentTheme = this.theme.asReadonly();
  private readonly isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    let initialTheme: Theme = 'light';
    if (this.isBrowser) {
      try {
        initialTheme = this.document.defaultView?.localStorage.getItem('theme') === 'dark'
          ? 'dark' : 'light';
      } catch {
        // Storage may be unavailable; the toggle still works for this session.
      }
    }
    this.applyTheme(initialTheme);
  }

  setTheme(theme: Theme): void {
    this.applyTheme(theme);
    if (this.isBrowser) {
      try {
        this.document.defaultView?.localStorage.setItem('theme', theme);
      } catch {
        // Keep the selected theme even if it cannot be persisted.
      }
    }
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
  }

  private applyTheme(theme: Theme): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    this.document.documentElement.setAttribute('data-bs-theme', theme);
  }
}