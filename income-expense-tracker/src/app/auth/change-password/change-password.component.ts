import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordModel } from '../../models/change-password-model';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  myForm!: FormGroup;

  isLoading: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  payload: ChangePasswordModel = {};

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.myForm = this.fb.group(
      {
        oldPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128)
          ]
        ],

        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            this.passwordStrengthValidator
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128)
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator as ValidatorFn
      }
    );
  }

  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatchValidator(
    group: FormGroup
  ): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  passwordStrengthValidator(
    control: any
  ): { [key: string]: boolean } | null {
    const password = control.value;

    if (!password) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialCharacter =
      /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasSpecialCharacter || !hasNumber) {
      return { passwordWeak: true };
    }

    return null;
  }

  onSave(): void {
    if (this.myForm.valid) {
      this.isLoading = true;

      this.payload = new ChangePasswordModel();

      this.payload.oldPassword =
        this.myForm.get('oldPassword')?.value;

      this.payload.newPassword =
        this.myForm.get('confirmPassword')?.value;

      this.authService
        .changePassword(this.payload)
        .pipe(first())
        .subscribe({
          next: () => {
            this.isLoading = false;

            this.toastrService.success(
              'Password changed successfully, now please re-sign in with the new Password',
              'Success'
            );

            sessionStorage.clear();

            this.router.navigate(['/sign-in']);
          },

          error: (error: HttpErrorResponse) => {
            this.isLoading = false;

            this.toastrService.error(
              error.error?.error || 'Failed to change password',
              'Error'
            );

            this.myForm.reset();
          }
        });
    }
  }
}