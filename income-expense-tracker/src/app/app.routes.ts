import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in', // Redirect to 'sign-in' by default
        pathMatch: 'full', // Ensures it matches the full path
      },
    {
        path : 'sign-in',
        component : SignInComponent
    },
    {
        path : 'sign-up',
        component : SignUpComponent
    },
    {
        path : 'forget-password',
        component : ForgetPasswordComponent
    },
    {
        path : 'reset-password',
        component : ResetPasswordComponent
    },
    {
        path : 'verify-otp',
        component : VerifyOtpComponent
    },
    {
        path : 'dashboard',
        component : DashboardComponent
    },
    {
        path : 'income',
        component : IncomeComponent
    },
    {
        path : 'expense',
        component : ExpenseComponent
    },
];
