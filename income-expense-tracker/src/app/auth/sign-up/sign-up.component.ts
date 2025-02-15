import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpPayload } from '../../models/sign-up-payload';
import { AuthService } from '../auth.service';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{
  footerText : string = '';
  myForm!: FormGroup;
  isLoading : boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  payload : SignUpPayload = {};
  constructor(private fb : FormBuilder, private router : Router, private authService : AuthService, private toastrService : ToastrService){}

  ngOnInit() {
    this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries. All Rights Reserved.`
    this.buildForm();
  }

  buildForm(){
    this.myForm = this.fb.group({
      fname : ['', Validators.required],
      lname : ['', Validators.required],
      email : ['',[Validators.required, Validators.email]],
      password : ['',[Validators.required, Validators.minLength(6), this.passwordStrengthValidator]],
      confirmPassword : ['',Validators.required]
    },
  {
    validators :this.passwordMatchValidator as ValidatorFn
  })
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  passwordStrengthValidator(control: any): { [key: string]: boolean } | null {
    const password = control.value;

    // Regex for at least one uppercase letter, one special character, and one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasSpecialCharacter || !hasNumber) {
      return { passwordWeak: true };
    }

    return null;
  }
  navigateToSignIn(){
    this.router.navigate(['/sign-in'])
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  onSave(): void {
    if (this.myForm.valid) {
      this.isLoading = true;

      this.payload = new SignUpPayload();

      this.payload.firstName = this.myForm.get('fname')?.value
      this.payload.lastName = this.myForm.get('lname')?.value
      this.payload.email = this.myForm.get('email')?.value
      this.payload.password = this.myForm.get('confirmPassword')?.value

      this.authService.signUp(this.payload).pipe(first()).subscribe({
        next : (response)=>{
          this.isLoading = false;
          this.myForm.reset();
          this.toastrService.success('Signed Up Successfully, You can Sign in Now', 'User Created');
          this.router.navigate(['/sign-in'])
        },
        error : (error : HttpErrorResponse)=>{
          this.isLoading = false;
          this.toastrService.error(error.error.error, "Error")
          this.myForm.reset();
        }
      })
    }
  }
}