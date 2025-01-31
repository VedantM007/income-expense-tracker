import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  constructor(private fb : FormBuilder, private router : Router){}

  ngOnInit() {
    this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries`
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
    }
  }
}
