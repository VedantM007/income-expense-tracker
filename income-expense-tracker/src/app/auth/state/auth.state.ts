export interface AuthState {
    email: string | null;
    otpStatus: 'pending' | 'verified' | 'expired' | null;
    userId: string | null;
    firstName: string | null;
    lastName: string | null;
    token: string | null;
    error: string | null;
  }
  
  export const initialAuthState: AuthState = {
    email: null,
    otpStatus: null,
    userId: null,
    firstName: null,
    lastName: null,
    token: null,
    error: null,
  };
  