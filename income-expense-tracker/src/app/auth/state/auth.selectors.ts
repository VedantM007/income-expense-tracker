import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectOtpStatus = createSelector(
  selectAuthState,
  (state) => state.otpStatus
);

export const selectUserDetails = createSelector(
  selectAuthState,
  (state) => ({
    userId: state.userId,
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    token : state.token
  })
);

export const userEmail = createSelector(
selectAuthState,
(state) => ({
  email : state.email
})
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
