import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
   token : string = "";
   isResponseLoading : boolean = false;
   isInvalidTokenError : boolean = false;
   invalidTokenErrorMessage : string = "";
   constructor(private fb : FormBuilder, private router : Router, private activatedRoute : ActivatedRoute, private authService : AuthService, private toastrService : ToastrService){}

   ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    })
    this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries. All Rights Reserved.`
     this.buildForm();

     if(this.token !== ""){
       this.verifyToken();
     }

   }
   
   verifyToken(){
    this.isResponseLoading = true;

    this.authService.verifyToken(this.token).pipe(first()).subscribe({
      next : (response)=>{
        this.isResponseLoading = false;
        this.isInvalidTokenError = false;
        this.invalidTokenErrorMessage = "";
      },
      error : (error : HttpErrorResponse)=>{
         this.isResponseLoading = false;
         this.isInvalidTokenError = true;
         this.invalidTokenErrorMessage = "Reset Password Link has been expired";
         this.toastrService.error(error.error.error, "Error");
      }
    })
   }

   navigateToSignIn(){
    this.router.navigate(['/sign-in'])
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

      const payload = {
        newPassword : this.myForm.get('confirmPassword')?.value
      }

      this.authService.resetPassword(payload, this.token).pipe(first()).subscribe({
        next : (response)=>{
          this.toastrService.success("Password reset successful. Please Sign In.", "Success");
          this.router.navigate(['/sign-in']);
          this.isLoading = false;
        },
        error : (error:HttpErrorResponse)=>{
          this.toastrService.error(error.error.error, "Error");
          this.isLoading = false;
          this.isInvalidTokenError = true;
         this.invalidTokenErrorMessage = "Reset Password Link has been expired";
        }
      })
    }
  }
}
