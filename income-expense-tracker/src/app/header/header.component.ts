import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { SignInResponse } from '../models/sign-in-response';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  userResponse!:SignInResponse
  firstName : string = ''
  lastName : string = ''
  email : string = ''
  isOpen = false;
  constructor(private sidebarService: SidebarService, private eRef: ElementRef, private router : Router, private toastrService : ToastrService ) {}
  
  ngOnInit(): void {
    const userResponse = sessionStorage.getItem('userResponse');
    if(userResponse){
      this.userResponse = JSON.parse(atob(userResponse as string));
      this.firstName = this.userResponse.firstName;
      this.lastName = this.userResponse.lastName;
      this.email = this.userResponse.email;
    }
  }
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: Event) {
    // If click is outside dropdown AND not on the button, close it
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
  logout(){
    sessionStorage.clear();
    this.router.navigate(['/sign-in']);
    this.toastrService.success("Logged out successfully", "Success")
  }

  navigateToChangePassword(){
    this.router.navigate(['/change-password']);
  }
}
