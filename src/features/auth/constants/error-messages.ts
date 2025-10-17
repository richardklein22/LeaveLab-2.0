// British English error messages for authentication
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_NOT_VERIFIED: "Please verify your email before logging in",
  EMAIL_EXISTS: "An account with this email already exists",
  WEAK_PASSWORD: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_MISMATCH: "Passwords must match",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",
  TOKEN_EXPIRED: "This link has expired. Please request a new one",
  TOKEN_INVALID: "This link is no longer valid",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again",
} as const;

export const AUTH_SUCCESS = {
  SIGNUP_SUCCESS: "Account created. Please check your email to verify your address.",
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "Logged out successfully",
  PASSWORD_RESET_REQUESTED: "If an account exists with this email, you will receive reset instructions",
  PASSWORD_RESET_SUCCESS: "Password successfully reset",
  PASSWORD_CHANGED: "Password changed successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  EMAIL_VERIFIED: "Email verified successfully",
  OAUTH_LINKED: "Google account linked successfully",
} as const;
