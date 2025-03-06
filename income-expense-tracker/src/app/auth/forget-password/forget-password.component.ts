import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {
  footerText : string = '';
  myForm!: FormGroup;
  isLoading : boolean = false; 

  constructor(private fb : FormBuilder,private router : Router, private authService : AuthService, private toastrService : ToastrService){}

  ngOnInit() {
     this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries. All Rights Reserved`
     this.buildForm();
  }
  buildForm(){
    this.myForm = this.fb.group({
      email : ['', [Validators.required, Validators.email]]
    })
  }
  navigateToSignIn(){
    this.router.navigate(['/sign-in'])
  }
  onSave(): void {
    this.isLoading = true;
    if (this.myForm.valid) {
      const payload = {
        email : this.myForm.get('email')?.value
      };

      this.authService.forgotPassword(payload).pipe(first()).subscribe({
        next : (response)=>{
          this.toastrService.success("Reset password email sent", "Success");
          this.myForm.reset();
          this.isLoading = false;
        },
        error :(error : HttpErrorResponse)=>{
          this.toastrService.error(error.error.error, "Error");
          this.myForm.reset();
          this.isLoading = false;
        }
      })
    }
  }
}
