import { AuthError } from "@supabase/supabase-js";
import Stripe from "stripe";

/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: Record<string, string[]>) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTH_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, "RATE_LIMIT");
  }
}

export class StripeError extends AppError {
  constructor(
    message: string,
    public stripeErrorType?: string,
    statusCode: number = 500
  ) {
    super(message, statusCode, "STRIPE_ERROR");
    this.stripeErrorType = stripeErrorType;
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR");
  }
}

/**
 * Error formatting functions
 */

export function formatAuthError(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password";
      case "Email not confirmed":
        return "Please verify your email before logging in";
      case "User already registered":
        return "An account with this email already exists";
      case "Password should be at least 6 characters":
        return "Password must be at least 6 characters long";
      case "Email rate limit exceeded":
        return "Too many requests. Please try again later";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

export function formatStripeError(error: Stripe.StripeError): {
  message: string;
  statusCode: number;
  type: string;
} {
  const baseMessage = error.message || "Payment processing error";

  switch (error.type) {
    case "StripeCardError":
      return {
        message: `Card error: ${baseMessage}`,
        statusCode: 400,
        type: error.type,
      };

    case "StripeRateLimitError":
      return {
        message: "Too many requests. Please try again shortly.",
        statusCode: 429,
        type: error.type,
      };

    case "StripeInvalidRequestError":
      return {
        message: "Invalid payment request. Please try again or contact support.",
        statusCode: 400,
        type: error.type,
      };

    case "StripeAPIError":
      return {
        message: "Payment service error. Please try again later.",
        statusCode: 502,
        type: error.type,
      };

    case "StripeConnectionError":
      return {
        message: "Unable to connect to payment service. Please check your connection.",
        statusCode: 503,
        type: error.type,
      };

    case "StripeAuthenticationError":
      return {
        message: "Payment authentication error. Please contact support.",
        statusCode: 500,
        type: error.type,
      };

    default:
      return {
        message: baseMessage,
        statusCode: 500,
        type: error.type || "unknown",
      };
  }
}

export function formatDatabaseError(error: any): string {
  // Supabase/PostgreSQL error codes
  const code = error.code || error.error_code;

  switch (code) {
    case "23505": // unique_violation
      return "This record already exists";
    case "23503": // foreign_key_violation
      return "Related record not found";
    case "23502": // not_null_violation
      return "Required field is missing";
    case "42501": // insufficient_privilege
      return "Insufficient permissions";
    case "PGRST116": // Supabase: single row expected
      return "Record not found";
    default:
      return error.message || "Database operation failed";
  }
}

/**
 * Type guards
 */

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

export function isStripeError(error: unknown): error is Stripe.StripeError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    typeof (error as any).type === "string" &&
    (error as any).type.startsWith("Stripe")
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Main error message getter
 */

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }

  if (isAuthError(error)) {
    return formatAuthError(error);
  }

  if (isStripeError(error)) {
    return formatStripeError(error).message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Error details extractor for logging
 */

export interface ErrorDetails {
  message: string;
  statusCode: number;
  code?: string;
  stack?: string;
  type?: string;
  isOperational?: boolean;
  details?: any;
}

export function getErrorDetails(error: unknown): ErrorDetails {
  if (isAppError(error)) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      stack: error.stack,
      isOperational: error.isOperational,
      details: error instanceof ValidationError ? error.details : undefined,
    };
  }

  if (isAuthError(error)) {
    return {
      message: formatAuthError(error),
      statusCode: error.status || 400,
      code: "AUTH_ERROR",
      type: "AuthError",
      isOperational: true,
    };
  }

  if (isStripeError(error)) {
    const formatted = formatStripeError(error);
    return {
      message: formatted.message,
      statusCode: formatted.statusCode,
      code: "STRIPE_ERROR",
      type: formatted.type,
      isOperational: true,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
      stack: error.stack,
      isOperational: false,
    };
  }

  return {
    message: "An unexpected error occurred",
    statusCode: 500,
    isOperational: false,
  };
}

/**
 * Safe error converter - ensures error is always an Error object
 */

export function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error("An unexpected error occurred");
}
