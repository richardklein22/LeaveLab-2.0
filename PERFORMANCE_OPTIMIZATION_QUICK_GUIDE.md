# Performance Optimization Quick Guide 🚀

A quick reference for maintaining optimal performance in the LeaveLab application.

---

## 🎯 Quick Wins

### 1. Use Caching Utilities

```typescript
import { createCachedResponse, serverCache, cacheKeys, CACHE_DURATION } from '@/lib/utils/cache';

// Check cache first
const cacheKey = cacheKeys.userProfile(userId);
const cached = serverCache.get(cacheKey);

if (cached) {
  return createCachedResponse(cached, {
    cacheType: 'user-profile',
    status: 200,
  });
}

// Fetch data...
const data = await fetchData();

// Cache it
serverCache.set(cacheKey, data, CACHE_DURATION.USER_PROFILE);

return createCachedResponse(data, {
  cacheType: 'user-profile',
  status: 200,
});
```

### 2. Optimize Database Queries

```typescript
import { OptimizedQueries } from '@/lib/utils/query-optimizer';

// ❌ Bad
const { data: subscription } = await supabase
  .from('user_subscriptions')
  .select('*')
  .eq('user_id', userId);

const { data: tier } = await supabase
  .from('subscription_tiers')
  .select('*')
  .eq('id', subscription.tier_id);

// ✅ Good - Use optimized query
const { data, error } = await OptimizedQueries.getUserSubscription(
  supabase,
  userId
);
```

### 3. Measure Performance

```typescript
import { PerformanceTimer, createPerformanceMetrics } from '@/lib/utils/performance';

const timer = new PerformanceTimer();

// Do work...
await doWork();

const metrics = createPerformanceMetrics('operation_name', timer.elapsed(), 'api');

if (metrics.rating === 'slow') {
  console.warn('[Performance] Slow operation detected:', metrics);
}
```

---

## 📋 Checklists

### ✅ Before Writing a New API Route

- [ ] Plan caching strategy (public, private, or no-cache?)
- [ ] Identify cache duration (1 hour, 5 minutes, etc.)
- [ ] Plan query optimization (which columns needed?)
- [ ] Use optimized query patterns from `query-optimizer.ts`
- [ ] Add performance timing
- [ ] Implement cache invalidation logic
- [ ] Add appropriate response headers

### ✅ Before Writing a Database Query

- [ ] Select only needed columns (not SELECT *)
- [ ] Use indexed columns in WHERE clauses
- [ ] Use inner joins for related data
- [ ] Add .single() for single results
- [ ] Add .limit() for list queries
- [ ] Check if indexes exist for filters
- [ ] Avoid N+1 query patterns

### ✅ Before Deploying

- [ ] Run performance tests: `npx tsx scripts/performance-test.ts`
- [ ] Run Lighthouse tests: `./scripts/lighthouse-test.sh`
- [ ] Review slow query logs
- [ ] Check cache hit rates
- [ ] Verify indexes are used (not seq scans)
- [ ] Test cache invalidation
- [ ] Check response headers

---

## 🔥 Common Patterns

### Pattern 1: Cached API Endpoint

```typescript
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return errorResponse('Unauthorized', 401);

  // Check cache
  const cacheKey = cacheKeys.userProfile(user.id);
  const cached = serverCache.get(cacheKey);
  
  if (cached) {
    return createCachedResponse(cached, {
      cacheType: 'user-profile',
      status: 200,
    });
  }

  // Fetch from DB (optimized query)
  const { data } = await OptimizedQueries.getUserProfile(supabase, user.id);

  // Cache it
  serverCache.set(cacheKey, data, CACHE_DURATION.USER_PROFILE);

  return createCachedResponse(data, {
    cacheType: 'user-profile',
    status: 200,
  });
}
```

### Pattern 2: Optimized Query with Join

```typescript
const { data } = await supabase
  .from('user_subscriptions')
  .select(`
    id,
    status,
    billing_cycle,
    tier:subscription_tiers!inner(
      name,
      display_name,
      price_monthly_pence
    )
  `)
  .eq('user_id', userId)
  .eq('status', 'active')
  .single();
```

### Pattern 3: Performance Monitoring

```typescript
const timer = new PerformanceTimer();

timer.mark('db_start');
const data = await fetchFromDatabase();
timer.mark('db_end');

timer.mark('process_start');
const processed = processData(data);
timer.mark('process_end');

console.log('[Performance]', {
  dbTime: timer.measure('db_start', 'db_end'),
  processTime: timer.measure('process_start', 'process_end'),
  totalTime: timer.elapsed(),
});
```

### Pattern 4: Cache Invalidation

```typescript
export async function PATCH(request: NextRequest) {
  // ... update logic
  
  const { data: updated } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  // Invalidate cache
  const cacheKey = cacheKeys.userProfile(user.id);
  serverCache.delete(cacheKey);

  return successResponse(updated, 200);
}
```

---

## 🎯 Performance Targets

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| API Response Time | < 500ms | Use caching + optimized queries |
| Cached Response Time | < 50ms | Use server-side cache |
| Database Query Time | < 200ms | Use indexes + specific columns |
| Cache Hit Rate | > 60% | Appropriate cache durations |
| Lighthouse Performance | > 90 | Optimize assets + API responses |

---

## 🛠️ Testing Commands

```bash
# Test API performance
npx tsx scripts/performance-test.ts

# Test with Lighthouse
./scripts/lighthouse-test.sh http://localhost:3000

# Check database indexes
psql -c "SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public' ORDER BY idx_scan ASC;"

# Monitor cache performance
# (Check application logs for cache hit/miss rates)
```

---

## 📊 Cache Durations Reference

```typescript
CACHE_DURATION = {
  // Static content
  STATIC_LONG: 31536000,    // 1 year
  STATIC_MEDIUM: 604800,     // 1 week
  STATIC_SHORT: 86400,       // 1 day
  
  // Dynamic content
  DYNAMIC_LONG: 3600,        // 1 hour
  DYNAMIC_MEDIUM: 900,       // 15 minutes
  DYNAMIC_SHORT: 300,        // 5 minutes
  
  // User-specific
  USER_PROFILE: 900,         // 15 minutes
  USER_DATA: 300,            // 5 minutes
  
  // Subscription data
  SUBSCRIPTION_STATUS: 300,  // 5 minutes
  SUBSCRIPTION_TIERS: 3600,  // 1 hour
  
  // No cache
  NO_CACHE: 0,
}
```

**Guidelines:**
- Subscription tiers: Long cache (1 hour) - rarely changes
- User profile: Medium cache (15 min) - changes occasionally
- Subscription status: Short cache (5 min) - can change
- Auth tokens: No cache - sensitive data

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't Do This

```typescript
// 1. SELECT * (fetches unnecessary data)
.select('*')

// 2. Multiple queries (N+1 problem)
for (const user of users) {
  await supabase.from('profiles').select('*').eq('user_id', user.id);
}

// 3. No pagination
.select('*')  // Could return thousands of rows

// 4. Non-indexed filters
.eq('some_random_field', value)  // No index exists

// 5. No cache invalidation
await updateProfile(userId, data);
// Cache still has old data!
```

### ✅ Do This Instead

```typescript
// 1. Specific columns
.select('id, name, email')

// 2. Use joins
.select('*, profile:profiles!inner(*)')

// 3. Add pagination
.range(0, 19)

// 4. Use indexed columns
.eq('user_id', userId)  // Has index

// 5. Invalidate cache
await updateProfile(userId, data);
serverCache.delete(cacheKeys.userProfile(userId));
```

---

## 📝 Quick Reference: Indexed Columns

**Always filter by these when possible:**

### `profiles` table
- `id` (primary key)
- `deleted_at` (partial index)
- `membership_tier`

### `user_subscriptions` table
- `user_id` (index)
- `status` (index)
- `tier_id` (index)
- `stripe_customer_id` (index)
- `stripe_subscription_id` (index)

### `subscription_tiers` table
- `id` (primary key)
- `name` (index)
- `is_active` (index)
- `sort_order` (index)

### `auth_logs` table
- `user_id` (index)
- `event` (index)
- `created_at` (index)

### `subscription_events` table
- `user_id` (index)
- `event_type` (index)
- `processed` (index)
- `stripe_event_id` (index)

---

## 🔍 Debugging Slow Queries

```typescript
// 1. Add timing
const start = Date.now();
const { data } = await supabase.from('table').select('*').eq('field', value);
console.log('[Query Time]', Date.now() - start, 'ms');

// 2. Check if using index
// Look for index scans in query plan, not sequential scans

// 3. Reduce columns
// Select only what you need

// 4. Check filters
// Are you filtering on indexed columns?

// 5. Use EXPLAIN ANALYZE
const explainQuery = QueryAnalyzer.generateExplainQuery('table_name', { user_id: 'xxx' });
// Run in database to see query plan
```

---

## 📚 Resources

- **Full Documentation:** `PHASE_5_PERFORMANCE_OPTIMIZATION_COMPLETE.md`
- **Cache Utilities:** `src/lib/utils/cache.ts`
- **Performance Tools:** `src/lib/utils/performance.ts`
- **Query Optimizer:** `src/lib/utils/query-optimizer.ts`
- **Performance Tests:** `scripts/performance-test.ts`
- **Lighthouse Tests:** `scripts/lighthouse-test.sh`
- **Database Migration:** `supabase/migrations/20251017200001_add_performance_indexes.sql`

---

## 💡 Pro Tips

1. **Cache Early, Cache Often** - But invalidate correctly
2. **Measure Everything** - You can't improve what you don't measure
3. **Use Indexes** - They're free performance wins
4. **Select Specific Columns** - Network transfer matters
5. **Monitor Production** - Use APM tools in production
6. **Test Regularly** - Run performance tests before each deployment
7. **Review Slow Queries** - Check logs weekly for slow queries

---

**Need Help?**
- Review the full documentation in `PHASE_5_PERFORMANCE_OPTIMIZATION_COMPLETE.md`
- Check utility functions in `src/lib/utils/`
- Run tests with `npx tsx scripts/performance-test.ts`

---

**Performance Optimization - Quick Reference** ⚡

