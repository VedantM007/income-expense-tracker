import { Injectable } from '@angular/core';
import { CommonService } from '../services/common.service';
import { catchError, Observable, throwError } from 'rxjs';
import { SignUpPayload } from '../models/sign-up-payload';
import { SignInPayload } from '../models/sign-in-payload';
import { SignInResponse } from '../models/sign-in-response';
import { VerifyOtpPayload } from '../models/verify-otp-payload';
import { environment } from '../../environments/environment.dev';
import { Router } from '@angular/router';
import { ChangePasswordModel } from '../models/change-password-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private commonService : CommonService, private router : Router) { }

  signUp(payload : SignUpPayload):Observable<any>{
    return this.commonService.httpPost(`${environment.apiURL}/auth/signup`, payload)
   }

  signIn(payload : SignInPayload):Observable<any>{
    return this.commonService.httpPost(`${environment.apiURL}/auth/signin`, payload)
  }

  verifyOtp(payload : VerifyOtpPayload):Observable<SignInResponse>{
    return this.commonService.httpPost(`${environment.apiURL}/auth/verifyOtp`, payload)
  }

  resendOtp(payload: { email: string }): Observable<any> {
    return this.commonService.httpPost(`${environment.apiURL}/auth/resendOtp`, payload);
  }
  
  changePassword(payload : ChangePasswordModel):Observable<any>{
    return this.commonService.httpPostWithAuth(`${environment.apiURL}/auth/changePassword`, payload)
  }
  isSignedIn(): boolean {
    const userResponse = sessionStorage.getItem('userResponse');
  
    if (!userResponse) {
      return false; // Return false if userResponse doesn't exist
    }
  
    try {
      const decoded = atob(userResponse); // Decode Base64 string
      const userDetails: SignInResponse = JSON.parse(decoded); // Parse JSON
  
      return !!userDetails?.token; // Returns true if token exists
    } catch (error) {
      console.error('Error decoding or parsing userResponse:', error);
      return false; // Handle invalid data gracefully
    }
  }
  
  
  logout(){
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}


