import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: string | object
  ) {}

  // One key per user and date makes repeated writes (including tabs) idempotent.
  recordLogin(userId: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    try {
      this.document.defaultView?.localStorage.setItem(`${this.prefix(userId)}${date}`, '1');
    } catch {
      // Attendance storage failure must not prevent a successful login.
    }
  }

  getDays(userId: number): number | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const storage = this.document.defaultView?.localStorage;
      if (!storage) return null;
      const prefix = this.prefix(userId);
      let days = 0;
      for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (key?.startsWith(prefix) && /^\d{4}-\d{2}-\d{2}$/.test(key.slice(prefix.length)) && storage.getItem(key) === '1') {
          days++;
        }
      }
      return days;
    } catch {
      return null;
    }
  }

  private prefix(userId: number): string {
    return `attendance:v1:${userId}:`;
  }
}
