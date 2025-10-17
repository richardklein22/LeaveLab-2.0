/**
 * Performance Utilities
 * 
 * Tools for measuring and optimizing application performance
 */

/**
 * Simple performance timer
 */
export class PerformanceTimer {
  private startTime: number;
  private marks: Map<string, number> = new Map();

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Mark a point in time
   */
  mark(label: string): void {
    this.marks.set(label, Date.now());
  }

  /**
   * Get elapsed time since start
   */
  elapsed(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Get time between two marks
   */
  measure(startMark: string, endMark: string): number {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (!start || !end) {
      return 0;
    }

    return end - start;
  }

  /**
   * Get all measurements
   */
  getMeasurements(): Record<string, number> {
    const measurements: Record<string, number> = {};
    const marks = Array.from(this.marks.entries());

    for (let i = 0; i < marks.length; i++) {
      const [label, time] = marks[i];
      measurements[label] = time - this.startTime;
    }

    return measurements;
  }
}

/**
 * Log performance metrics
 */
export function logPerformance(
  operation: string,
  duration: number,
  metadata?: Record<string, any>
): void {
  const level = duration > 1000 ? 'warn' : 'info';
  
  console[level]('[Performance]', {
    operation,
    duration: `${duration}ms`,
    ...metadata,
  });
}

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    const duration = Date.now() - start;
    logPerformance(label, duration);
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Batch async operations
 */
export async function batchAsync<T, R>(
  items: T[],
  batchSize: number,
  operation: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await operation(batch);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * backoffMultiplier, maxDelay);
      }
    }
  }

  throw lastError!;
}

/**
 * Query optimization hints
 */
export const QUERY_HINTS = {
  /**
   * Select only needed columns instead of SELECT *
   */
  selectSpecific: (columns: string[]) => columns.join(', '),

  /**
   * Use indexed columns in WHERE clauses
   */
  useIndexedColumns: true,

  /**
   * Limit results for pagination
   */
  usePagination: (page: number, pageSize: number) => ({
    offset: (page - 1) * pageSize,
    limit: pageSize,
  }),

  /**
   * Use prepared statements when possible
   */
  usePreparedStatements: true,
} as const;

/**
 * Database connection pool settings
 */
export const DB_POOL_CONFIG = {
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
} as const;

/**
 * API Response optimization
 */
export class ResponseOptimizer {
  /**
   * Compress large JSON responses
   */
  static shouldCompress(data: any): boolean {
    const jsonString = JSON.stringify(data);
    return jsonString.length > 1024; // 1KB threshold
  }

  /**
   * Paginate large arrays
   */
  static paginate<T>(
    items: T[],
    page: number,
    pageSize: number
  ): {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      items: items.slice(start, end),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Remove null/undefined values to reduce payload size
   */
  static compact(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.compact(item)).filter(item => item !== undefined);
    }

    if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = this.compact(value);
        }
        return acc;
      }, {} as any);
    }

    return obj;
  }
}

/**
 * Performance monitoring configuration
 */
export const PERFORMANCE_THRESHOLDS = {
  api: {
    fast: 100,      // < 100ms is fast
    acceptable: 500, // < 500ms is acceptable
    slow: 1000,     // > 1000ms is slow
  },
  database: {
    fast: 50,       // < 50ms is fast
    acceptable: 200, // < 200ms is acceptable
    slow: 500,      // > 500ms is slow
  },
  page: {
    fast: 1000,     // < 1s is fast
    acceptable: 3000, // < 3s is acceptable
    slow: 5000,     // > 5s is slow
  },
} as const;

/**
 * Create performance report
 */
export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: string;
  metadata?: Record<string, any>;
  rating: 'fast' | 'acceptable' | 'slow';
}

export function createPerformanceMetrics(
  operation: string,
  duration: number,
  type: 'api' | 'database' | 'page',
  metadata?: Record<string, any>
): PerformanceMetrics {
  const thresholds = PERFORMANCE_THRESHOLDS[type];
  let rating: 'fast' | 'acceptable' | 'slow';

  if (duration < thresholds.fast) {
    rating = 'fast';
  } else if (duration < thresholds.acceptable) {
    rating = 'acceptable';
  } else {
    rating = 'slow';
  }

  return {
    operation,
    duration,
    timestamp: new Date().toISOString(),
    metadata,
    rating,
  };
}

