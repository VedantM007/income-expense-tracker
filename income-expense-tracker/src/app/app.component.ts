import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { Subscription } from 'rxjs';
import { SidebarService } from './sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  show: boolean = true;
  isSidebarOpen: boolean = false;
  private sidebarSubscription!: Subscription;
  constructor(private router: Router, private sidebarService: SidebarService) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        
        // Define the routes where notes and footer should be hidden
        const hideRoutes = ['/sign-in', '/sign-up', '/forget-password', '/reset-password']

        // Update visibility based on the current route
        this.show = !hideRoutes.some((route) =>
          currentRoute.includes(route)
        );
      }
    });
     // Subscribe to the sidebar open state
     this.sidebarSubscription = this.sidebarService.isSidebarOpen$.subscribe((isOpen: boolean) => {
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
