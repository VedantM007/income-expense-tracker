import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TimerService } from '../../services/timer.service';
import { first, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { userEmail } from '../state/auth.selectors';
import { VerifyOtpPayload } from '../../models/verify-otp-payload';
import { verifyOtpStart } from '../state/auth.actions';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { SignInResponse } from '../../models/sign-in-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit, OnDestroy{
  myForm!: FormGroup;
  isLoading : boolean = false;
  footerText : string = '';
  email : string = '';
  remainingTime: number = 0;
  timerInterval: any;
  isDisabled : boolean = false;
  payload : VerifyOtpPayload = {}
  constructor(private fb : FormBuilder,private router : Router, private timerService: TimerService, private toastrService : ToastrService, private authService : AuthService){}

  ngOnInit(): void {
    const encryptedEmail = sessionStorage.getItem('email');
    this.email = atob(encryptedEmail as string);
    this.isDisabled = true;
    this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries. All Rights Reserved.`;
    this.buildForm();
    this.remainingTime = this.timerService.initializeTimer();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerService.clearTimer(); // Remove timer from localStorage
    }
    console.log('Component destroyed, timer cleared');
  } 
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.timerService.saveTime(this.remainingTime);
      } else {
        clearInterval(this.timerInterval);
        this.isDisabled = false;
      }
    }, 1000);
  }

  resetTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    // this.remainingTime = this.timerService.resetToDefault(); // Reset to 10 minutes
    // this.startTimer();
    this.timerService.clearTimer();
  }
  get formattedTime() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  buildForm(){
    this.myForm = this.fb.group({
      otp : ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6),
        Validators.pattern(/^\d+$/)]]
    })
  }
  allowNumbersOnly(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
  }
  
  resendOTP(){
   this.isDisabled = true
   this.resetTimer();
   this.remainingTime = this.timerService.initializeTimer();
   this.startTimer();
    const payload = {
      email : this.email
    }
   this.authService.resendOtp(payload).pipe(first()).subscribe({
    next : (response) => {
     this.toastrService.success("OTP resent successfully to your email.", "Success");
    },
    error : (error : HttpErrorResponse) => {
      this.toastrService.error(error.error.error, "Failed");
    }
   })
  }

  onSave(): void {
    if (this.myForm.valid) {
      this.isLoading = true;
      this.payload = new VerifyOtpPayload();
      this.payload.email = this.email;
      this.payload.otp = this.myForm.get('otp')?.value;

      this.authService.verifyOtp(this.payload).pipe(first()).subscribe({
        next : (response : SignInResponse) => {
          this.isLoading = false;
          sessionStorage.removeItem('email');
          sessionStorage.setItem('userResponse', btoa(JSON.stringify(response)));
          this.toastrService.success("OTP verified", "Success");
          this.router.navigate(['/dashboard']);
        },
        error : (error : HttpErrorResponse) => {
          this.isLoading = false;
          this.toastrService.error(error.error.error, "Failed");
        }
      })
    }
  }

}
