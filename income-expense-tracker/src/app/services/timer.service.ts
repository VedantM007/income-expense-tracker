import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timerKey = 'timer';  // Key for localStorage

  constructor() { }
  
  // Initialize the timer from localStorage or start fresh
  initializeTimer() {
    const savedTime = localStorage.getItem(this.timerKey);
    if (savedTime) {
      return Number(savedTime);
    } else {
      // Set the timer to 10 minutes (600 seconds)
      this.saveTime(60);
      return 60;
    }
  }

  // Save the current time in localStorage
  saveTime(time: number) {
    localStorage.setItem(this.timerKey, time.toString());
  }

  // Remove the timer data from localStorage (e.g., reset timer)
  clearTimer() {
    localStorage.removeItem(this.timerKey);
  }
  
  resetToDefault(): number {
    const defaultTime = 60; // Default time in seconds (10 minutes)
    this.saveTime(defaultTime);
    return defaultTime;
  }
}
