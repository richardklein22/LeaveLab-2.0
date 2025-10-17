# Quickstart: User Authentication & Onboarding

**Feature**: 001-user-authentication-onboarding  
**Date**: 2025-10-08  
**Estimated Setup Time**: 30-45 minutes

## Overview

This guide will help you set up the authentication feature locally, including Next.js, Supabase, and all required dependencies.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js 20.x** or later ([Download](https://nodejs.org/))
- **npm** or **pnpm** or **yarn** package manager
- **Supabase CLI** ([Install Guide](https://supabase.com/docs/guides/cli))
- **Git** for version control
- **Code editor** (VS Code recommended)

---

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone https://github.com/your-org/leave-lab.git
cd leave-lab

# Checkout the feature branch
git checkout 001-user-authentication-onboarding

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

---

## Step 2: Set Up Supabase Project

### Option A: Create New Supabase Project (Recommended for Development)

```bash
# Initialize Supabase locally
supabase init

# Start local Supabase instance (Docker required)
supabase start

# This will output:
# - API URL: http://localhost:54321
# - GraphQL URL: http://localhost:54321/graphql/v1
# - DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# - Studio URL: http://localhost:54323
# - Inbucket URL: http://localhost:54324
# - JWT secret: your-super-secret-jwt-token-with-at-least-32-characters-long
# - anon key: eyJhb...
# - service_role key: eyJhb...
```

### Option B: Use Existing Supabase Cloud Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy the **URL** and **anon public** key

---

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LeaveLab

# Email Service (optional for local dev, required for production)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@leavelab.com

# n8n Webhooks (optional for local dev)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# OAuth Providers
# Google OAuth (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Session Configuration
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
SESSION_DURATION_DAYS=7
```

---

## Step 4: Run Database Migrations

Apply the database schema for authentication:

```bash
# Run all migrations
supabase db push

# Alternatively, run migrations individually
supabase migration up --file 20251008_001_create_profiles_table
supabase migration up --file 20251008_002_create_auth_logs_table
supabase migration up --file 20251008_003_create_functions
supabase migration up --file 20251008_004_configure_storage

# Verify migrations
supabase db diff
```

---

## Step 5: Configure Google OAuth (Optional)

To enable Google OAuth login:

### 5.1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:54321/auth/v1/callback` (local Supabase)
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` (production)
7. Copy **Client ID** and **Client Secret**

### 5.2. Configure in Supabase

**For Local Supabase:**

Edit `supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "your-google-client-id.apps.googleusercontent.com"
secret = "your-google-client-secret"
redirect_uri = "http://localhost:54321/auth/v1/callback"
```

Then restart Supabase:

```bash
supabase stop
supabase start
```

**For Supabase Cloud:**

1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Paste Client ID and Client Secret
4. Save

---

## Step 6: Generate TypeScript Types

Generate TypeScript types from your Supabase schema:

```bash
# For local Supabase
supabase gen types typescript --local > src/lib/supabase/types.ts

# For Supabase Cloud
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

---

## Step 7: Seed Test Data (Optional)

Create test users for development:

```bash
supabase db seed
```

Or manually create test users via Supabase Studio:

1. Open Studio: `http://localhost:54323`
2. Go to **Authentication** → **Users**
3. Click **Add user**
4. Create test users:
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Auto-confirm email: ✅

---

## Step 8: Start Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The application will be available at: **http://localhost:3000**

---

## Step 9: Verify Setup

### 9.1. Check Supabase Connection

Navigate to: `http://localhost:3000/api/health`

Expected response:
```json
{
  "status": "ok",
  "supabase": "connected",
  "database": "healthy"
}
```

### 9.2. Test Authentication Flows

1. **Signup**: http://localhost:3000/signup
   - Create account with email/password
   - Check Inbucket for verification email: http://localhost:54324
   - Click verification link

2. **Login**: http://localhost:3000/login
   - Log in with test credentials
   - Verify redirect to dashboard

3. **Google OAuth** (if configured): http://localhost:3000/login
   - Click "Continue with Google"
   - Complete OAuth flow
   - Verify account creation or login

4. **Password Reset**: http://localhost:3000/reset-password
   - Enter email address
   - Check Inbucket for reset email
   - Click reset link and set new password

5. **Profile Management**: http://localhost:3000/profile
   - Update display name
   - Upload profile picture
   - Verify changes persist

---

## Step 10: Run Tests

### Unit Tests

```bash
npm run test
# or
npm run test:watch  # watch mode
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
# Start dev server first
npm run dev

# In another terminal
npm run test:e2e
# or
npx playwright test
```

---

## Troubleshooting

### Issue: Supabase won't start

**Error**: `Docker is not running`

**Solution**:
```bash
# Ensure Docker Desktop is running
docker --version

# Restart Supabase
supabase stop
supabase start
```

---

### Issue: Email verification link doesn't work

**Solution**: 
- Check Inbucket: http://localhost:54324
- Verify `NEXT_PUBLIC_APP_URL` in `.env.local` matches your dev server URL
- Ensure email redirect URL is configured in Supabase:
  ```bash
  # Check config
  cat supabase/config.toml | grep redirect_urls
  ```

---

### Issue: Google OAuth fails

**Error**: `Invalid redirect_uri`

**Solution**:
1. Verify redirect URI in Google Cloud Console matches Supabase callback URL
2. For local dev: `http://localhost:54321/auth/v1/callback`
3. Restart Supabase after config changes

---

### Issue: TypeScript errors about Supabase types

**Solution**:
```bash
# Regenerate types
supabase gen types typescript --local > src/lib/supabase/types.ts

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

### Issue: RLS policies blocking data access

**Solution**:
```bash
# Check RLS policies in Supabase Studio
# http://localhost:54323 → Database → Policies

# Temporarily disable RLS for debugging (NOT for production!)
# In Supabase Studio SQL Editor:
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

---

## Development Workflow

### 1. Create New Migration

```bash
supabase migration new my_migration_name
```

Edit the generated file in `supabase/migrations/`, then:

```bash
supabase db push
```

### 2. Reset Local Database

```bash
# WARNING: This will delete all local data
supabase db reset
```

### 3. View Logs

```bash
# Supabase logs
supabase logs

# Next.js dev server logs (automatic in terminal)
```

### 4. Access Supabase Studio

Open: http://localhost:54323

Features:
- **Table Editor**: View/edit database records
- **SQL Editor**: Run SQL queries
- **Authentication**: Manage users
- **Storage**: View uploaded files
- **API Docs**: Auto-generated API documentation

---

## Production Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

### 2. Configure Supabase Cloud

1. Create production Supabase project
2. Run migrations:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```
3. Update environment variables in Vercel with production Supabase credentials
4. Configure custom domain in Supabase: **Settings** → **API** → **URL Configuration**

### 3. Enable Email Service

Production requires email service for verification and password reset:

**Option A: Resend (Recommended)**

1. Sign up at [https://resend.com](https://resend.com)
2. Get API key
3. Verify domain
4. Add `RESEND_API_KEY` to Vercel environment variables

**Option B: SendGrid**

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Get API key
3. Add to environment variables

### 4. Configure OAuth for Production

Update Google OAuth redirect URIs:
- `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- `https://your-app.com/auth/callback`

---

## Useful Commands

```bash
# Supabase
supabase status              # Check Supabase status
supabase logs                # View logs
supabase db diff             # Show pending migrations
supabase db reset            # Reset local database
supabase gen types           # Generate TypeScript types

# Next.js
npm run dev                  # Start dev server
npm run build                # Build for production
npm run start                # Start production server
npm run lint                 # Run ESLint
npm run type-check           # Run TypeScript compiler

# Testing
npm run test                 # Run unit tests
npm run test:integration     # Run integration tests
npm run test:e2e             # Run E2E tests
npm run test:coverage        # Generate coverage report
```

---

## Next Steps

After completing this quickstart:

1. **Familiarize yourself with the codebase**:
   - Review `/src/features/auth` for authentication logic
   - Explore `/src/app/(auth)` for auth pages
   - Check `/src/lib/supabase` for database utilities

2. **Review the specification**:
   - Read [spec.md](./spec.md) for requirements
   - Check [data-model.md](./data-model.md) for database schema
   - See [api-spec.json](./contracts/api-spec.json) for API documentation

3. **Run the task breakdown**:
   ```bash
   # Generate implementation tasks
   /speckit.tasks
   ```

4. **Start implementing**:
   - Follow TDD approach (write tests first)
   - Implement according to `tasks.md`
   - Ensure 80% test coverage

---

## Support

For issues or questions:
- Check [research.md](./research.md) for technical decisions
- Review Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Open GitHub issue with the `authentication` label

---

**Setup Complete!** 🎉 

You're now ready to implement Feature 001: User Authentication & Onboarding.
