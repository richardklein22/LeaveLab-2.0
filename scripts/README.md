# Performance Testing Scripts

This directory contains scripts for testing and monitoring application performance.

---

## 📋 Available Scripts

### 1. API Performance Testing

**File:** `performance-test.ts`

Tests API endpoint performance and generates detailed reports.

**Usage:**
```bash
npx tsx scripts/performance-test.ts
```

**Optional Environment Variables:**
```bash
# Test authenticated endpoints (optional)
export TEST_AUTH_TOKEN="your-jwt-token-here"

# Custom API URL (default: http://localhost:3000)
export NEXT_PUBLIC_API_URL="https://your-app.com"

npx tsx scripts/performance-test.ts
```

**What it tests:**
- `/api/v1/subscriptions/tiers` (public)
- `/api/v1/profile` (authenticated, if token provided)
- `/api/v1/subscriptions/status` (authenticated, if token provided)

**Output:**
```
🚀 Starting Performance Tests

📊 Testing Public Endpoints...
✓ Subscription tiers (150ms) 🟡 acceptable
✓ Subscription tiers (8ms) 🟢 fast (cached)

SUMMARY:
Total Requests: 5
Average Duration: 112.8ms
🟢 Fast: 3
🟡 Acceptable: 2
🏆 OVERALL: EXCELLENT
```

**Performance Ratings:**
- 🟢 Fast: < 200ms
- 🟡 Acceptable: 200-500ms
- 🟠 Slow: 500-1000ms
- 🔴 Error: > 1000ms or failed

---

### 2. Lighthouse Testing

**File:** `lighthouse-test.sh`

Runs Google Lighthouse tests on multiple pages and generates detailed reports.

**Prerequisites:**
```bash
# Install Lighthouse CLI (first time only)
npm install -g lighthouse

# Install jq for JSON parsing (optional, for better output)
brew install jq  # macOS
# or
sudo apt-get install jq  # Linux
```

**Usage:**
```bash
# Test localhost (default)
./scripts/lighthouse-test.sh

# Test custom URL
./scripts/lighthouse-test.sh https://your-app.com

# Test staging
./scripts/lighthouse-test.sh https://staging.your-app.com
```

**What it tests:**
- Home page (/)
- Login page (/login)
- Signup page (/signup)
- Dashboard (/dashboard)
- Pricing page (/pricing)

**Output:**
```
🔦 Lighthouse Performance Testing
==================================

🌐 Target URL: http://localhost:3000
📁 Output Directory: lighthouse-reports

🔍 Testing: http://localhost:3000/
✅ Report saved: lighthouse-reports/home_20231017_143052.html

📊 Performance Summary:
==================================

Page: /
  Performance:    95%
  Accessibility:  98%
  Best Practices: 100%
  SEO:            100%
  
  First Contentful Paint: 0.8s
  Largest Contentful Paint: 1.2s
  Total Blocking Time: 50ms
  Cumulative Layout Shift: 0.02
  Speed Index: 1.8s
```

**Reports Generated:**
- HTML reports in `lighthouse-reports/` directory
- JSON data files for programmatic analysis
- Summary printed to console

---

## 🎯 Performance Targets

### API Performance
- **Fast:** < 200ms (target for most endpoints)
- **Acceptable:** 200-500ms (okay for complex queries)
- **Slow:** > 500ms (needs optimization)

### Lighthouse Scores
- **Performance:** > 90
- **Accessibility:** > 90
- **Best Practices:** > 90
- **SEO:** > 90

### Core Web Vitals
- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Total Blocking Time (TBT):** < 200ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Speed Index (SI):** < 3.4s

---

## 🔧 Troubleshooting

### API Performance Tests

**Issue:** "Connection refused"
```bash
# Make sure dev server is running
npm run dev
```

**Issue:** "Unauthorized" for authenticated endpoints
```bash
# Get an auth token and set it
export TEST_AUTH_TOKEN="your-jwt-token-here"
```

**Issue:** Tests failing
```bash
# Check if API is accessible
curl http://localhost:3000/api/v1/subscriptions/tiers
```

### Lighthouse Tests

**Issue:** "lighthouse: command not found"
```bash
# Install Lighthouse globally
npm install -g lighthouse
```

**Issue:** "Chrome not found"
```bash
# Lighthouse needs Chrome/Chromium installed
# Install Chrome from: https://www.google.com/chrome/
```

**Issue:** Tests running but scores are low
```bash
# Make sure dev server is in production mode
npm run build
npm start

# Then run Lighthouse
./scripts/lighthouse-test.sh http://localhost:3000
```

**Issue:** Permission denied
```bash
# Make script executable
chmod +x scripts/lighthouse-test.sh
```

---

## 📊 Understanding Results

### API Performance

**Fast (🟢):**
- Response time < 200ms
- Server-side caching working
- Database queries optimized
- Good: Keep monitoring

**Acceptable (🟡):**
- Response time 200-500ms
- May improve with caching
- Consider query optimization
- Okay for complex operations

**Slow (🟠):**
- Response time 500-1000ms
- Needs optimization
- Check database queries
- Review caching strategy

**Error (🔴):**
- Response time > 1000ms or failed
- Critical: Fix immediately
- Check server logs
- Review database performance

### Lighthouse Scores

**90-100 (Green):**
- Excellent performance
- Meeting best practices
- Production ready

**50-89 (Orange):**
- Acceptable performance
- Room for improvement
- Review recommendations

**0-49 (Red):**
- Poor performance
- Needs optimization
- Review Lighthouse report details

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Performance Tests

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Start server
        run: npm start &
        
      - name: Wait for server
        run: npx wait-on http://localhost:3000
      
      - name: Run API performance tests
        run: npx tsx scripts/performance-test.ts
      
      - name: Run Lighthouse tests
        run: |
          npm install -g lighthouse
          ./scripts/lighthouse-test.sh http://localhost:3000
      
      - name: Upload Lighthouse reports
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-reports
          path: lighthouse-reports/
```

---

## 📚 Related Documentation

- **Complete Guide:** `PHASE_5_PERFORMANCE_OPTIMIZATION_COMPLETE.md`
- **Quick Reference:** `PERFORMANCE_OPTIMIZATION_QUICK_GUIDE.md`
- **Agent Summary:** `PHASE_5_AGENT_2_SUMMARY.md`

---

## 🔍 Example Test Session

```bash
# 1. Start development server
npm run dev

# 2. In another terminal, run API tests
npx tsx scripts/performance-test.ts

# 3. Run Lighthouse tests
./scripts/lighthouse-test.sh

# 4. Review reports
open lighthouse-reports/home_*.html
```

---

## 💡 Tips

1. **Run tests regularly** - Before each deployment
2. **Compare results** - Track performance over time
3. **Test production builds** - Dev mode is slower
4. **Monitor trends** - Look for performance degradation
5. **Set up alerts** - Fail CI if performance drops
6. **Review recommendations** - Lighthouse provides actionable advice

---

**Need Help?**

- Review full documentation in `/PHASE_5_PERFORMANCE_OPTIMIZATION_COMPLETE.md`
- Check API routes in `/src/app/api/v1/`
- Review performance utilities in `/src/lib/utils/`

---

**Performance Testing Scripts** ⚡

