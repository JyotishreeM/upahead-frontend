import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AttendanceService } from './attendance.service';
import { AuthServiceService } from './auth.service';

describe('Daily login attendance', () => {
  let service: AttendanceService;
  let entries: Map<string, string>;
  let storage: Storage;

  beforeEach(() => {
    entries = new Map();
    storage = {
      get length() { return entries.size; },
      key: index => Array.from(entries.keys())[index] ?? null,
      getItem: key => entries.get(key) ?? null,
      setItem: (key, value) => { entries.set(key, value); },
      removeItem: key => { entries.delete(key); },
      clear: () => entries.clear()
    };
    const document = window.document.implementation.createHTMLDocument('attendance test');
    Object.defineProperty(document, 'defaultView', { value: { localStorage: storage } });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: DOCUMENT, useValue: document },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 8, 29, 23, 59));
    service = TestBed.inject(AttendanceService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    TestBed.inject(HttpTestingController).verify();
  });

  it('credits only one day for repeated logins, including a new service instance', () => {
    service.recordLogin(1);
    service.recordLogin(1);
    const reloaded = new AttendanceService(TestBed.inject(DOCUMENT), 'browser');
    reloaded.recordLogin(1);
    expect(reloaded.getDays(1)).toBe(1);
  });

  it('credits another day after local midnight without crediting skipped days', () => {
    service.recordLogin(1);
    jasmine.clock().mockDate(new Date(2026, 8, 30, 0, 1));
    service.recordLogin(1);
    jasmine.clock().mockDate(new Date(2026, 9, 3));
    service.recordLogin(1);
    expect(service.getDays(1)).toBe(3);
    expect(entries.has('attendance:v1:1:2026-09-29')).toBeTrue();
  });

  it('keeps attendance separate for each user', () => {
    service.recordLogin(1);
    expect(service.getDays(2)).toBe(0);
    service.recordLogin(2);
    expect(service.getDays(1)).toBe(1);
    expect(service.getDays(2)).toBe(1);
  });

  it('does not crash login when storage is blocked', () => {
    spyOn(storage, 'setItem').and.throwError('Blocked');
    expect(() => service.recordLogin(1)).not.toThrow();
  });

  it('does not access storage during server rendering', () => {
    const server = new AttendanceService({} as Document, 'server');
    expect(() => server.recordLogin(1)).not.toThrow();
    expect(server.getDays(1)).toBeNull();
  });

  it('credits successful authentication but not failed authentication', () => {
    const auth = TestBed.inject(AuthServiceService);
    const http = TestBed.inject(HttpTestingController);
    auth.login('student@example.com', 'password').subscribe({ error: () => {} });
    http.expectOne(request => request.url.endsWith('/api/auth/login'))
      .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(service.getDays(1)).toBe(0);
    auth.login('student@example.com', 'password').subscribe();
    http.expectOne(request => request.url.endsWith('/api/auth/login'))
      .flush({ token: 'test-token', user: { userId: 1 } });
    expect(service.getDays(1)).toBe(1);
  });
});
