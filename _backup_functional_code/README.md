# Backup - Functional Code

This folder contains all the functional code that requires backend services (Stripe, Supabase, etc.) that has been temporarily moved out to create a deployment-ready landing page branch.

## What's in this folder?

- **api/** - All API routes (auth, subscriptions, profile, premium content, webhooks)
- **(auth)/** - Authentication pages (login, signup, password reset, email verification)
- **(dashboard)/** - Dashboard pages (user dashboard, profile, settings, subscription management, premium content)
- **auth/** - OAuth callback route
- **pricing/** - Pricing page with Stripe integration

## Why was this moved?

These components require:
- Supabase authentication and database
- Stripe payment processing
- Environment variables for API keys
- Backend services that may cause deployment errors

## How to restore?

To restore full functionality:

1. Make sure all environment variables are set (.env.local)
2. Move the folders back to their original locations:
   ```bash
   Move-Item "_backup_functional_code/api" "src/app/api"
   Move-Item "_backup_functional_code/(auth)" "src/app/(auth)"
   Move-Item "_backup_functional_code/(dashboard)" "src/app/(dashboard)"
   Move-Item "_backup_functional_code/auth" "src/app/auth"
   Move-Item "_backup_functional_code/pricing" "src/app/pricing"
   ```
3. Restore the original middleware.ts (uncomment the Supabase authentication)
4. Update the landing page links back to /login, /signup, /pricing

## Landing Page Branch Purpose

This branch is specifically for deploying a visual-only landing page without any functional backend dependencies. All CTAs now link to anchor points on the page or to a simple contact section.

