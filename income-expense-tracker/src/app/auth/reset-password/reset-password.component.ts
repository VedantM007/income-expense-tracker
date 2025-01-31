import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

   myForm!:FormGroup
   isLoading : boolean = false;
   footerText : string = '';
   showPassword: boolean = false;
   showConfirmPassword: boolean = false;

   constructor(private fb : FormBuilder, private router : Router){}

   ngOnInit() {
    this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries`
     this.buildForm();
   }

   buildForm(){
    this.myForm = this.fb.group({
      newPassword : ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword : ['', Validators.required]
    },
    {
      validators : this.passwordMatchValidator as ValidatorFn
    }
  )
   }

   passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  passwordStrengthValidator(control: any): { [key: string]: boolean } | null {
    const newPassword = control.value;

    // Regex for at least one uppercase letter, one special character, and one number
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    if (!hasUpperCase || !hasSpecialCharacter || !hasNumber) {
      return { passwordWeak: true };
    }

    return null;
  }

  togglePasswordVisibility() : void{
    this.showPassword = !this.showPassword
  }
  toggleConfirmPasswordVisibility() : void{
    this.showConfirmPassword = !this.showConfirmPassword
  }

  onSave(): void {
    if (this.myForm.valid) {
      this.isLoading = true;
    }
  }
}
