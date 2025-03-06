import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { AuthGuard } from './auth/auth.guard';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { EditIncomeComponent } from './edit-income/edit-income.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';

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
        path : 'reset-password/:token',
        component : ResetPasswordComponent
    },
    {
        path : 'verify-otp',
        component : VerifyOtpComponent
    },
    {
        path : 'dashboard',
        component : DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path : 'income',
        component : IncomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path : 'expense',
        component : ExpenseComponent,
        canActivate: [AuthGuard]
    },
    {
        path : 'change-password',
        component : ChangePasswordComponent,
        canActivate : [AuthGuard]
    },
    {
        path : 'edit-income/:id',
        component : EditIncomeComponent,
        canActivate : [AuthGuard]
    },
    {
        path : 'edit-expense/:id',
        component : EditExpenseComponent,
        canActivate : [AuthGuard]
    }
];
