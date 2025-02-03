import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy{
  isSidebarOpen: boolean = false;
  private sidebarSubscription!: Subscription;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    // Subscribe to the sidebar open state
    this.sidebarSubscription = this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
  }

  ngOnDestroy() {
    // Clean up the subscription to avoid memory leaks
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }
}
