import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  myForm!: FormGroup;
  isLoading : boolean = false;
  showPassword: boolean = false;
  footerText : string = '';
  constructor(private fb : FormBuilder,private router : Router){}

  ngOnInit() {
    this.buildForm();
    this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries. All Rights Reserved.`

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
      this.router.navigate(['/verify-otp'])
    }
  }
}
