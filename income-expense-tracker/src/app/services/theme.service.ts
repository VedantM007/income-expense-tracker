import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSignal = signal<'light' | 'dark'>('light');

  get theme() {
    return this.themeSignal.asReadonly();
  }

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = sessionStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  setTheme(theme: 'light' | 'dark') {
    this.themeSignal.set(theme);
    sessionStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    this.setTheme(this.themeSignal() === 'light' ? 'dark' : 'light');
  }
}
