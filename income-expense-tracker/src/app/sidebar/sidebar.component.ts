import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ElementRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService } from './sidebar.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy{
  isSidebarOpen: boolean = false;
  private sidebarSubscription!: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // Subscribe to the sidebar open state
    this.sidebarSubscription = this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Only close if sidebar is open, and we are on mobile/tablet (less than md size)
    if (this.isSidebarOpen && window.innerWidth < 768) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      
      // Check if the hamburger button (or the svg/path inside it) was clicked
      const hamburgerButton = document.querySelector('[aria-label="Toggle Sidebar"]');
      const clickedHamburger = hamburgerButton && hamburgerButton.contains(event.target as Node);

      if (!clickedInside && !clickedHamburger) {
        this.sidebarService.setSidebarState(false);
      }
    }
  }

  ngOnDestroy() {
    // Clean up the subscription to avoid memory leaks
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }
}
