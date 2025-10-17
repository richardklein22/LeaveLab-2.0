# LeaveLab Deployment Guide 🚀

**Version**: 1.0  
**Last Updated**: October 2025

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [Deployment Checklist](#deployment-checklist)
- [Vercel Deployment](#vercel-deployment)
- [Supabase Setup](#supabase-setup)
- [Stripe Configuration](#stripe-configuration)
- [n8n Webhooks](#n8n-webhooks)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Post-Deployment](#post-deployment)
- [Monitoring & Logging](#monitoring--logging)
- [CI/CD Pipeline](#cicd-pipeline)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying LeaveLab to production. We use:

- **Vercel**: Frontend & API hosting
- **Supabase**: Database, authentication, and storage
- **Stripe**: Payment processing
- **n8n**: Workflow automation (pre-deployed)

### Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              Cloudflare DNS                  │
│         leavelab.com → Vercel               │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           Vercel (Edge Network)              │
│  ┌─────────────────────────────────────┐    │
│  │  Next.js App                         │    │
│  │  - Server Components                 │    │
│  │  - API Routes                        │    │
│  │  - Middleware                        │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
        │                │               │
        ▼                ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │   Stripe     │  │     n8n      │
│  - Auth      │  │  - Checkout  │  │  - Workflows │
│  - Database  │  │  - Webhooks  │  │  - Emails    │
│  - Storage   │  │  - Portal    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Prerequisites

Before deploying, ensure you have:

### Accounts

- [x] Vercel account (free tier works)
- [x] Supabase account (free tier works)
- [x] Stripe account (test mode → production)
- [x] n8n instance (already deployed)
- [x] Domain name (optional but recommended)

### Local Setup

- [x] Git repository
- [x] All code committed
- [x] Tests passing locally
- [x] `.env.local` configured
- [x] Local Supabase running

### Tools

```bash
# Vercel CLI
npm install -g vercel

# Supabase CLI
brew install supabase/tap/supabase

# Stripe CLI (for testing)
brew install stripe/stripe-cli/stripe
```

---

## Architecture

### Deployment Stack

| Component | Service | Purpose |
|-----------|---------|---------|
| **Frontend** | Vercel | Next.js app hosting |
| **API** | Vercel | Next.js API routes |
| **Database** | Supabase | PostgreSQL + RLS |
| **Auth** | Supabase Auth | User authentication |
| **Storage** | Supabase Storage | File uploads |
| **Payments** | Stripe | Payment processing |
| **Automation** | n8n | Email workflows |
| **DNS** | Cloudflare/Vercel | Domain management |

### Regions

- **Vercel**: Edge network (global)
- **Supabase**: Choose closest to users (e.g., `eu-west-1`)
- **Stripe**: Automatic (global)

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Stripe products created
- [ ] OAuth redirect URIs configured
- [ ] Domain purchased (if using custom domain)

### Deployment

- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Domain configured
- [ ] Stripe webhook configured
- [ ] OAuth configured for production URLs

### Post-Deployment

- [ ] Test signup/login
- [ ] Test subscription flow
- [ ] Test webhooks
- [ ] Verify emails sent
- [ ] Check error tracking
- [ ] Monitor logs
- [ ] Test on mobile

---

## Vercel Deployment

### Step 1: Create Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel
```

Or use the Vercel Dashboard:

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 2: Configure Build Settings

In Vercel Dashboard → Settings → General:

- **Node.js Version**: 18.x
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 3: Set Environment Variables

Go to Settings → Environment Variables and add:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=https://leavelab.com

# n8n
N8N_WEBHOOK_URL=https://nocoded-n8n-u41031.vm.elestio.app/webhook/xxx
```

**Important**: 
- Use "Production" environment for production secrets
- Use "Preview" for staging
- Never use test keys in production

### Step 4: Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

### Step 5: Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your domain: `leavelab.com`
3. Configure DNS (Vercel provides instructions)
4. Wait for SSL certificate (automatic)

**DNS Configuration**:

```
Type  Name  Value
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

---

## Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Configure:
   - **Name**: LeaveLab Production
   - **Database Password**: Strong password (save in password manager)
   - **Region**: eu-west-1 (or closest to users)
   - **Pricing Plan**: Free (can upgrade later)

### Step 2: Get API Keys

Go to Settings → API:

- Copy **Project URL**: `https://your-project.supabase.co`
- Copy **anon/public key**: `eyJxxx...`
- Copy **service_role key**: `eyJxxx...` (keep secret!)

Add these to Vercel environment variables.

### Step 3: Link Local Project to Production

```bash
# Link to production Supabase
supabase link --project-ref your-project-ref

# Get project ref from Settings → General → Reference ID
```

### Step 4: Apply Database Migrations

```bash
# Push all migrations to production
supabase db push

# Verify migrations applied
supabase db diff
```

**Migrations Applied**:
- ✅ Profiles table
- ✅ Auth logs table
- ✅ Subscription tiers table
- ✅ User subscriptions table
- ✅ Subscription events table
- ✅ RLS policies
- ✅ Database functions
- ✅ Triggers

### Step 5: Seed Subscription Tiers

The seed migration should run automatically, but verify:

```sql
-- Check tiers exist
SELECT name, display_name, price_monthly_pence 
FROM subscription_tiers;

-- Should show: free, basic, premium
```

### Step 6: Configure Storage

Go to Storage → Create bucket:

- **Name**: `avatars`
- **Public**: Yes
- **File size limit**: 2MB
- **Allowed MIME types**: `image/jpeg,image/png,image/webp`

### Step 7: Configure Auth

Go to Authentication → Settings:

**Site URL**: `https://leavelab.com`

**Redirect URLs**:
```
https://leavelab.com/auth/callback
https://leavelab.com/dashboard
```

**Email Templates**:
- Customize confirmation email
- Customize reset password email
- Customize magic link email

**Email Provider** (optional):
- Use custom SMTP (SendGrid, Mailgun, etc.)
- Or use Supabase default (limited to 3/hour in free tier)

---

## Stripe Configuration

### Step 1: Activate Production Mode

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Toggle from "Test mode" to "Live mode"
3. Complete account verification (required for live payments)

### Step 2: Create Products & Prices

#### Basic Tier

1. Go to Products → Add product
2. **Name**: Basic
3. **Description**: Start your digital nomad journey
4. **Pricing**:
   - Monthly: £70.00 / month
   - Annual: £672.00 / year
5. Copy **Price IDs**:
   - `price_xxx_basic_monthly`
   - `price_xxx_basic_annual`

#### Premium Tier

1. Go to Products → Add product
2. **Name**: Premium
3. **Description**: Full access to everything you need
4. **Pricing**:
   - Monthly: £100.00 / month (7-day trial)
   - Annual: £960.00 / year (7-day trial)
5. **Trial**: Enable 7-day trial
6. Copy **Price IDs**:
   - `price_xxx_premium_monthly`
   - `price_xxx_premium_annual`

### Step 3: Update Database with Price IDs

```sql
-- Update Basic tier
UPDATE subscription_tiers
SET 
  stripe_price_id_monthly = 'price_xxx_basic_monthly',
  stripe_price_id_annual = 'price_xxx_basic_annual'
WHERE name = 'basic';

-- Update Premium tier
UPDATE subscription_tiers
SET 
  stripe_price_id_monthly = 'price_xxx_premium_monthly',
  stripe_price_id_annual = 'price_xxx_premium_annual'
WHERE name = 'premium';

-- Verify
SELECT name, stripe_price_id_monthly, stripe_price_id_annual
FROM subscription_tiers;
```

### Step 4: Configure Webhooks

1. Go to Developers → Webhooks → Add endpoint
2. **Endpoint URL**: `https://leavelab.com/api/v1/subscriptions/webhook`
3. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`
4. Click "Add endpoint"
5. Copy **Signing secret**: `whsec_xxx`
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 5: Configure Customer Portal

1. Go to Settings → Customer portal
2. **Enable**: Allow customers to...
   - Update payment methods
   - View invoices
   - Cancel subscriptions
   - Update billing information
3. **Branding**: Upload logo, set colors
4. **Business information**: Add company details

### Step 6: Test Webhook

```bash
# Test webhook locally first
stripe listen --forward-to https://leavelab.com/api/v1/subscriptions/webhook

# Trigger test event
stripe trigger checkout.session.completed

# Check logs in Vercel
vercel logs --follow
```

---

## n8n Webhooks

### Step 1: Verify n8n Workflow

n8n is already deployed at:
```
https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33
```

### Step 2: Test Webhook

```bash
curl -X POST https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33 \
  -H "Content-Type: application/json" \
  -d '{
    "event": "subscription.created",
    "timestamp": "2025-10-17T12:00:00Z",
    "user": {
      "id": "test-id",
      "email": "test@example.com",
      "name": "Test User"
    },
    "subscription": {
      "tier": "premium",
      "status": "active"
    }
  }'
```

### Step 3: Configure Email Templates

In n8n workflow, update:
- Welcome email template
- Payment confirmation template
- Cancellation email template
- Trial ending reminder

---

## Environment Variables

### Complete Environment Variables List

Create `.env.production` (DO NOT COMMIT):

```bash
# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# Stripe Configuration (PRODUCTION)
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Xxxxxx
STRIPE_SECRET_KEY=sk_live_51Xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx

# ============================================
# Application URLs
# ============================================
NEXT_PUBLIC_APP_URL=https://leavelab.com

# ============================================
# n8n Webhook
# ============================================
N8N_WEBHOOK_URL=https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33

# ============================================
# Optional: Monitoring
# ============================================
# SENTRY_DSN=https://xxx@sentry.io/xxx
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Setting in Vercel

```bash
# Set all at once using Vercel CLI
vercel env pull .env.production

# Or set individually
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# ... etc
```

### Environment Variable Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` (Production Supabase URL)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production anon key)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (Production service role key - KEEP SECRET)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Live publishable key)
- [ ] `STRIPE_SECRET_KEY` (Live secret key - KEEP SECRET)
- [ ] `STRIPE_WEBHOOK_SECRET` (Production webhook secret - KEEP SECRET)
- [ ] `NEXT_PUBLIC_APP_URL` (Production domain)
- [ ] `N8N_WEBHOOK_URL` (n8n webhook endpoint)

---

## Database Migrations

### Running Migrations

```bash
# 1. Ensure you're linked to production
supabase link --project-ref your-project-ref

# 2. Check current migration status
supabase db diff

# 3. Apply all pending migrations
supabase db push

# 4. Verify migrations applied
supabase db diff # Should show no changes
```

### Creating New Migrations

```bash
# Create new migration
supabase migration new add_new_feature

# Edit migration file
# supabase/migrations/20251017000001_add_new_feature.sql

# Test locally
supabase db reset

# Apply to production
supabase db push
```

### Migration Rollback

```bash
# List all migrations
supabase db list-migrations

# Rollback last migration (use with caution!)
supabase db reset --version 20251017000001

# Reapply migrations
supabase db push
```

---

## Post-Deployment

### Step 1: Verify Deployment

**Check these URLs**:

- [ ] https://leavelab.com (home page loads)
- [ ] https://leavelab.com/signup (signup page works)
- [ ] https://leavelab.com/login (login page works)
- [ ] https://leavelab.com/pricing (pricing page shows tiers)
- [ ] https://leavelab.com/dashboard (redirects to login if not logged in)

### Step 2: Test User Flows

#### Signup Flow

1. Go to https://leavelab.com/signup
2. Create account with email/password
3. Check email for verification link
4. Click verification link
5. Should redirect to dashboard
6. Check database:
   ```sql
   SELECT * FROM profiles WHERE email = 'test@example.com';
   SELECT * FROM user_subscriptions WHERE user_id = 'xxx';
   ```
7. Verify free tier assigned

#### Login Flow

1. Go to https://leavelab.com/login
2. Login with test account
3. Should redirect to dashboard
4. Check session cookie set

#### Subscription Flow

1. Login to test account
2. Go to https://leavelab.com/pricing
3. Click "Subscribe" on Basic tier
4. Should redirect to Stripe Checkout
5. Enter test card: `4242 4242 4242 4242`
6. Complete checkout
7. Should redirect back to dashboard
8. Check subscription status updated
9. Check Stripe Dashboard for subscription
10. Check n8n received webhook

### Step 3: Test Webhooks

```bash
# Trigger test checkout
stripe trigger checkout.session.completed

# Check Vercel logs
vercel logs --follow

# Check Stripe webhook logs
# Stripe Dashboard → Developers → Webhooks → View logs

# Check database
SELECT * FROM subscription_events 
ORDER BY created_at DESC 
LIMIT 10;
```

### Step 4: Configure OAuth (Google)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project → APIs & Services → Credentials
3. Edit OAuth 2.0 Client ID
4. **Authorized JavaScript origins**:
   - `https://leavelab.com`
5. **Authorized redirect URIs**:
   - `https://leavelab.com/auth/callback`
   - `https://your-project.supabase.co/auth/v1/callback`
6. Save

In Supabase:
1. Go to Authentication → Providers → Google
2. **Enabled**: Yes
3. **Client ID**: From Google Console
4. **Client Secret**: From Google Console
5. Save

Test:
1. Go to https://leavelab.com/login
2. Click "Continue with Google"
3. Should redirect to Google
4. Authorize app
5. Should redirect back and login

---

## Monitoring & Logging

### Vercel Analytics

Enable in Vercel Dashboard:
- Go to Analytics tab
- View real-time traffic
- Monitor Core Web Vitals

### Error Tracking with Sentry (Optional)

```bash
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard -i nextjs
```

Add to `.env`:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Logging

**Vercel Logs**:
```bash
# View production logs
vercel logs --follow

# Filter by function
vercel logs api/v1/subscriptions/webhook --follow
```

**Supabase Logs**:
- Go to Supabase Dashboard → Logs
- View Database logs, Auth logs, API logs

**Stripe Logs**:
- Go to Stripe Dashboard → Developers → Logs
- View API requests and webhook events

### Performance Monitoring

**Lighthouse CI**:
```bash
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun --collect.url=https://leavelab.com
```

**Target Metrics**:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

---

## CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Required Secrets

Add to GitHub → Settings → Secrets:

- `VERCEL_TOKEN`: From Vercel → Settings → Tokens
- `VERCEL_ORG_ID`: From Vercel project settings
- `VERCEL_PROJECT_ID`: From Vercel project settings

### Database Migrations in CI/CD

```yaml
- name: Run database migrations
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
  run: |
    supabase link --project-ref your-project-ref
    supabase db push
```

---

## Rollback Procedures

### Rollback Vercel Deployment

**Option 1: Vercel Dashboard**

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Option 2: Vercel CLI**

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel alias set deployment-url.vercel.app leavelab.com
```

### Rollback Database Migrations

```bash
# ⚠️ Use with extreme caution!

# 1. Backup database first
pg_dump $DATABASE_URL > backup.sql

# 2. Rollback to specific migration
supabase db reset --version 20251016000001

# 3. Verify
supabase db diff
```

### Emergency Maintenance Mode

Create `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  if (maintenanceMode && !request.url.includes('/maintenance')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  
  return NextResponse.next();
}
```

Enable maintenance mode:
```bash
vercel env add MAINTENANCE_MODE=true production
```

---

## Troubleshooting

### Deployment Failed

**Error**: "Build failed"

**Check**:
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check for lint errors
npm run lint
```

### Database Connection Failed

**Error**: "Could not connect to database"

**Check**:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is correct
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is correct
- [ ] Supabase project is not paused (free tier pauses after 7 days inactivity)
- [ ] Database is within size limits

### Stripe Webhook Not Working

**Error**: Webhook signature verification failed

**Check**:
- [ ] `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- [ ] Webhook URL is correct: `https://leavelab.com/api/v1/subscriptions/webhook`
- [ ] Webhook is receiving `POST` requests
- [ ] Endpoint returns 200 OK within 30 seconds

**Test**:
```bash
# Check webhook endpoint is accessible
curl -X POST https://leavelab.com/api/v1/subscriptions/webhook

# Should return 400 (signature required) not 404
```

### OAuth Not Working

**Error**: "Redirect URI mismatch"

**Check**:
- [ ] Google Console has correct redirect URI
- [ ] Supabase Auth has correct site URL
- [ ] URLs match exactly (no trailing slashes)

### Email Not Sending

**Check**:
- [ ] Supabase Auth email settings
- [ ] Email rate limits (3/hour on free tier)
- [ ] Email templates configured
- [ ] Domain verified (if using custom SMTP)

---

## Security Checklist

### Pre-Production

- [ ] All environment variables set correctly
- [ ] No secrets committed to Git
- [ ] API keys are production keys (not test)
- [ ] Webhook secrets are production secrets
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] RLS policies tested

### Post-Production

- [ ] Test all protected routes
- [ ] Verify auth flows work
- [ ] Test subscription flows
- [ ] Verify webhooks processing
- [ ] Check error logs for security issues
- [ ] Enable monitoring alerts
- [ ] Set up backup procedures

---

## Backup & Disaster Recovery

### Database Backups

**Supabase Auto-Backups**:
- Free tier: Daily backups (7-day retention)
- Pro tier: Daily backups (30-day retention)
- Restore from Supabase Dashboard → Database → Backups

**Manual Backup**:
```bash
# Backup database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup-20251017.sql
```

### Code Backups

- Git repository (GitHub/GitLab)
- Vercel keeps all deployment history
- Download source from Vercel: Settings → Source

### Disaster Recovery Plan

1. **Database failure**:
   - Restore from Supabase backup
   - Apply any missing migrations
   - Verify data integrity

2. **Deployment failure**:
   - Rollback to previous Vercel deployment
   - Check error logs
   - Fix and redeploy

3. **Payment processing failure**:
   - Check Stripe status page
   - Switch to maintenance mode if needed
   - Communicate with users

---

## Production Checklist

### Final Checklist Before Launch

- [ ] All tests passing (unit, integration, E2E)
- [ ] TypeScript: 0 errors
- [ ] Lint: 0 errors
- [ ] Lighthouse: >90 on all metrics
- [ ] Mobile responsive on all pages
- [ ] OAuth working (Google)
- [ ] Email verification working
- [ ] Password reset working
- [ ] Subscription checkout working
- [ ] Webhooks processing correctly
- [ ] Stripe test mode disabled
- [ ] All environment variables set (production)
- [ ] Database migrations applied
- [ ] Storage bucket configured
- [ ] RLS policies active
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Backups enabled
- [ ] Domain configured (if using custom)
- [ ] SSL certificate active (automatic)
- [ ] Terms of Service page live
- [ ] Privacy Policy page live
- [ ] Contact/Support page live

### Launch Day Tasks

- [ ] Monitor logs closely
- [ ] Watch for errors in Sentry
- [ ] Check Stripe webhook logs
- [ ] Monitor server response times
- [ ] Test signup flow multiple times
- [ ] Test purchase flow multiple times
- [ ] Verify emails being sent
- [ ] Check n8n workflows executing
- [ ] Monitor database performance
- [ ] Watch for unusual traffic patterns

### Post-Launch (First Week)

- [ ] Daily log review
- [ ] Monitor error rates
- [ ] Check payment success rates
- [ ] Review user feedback
- [ ] Monitor page load times
- [ ] Check mobile usability
- [ ] Verify backup running
- [ ] Review security logs

---

## Support & Resources

### Official Documentation

- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **n8n**: https://docs.n8n.io

### LeaveLab Documentation

- [Developer Guide](./DEVELOPER_GUIDE.md)
- [API Reference](./API_REFERENCE.md)
- [Webhook Events](./WEBHOOK_EVENTS.md)
- [User Guide](./USER_SUBSCRIPTION_GUIDE.md)

### Community & Support

- **Email**: support@leavelab.com
- **Discord**: [Join our community](#)
- **GitHub Issues**: Report bugs and request features

---

## Congratulations! 🎉

Your LeaveLab application is now live in production!

### What's Next?

1. **Monitor**: Keep an eye on logs and metrics
2. **Optimize**: Improve performance based on real data
3. **Iterate**: Add new features based on user feedback
4. **Scale**: Upgrade infrastructure as you grow

### Recommended Next Steps

- Set up automated backups
- Configure monitoring alerts
- Implement analytics tracking
- Add comprehensive error tracking
- Set up A/B testing (optional)
- Create staging environment
- Document internal processes
- Train support team

---

**Deployment Complete** ✅

*Last Updated: October 2025*

