import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Replace with your actual service path
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastr : ToastrService) {}

  canActivate(): boolean {
    if (this.authService.isSignedIn()) {
      return true; // User is authenticated
    } else {
      // Redirect to login page if not authenticated
      this.router.navigate(['/']);
      this.toastr.error('Please Sign In again', 'Session Timeout')
      return false;
    }
  }
}

