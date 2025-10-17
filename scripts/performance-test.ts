#!/usr/bin/env tsx

/**
 * Performance Testing Script
 * 
 * Tests API endpoints and measures performance metrics
 * Run: npx tsx scripts/performance-test.ts
 */

interface PerformanceResult {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  rating: 'fast' | 'acceptable' | 'slow' | 'error';
  cacheHit?: boolean;
}

const THRESHOLDS = {
  fast: 200,
  acceptable: 500,
  slow: 1000,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Test an API endpoint
 */
async function testEndpoint(
  endpoint: string,
  method: string = 'GET',
  headers?: Record<string, string>,
  body?: any
): Promise<PerformanceResult> {
  const url = `${API_BASE_URL}${endpoint}`;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const duration = Date.now() - startTime;
    const cacheControl = response.headers.get('cache-control');
    const cacheHit = response.headers.get('x-cache') === 'HIT';

    let rating: 'fast' | 'acceptable' | 'slow' | 'error';
    if (duration < THRESHOLDS.fast) {
      rating = 'fast';
    } else if (duration < THRESHOLDS.acceptable) {
      rating = 'acceptable';
    } else if (duration < THRESHOLDS.slow) {
      rating = 'slow';
    } else {
      rating = 'error';
    }

    return {
      endpoint,
      method,
      duration,
      status: response.status,
      rating,
      cacheHit,
    };
  } catch (error) {
    return {
      endpoint,
      method,
      duration: Date.now() - startTime,
      status: 0,
      rating: 'error',
    };
  }
}

/**
 * Run performance tests
 */
async function runPerformanceTests(): Promise<void> {
  console.log('🚀 Starting Performance Tests\n');
  console.log(`Testing: ${API_BASE_URL}\n`);

  const results: PerformanceResult[] = [];

  // Test public endpoints
  console.log('📊 Testing Public Endpoints...');
  
  results.push(await testEndpoint('/api/v1/subscriptions/tiers'));
  console.log('✓ Subscription tiers');

  // Test again for cache hit
  results.push(await testEndpoint('/api/v1/subscriptions/tiers'));
  console.log('✓ Subscription tiers (cached)');

  // Test authenticated endpoints (if token available)
  const authToken = process.env.TEST_AUTH_TOKEN;
  if (authToken) {
    console.log('\n📊 Testing Authenticated Endpoints...');
    
    const authHeaders = {
      'Authorization': `Bearer ${authToken}`,
    };

    results.push(await testEndpoint('/api/v1/profile', 'GET', authHeaders));
    console.log('✓ User profile');

    results.push(await testEndpoint('/api/v1/subscriptions/status', 'GET', authHeaders));
    console.log('✓ Subscription status');

    // Test cache
    results.push(await testEndpoint('/api/v1/profile', 'GET', authHeaders));
    console.log('✓ User profile (cached)');
  } else {
    console.log('\n⚠️  Skipping authenticated tests (no TEST_AUTH_TOKEN)');
  }

  // Print results
  console.log('\n' + '='.repeat(80));
  console.log('PERFORMANCE TEST RESULTS');
  console.log('='.repeat(80) + '\n');

  console.log('Endpoint'.padEnd(40) + 'Time'.padEnd(10) + 'Status'.padEnd(10) + 'Rating');
  console.log('-'.repeat(80));

  results.forEach(result => {
    const emoji = {
      fast: '🟢',
      acceptable: '🟡',
      slow: '🟠',
      error: '🔴',
    }[result.rating];

    const cacheInfo = result.cacheHit ? ' (cached)' : '';
    
    console.log(
      result.endpoint.padEnd(40) +
      `${result.duration}ms`.padEnd(10) +
      result.status.toString().padEnd(10) +
      `${emoji} ${result.rating}${cacheInfo}`
    );
  });

  // Summary statistics
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const avgDuration = totalDuration / results.length;
  const fastCount = results.filter(r => r.rating === 'fast').length;
  const acceptableCount = results.filter(r => r.rating === 'acceptable').length;
  const slowCount = results.filter(r => r.rating === 'slow').length;
  const errorCount = results.filter(r => r.rating === 'error').length;

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80) + '\n');

  console.log(`Total Requests: ${results.length}`);
  console.log(`Average Duration: ${avgDuration.toFixed(2)}ms`);
  console.log(`🟢 Fast: ${fastCount} (<${THRESHOLDS.fast}ms)`);
  console.log(`🟡 Acceptable: ${acceptableCount} (${THRESHOLDS.fast}-${THRESHOLDS.acceptable}ms)`);
  console.log(`🟠 Slow: ${slowCount} (${THRESHOLDS.acceptable}-${THRESHOLDS.slow}ms)`);
  console.log(`🔴 Error: ${errorCount} (>${THRESHOLDS.slow}ms or failed)`);

  // Overall rating
  console.log('\n' + '='.repeat(80));
  const overallScore = (fastCount * 100 + acceptableCount * 70 + slowCount * 40) / results.length;
  
  if (overallScore >= 90) {
    console.log('🏆 OVERALL: EXCELLENT');
  } else if (overallScore >= 70) {
    console.log('✅ OVERALL: GOOD');
  } else if (overallScore >= 50) {
    console.log('⚠️  OVERALL: NEEDS IMPROVEMENT');
  } else {
    console.log('❌ OVERALL: POOR - OPTIMIZATION REQUIRED');
  }
  
  console.log('='.repeat(80) + '\n');
}

// Run tests
runPerformanceTests().catch(console.error);

