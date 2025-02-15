import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInPayload } from '../../models/sign-in-payload';
import { SignUpPayload } from '../../models/sign-up-payload';
import { signInStart } from '../state/auth.actions';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  myForm!: FormGroup;
  isLoading : boolean = false;
  showPassword: boolean = false;
  footerText : string = '';
  payload : SignInPayload = {};
  
  constructor(private fb : FormBuilder,private router : Router, private toastrService : ToastrService,  private authService : AuthService){}

  ngOnInit() {
    this.buildForm();
    this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries. All Rights Reserved.`

    // const data = {
    //   firstName : 'Vedant',
    //   lastName : 'Mandwe',
    //   email : 'vedantmandwe5@gmail.com'
    // }
    // console.log("Encrypted Value ::::",);
    
    //  console.log("Decrypted Value:::", JSON.parse(atob('eyJmaXJzdE5hbWUiOiJWZWRhbnQiLCJsYXN0TmFtZSI6Ik1hbmR3ZSIsImVtYWlsIjoidmVkYW50bWFuZHdlNUBnbWFpbC5jb20ifQ==')))
  }

  buildForm(){
    this.myForm = this.fb.group({
      email : ['', [Validators.required, Validators.email]],
      password : ['', Validators.required]
    })
  }

  navigateToSignUp(){
    this.router.navigate(['/sign-up'])
  }
  navigateToForgetPassword(){
    this.router.navigate(['/forget-password'])
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
      
  onSave(): void {
    if (this.myForm.valid) {
      this.isLoading = true;
      this.payload = new SignUpPayload();

      this.payload.email = this.myForm.get('email')?.value;
      this.payload.password = this.myForm.get('password')?.value;
      
      this.authService.signIn(this.payload).pipe(first()).subscribe({
        next : (response)=>{
           sessionStorage.setItem('email', btoa(this.payload.email as string))
           this.toastrService.success("OTP sent to email. Please verify to complete sign-in.", "Success");
           this.router.navigate(['/verify-otp']);
           this.isLoading = false;
        },
        error : (error : HttpErrorResponse) => {
          this.isLoading = false;
          this.toastrService.error(error.error.error, "Unauthorized");
          this.myForm.reset()
        }
      })
    }
  }

}
