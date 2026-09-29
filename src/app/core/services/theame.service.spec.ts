import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TheameService } from './theame.service';

describe('TheameService', () => {
  let document: Document;
  let storage: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    document = window.document.implementation.createHTMLDocument('theme test');
    storage = jasmine.createSpyObj<Storage>('Storage', ['getItem', 'setItem']);
    Object.defineProperty(document, 'defaultView', { value: { localStorage: storage } });
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: document },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
  });

  it('toggles both theme attributes and persists the selection', () => {
    const service = TestBed.inject(TheameService);
    expect(service.currentTheme()).toBe('light');
    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
    expect(storage.setItem).toHaveBeenCalledWith('theme', 'dark');
    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
    expect(storage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('restores dark mode from storage', () => {
    storage.getItem.and.returnValue('dark');
    expect(TestBed.inject(TheameService).currentTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('defaults invalid stored values to light', () => {
    storage.getItem.and.returnValue('invalid');
    expect(TestBed.inject(TheameService).currentTheme()).toBe('light');
  });

  it('keeps working when storage is blocked', () => {
    storage.getItem.and.throwError('Storage blocked');
    storage.setItem.and.throwError('Storage blocked');
    const service = TestBed.inject(TheameService);
    expect(() => service.toggleTheme()).not.toThrow();
    expect(service.currentTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('does not access browser storage on the server', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const service = TestBed.inject(TheameService);
    service.toggleTheme();
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});