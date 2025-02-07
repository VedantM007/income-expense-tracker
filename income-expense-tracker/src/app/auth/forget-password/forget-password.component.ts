import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private fb : FormBuilder,private router : Router){}

  ngOnInit() {
     this.footerText = `@Copyright ${new Date().getFullYear()}, Wayne Industries. All Rights Reserved.`
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
    if (this.myForm.valid) {
    }
  }
}
