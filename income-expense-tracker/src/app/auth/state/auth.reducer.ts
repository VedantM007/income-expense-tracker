import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import {
  signInSuccess,
  signInFailure,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout,
} from './auth.actions';

const _authReducer = createReducer(
  initialAuthState,
  on(signInSuccess, (state, action): AuthState => ({
    ...state,
    email: action.email,
    otpStatus: 'pending',
    error: null,
  })),
  on(signInFailure, (state, action): AuthState => ({
    ...state,
    email: null,
    otpStatus: null,
    error: action.error,
  })),
  on(verifyOtpSuccess, (state, action): AuthState => ({
    ...state,
    userId: action.data.userId,
    firstName: action.data.firstName,
    lastName: action.data.lastName,
    email: action.data.email,
    token: action.data.token,
    otpStatus: 'verified',
    error: null,
  })),
  on(verifyOtpFailure, (state, action): AuthState => ({
    ...state,
    otpStatus: 'expired',
    error: action.error,
  })),
  on(logout, (): AuthState => ({
    ...initialAuthState,
  }))
);

export function authReducer(state: any, action: any) {
  return _authReducer(state, action);
}
