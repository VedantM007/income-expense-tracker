import { createAction, props } from '@ngrx/store';
import { SignInPayload } from '../../models/sign-in-payload';
import { SignInResponse } from '../../models/sign-in-response';
import { VerifyOtpPayload } from '../../models/verify-otp-payload';

// Sign-in actions
export const signInStart = createAction(
    '[Auth] Sign-In Start',
    props<SignInPayload>()
  );
  
  export const signInSuccess = createAction(
    '[Auth] Sign-In Success',
    props<{ email: string }>()
  );
  
  export const signInFailure = createAction(
    '[Auth] Sign-In Failure',
    props<{ error: string }>()
  );
  
  // Verify OTP actions
  export const verifyOtpStart = createAction(
    '[Auth] Verify OTP Start',
    props<VerifyOtpPayload>()
  );
  
  export const verifyOtpSuccess = createAction(
    '[Auth] Verify OTP Success',
    props<SignInResponse>()
  );
  
  export const verifyOtpFailure = createAction(
    '[Auth] Verify OTP Failure',
    props<{ error: string }>()
  );
  
  export const logout = createAction('[Auth] Logout');
