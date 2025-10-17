import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getErrorDetails,
  isStripeError,
  formatStripeError,
  isAuthError,
  formatAuthError,
  isAppError,
  formatDatabaseError,
} from "./errors";

/**
 * Success response wrapper
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Error response wrapper - simple version
 */
export function errorResponse(message: string, status: number = 400, code?: string) {
  return NextResponse.json(
    {
      error: {
        message,
        ...(code && { code }),
      },
    },
    { status }
  );
}

/**
 * Validation error response from Zod
 */
export function validationErrorResponse(zodError: ZodError) {
  const errors: Record<string, string[]> = {};
  
  zodError.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  return NextResponse.json(
    {
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: errors,
      },
    },
    { status: 400 }
  );
}

/**
 * Enhanced error response - automatically formats based on error type
 */
export function handleErrorResponse(error: unknown): NextResponse {
  const details = getErrorDetails(error);
  
  // Log non-operational errors (unexpected errors)
  if (!details.isOperational) {
    console.error("❌ Unexpected error:", {
      message: details.message,
      code: details.code,
      stack: details.stack,
    });
  }

  return NextResponse.json(
    {
      error: {
        message: details.message,
        ...(details.code && { code: details.code }),
        ...(details.type && { type: details.type }),
        ...(details.details && { details: details.details }),
      },
    },
    { status: details.statusCode }
  );
}

/**
 * Stripe-specific error response
 */
export function handleStripeErrorResponse(error: unknown): NextResponse {
  if (isStripeError(error)) {
    const formatted = formatStripeError(error);
    
    console.error("💳 Stripe error:", {
      type: formatted.type,
      message: formatted.message,
    });

    return NextResponse.json(
      {
        error: {
          message: formatted.message,
          code: "STRIPE_ERROR",
          type: formatted.type,
        },
      },
      { status: formatted.statusCode }
    );
  }

  return handleErrorResponse(error);
}

/**
 * Database-specific error response
 */
export function handleDatabaseErrorResponse(error: unknown): NextResponse {
  const message = formatDatabaseError(error);
  
  console.error("🗄️ Database error:", {
    message,
    original: error instanceof Error ? error.message : String(error),
  });

  return NextResponse.json(
    {
      error: {
        message,
        code: "DATABASE_ERROR",
      },
    },
    { status: 500 }
  );
}

/**
 * Auth-specific error response
 */
export function handleAuthErrorResponse(error: unknown): NextResponse {
  if (isAuthError(error)) {
    const message = formatAuthError(error);
    
    return NextResponse.json(
      {
        error: {
          message,
          code: "AUTH_ERROR",
        },
      },
      { status: error.status || 400 }
    );
  }

  return handleErrorResponse(error);
}
