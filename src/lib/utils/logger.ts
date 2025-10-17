/**
 * Error logging and monitoring utilities
 */

import { getErrorDetails, type ErrorDetails } from "./errors";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

export interface LogContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: ErrorDetails;
}

/**
 * Logger class for structured logging
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatLog(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString(),
    });
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(error && { error: getErrorDetails(error) }),
    };

    // In development, use pretty console logging
    if (this.isDevelopment) {
      this.prettyLog(entry);
    } else {
      // In production, use structured JSON logging
      console.log(this.formatLog(entry));
    }

    // TODO: Send to external monitoring service (e.g., Sentry, LogRocket, etc.)
    // this.sendToMonitoring(entry);
  }

  private prettyLog(entry: LogEntry) {
    const emoji = this.getEmoji(entry.level);
    const levelColor = this.getLevelColor(entry.level);
    
    console.log(`\n${emoji} [${levelColor}${entry.level.toUpperCase()}\x1b[0m] ${entry.message}`);
    
    if (entry.context) {
      console.log("📋 Context:", entry.context);
    }
    
    if (entry.error) {
      console.error("❌ Error Details:", {
        message: entry.error.message,
        code: entry.error.code,
        statusCode: entry.error.statusCode,
        ...(entry.error.stack && { stack: entry.error.stack }),
      });
    }
  }

  private getEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return "🔍";
      case LogLevel.INFO:
        return "ℹ️";
      case LogLevel.WARN:
        return "⚠️";
      case LogLevel.ERROR:
        return "❌";
      case LogLevel.FATAL:
        return "💀";
      default:
        return "📝";
    }
  }

  private getLevelColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return "\x1b[36m"; // Cyan
      case LogLevel.INFO:
        return "\x1b[32m"; // Green
      case LogLevel.WARN:
        return "\x1b[33m"; // Yellow
      case LogLevel.ERROR:
        return "\x1b[31m"; // Red
      case LogLevel.FATAL:
        return "\x1b[35m"; // Magenta
      default:
        return "\x1b[0m"; // Reset
    }
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext, error?: unknown) {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: unknown) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, context?: LogContext, error?: unknown) {
    this.log(LogLevel.FATAL, message, context, error);
  }

  /**
   * Log API request
   */
  logRequest(method: string, endpoint: string, context?: LogContext) {
    this.info(`${method} ${endpoint}`, {
      ...context,
      method,
      endpoint,
    });
  }

  /**
   * Log API response
   */
  logResponse(
    method: string,
    endpoint: string,
    statusCode: number,
    duration?: number,
    context?: LogContext
  ) {
    const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    
    this.log(level, `${method} ${endpoint} - ${statusCode}`, {
      ...context,
      method,
      endpoint,
      statusCode,
      ...(duration && { duration: `${duration}ms` }),
    });
  }

  /**
   * Log authentication event
   */
  logAuth(event: string, userId?: string, context?: LogContext) {
    this.info(`Auth: ${event}`, {
      ...context,
      userId,
      event,
    });
  }

  /**
   * Log payment/subscription event
   */
  logPayment(event: string, userId: string, amount?: number, context?: LogContext) {
    this.info(`Payment: ${event}`, {
      ...context,
      userId,
      event,
      ...(amount && { amount }),
    });
  }

  /**
   * Log database operation
   */
  logDatabase(operation: string, table: string, context?: LogContext, error?: unknown) {
    if (error) {
      this.error(`Database ${operation} failed on ${table}`, context, error);
    } else {
      this.debug(`Database ${operation} on ${table}`, context);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Request context extractor for Next.js API routes
 */
export function extractRequestContext(request: Request): LogContext {
  const url = new URL(request.url);
  
  return {
    endpoint: url.pathname,
    method: request.method,
    ipAddress: request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
    requestId: request.headers.get("x-request-id") || undefined,
  };
}

/**
 * Performance monitor decorator
 */
export function withPerformanceLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  operationName: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();
    
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      
      logger.debug(`${operationName} completed`, { duration: `${duration}ms` });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error(`${operationName} failed`, { duration: `${duration}ms` }, error);
      
      throw error;
    }
  }) as T;
}

/**
 * Error tracking integration (placeholder for future implementation)
 */
export interface ErrorTrackingConfig {
  serviceName: string;
  dsn?: string;
  environment: string;
  release?: string;
}

export function initializeErrorTracking(config: ErrorTrackingConfig) {
  // TODO: Initialize Sentry or similar service
  logger.info("Error tracking initialized", config);
}

export function captureException(error: unknown, context?: LogContext) {
  // TODO: Send to error tracking service
  logger.error("Exception captured", context, error);
}

export function setUserContext(userId: string, email?: string) {
  // TODO: Set user context in error tracking service
  logger.debug("User context set", { userId, email });
}

