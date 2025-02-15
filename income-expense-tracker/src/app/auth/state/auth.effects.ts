import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../auth.service';
import {
  signInStart,
  signInSuccess,
  signInFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout
} from './auth.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {
  }

   signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInStart),
      mergeMap((action) =>
        this.authService.signIn(action).pipe(
          map(() => signInSuccess({ email: action.email as string })),
          catchError((error) =>
            of(signInFailure({ error: error.error || 'Sign-In Failed' }))
          )
        )
      )
    )
  );

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(verifyOtpStart),
      mergeMap((action) =>
        this.authService.verifyOtp(action).pipe(
          map((response) =>
            verifyOtpSuccess({
              userId: response.userId,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              token: response.token,
            })
          ),
          catchError((error) =>
            of(verifyOtpFailure({ error: error.error || 'OTP Verification Failed' }))
          )
        )
      )
    )
  );

  logout$ = createEffect(()=> this.actions$.pipe(ofType(logout)))
}
