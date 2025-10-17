# LeaveLab Developer Guide 🏗️

**For Developers**: Comprehensive guide to the LeaveLab architecture, codebase, and development practices.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication System](#authentication-system)
- [Subscription System](#subscription-system)
- [API Design](#api-design)
- [Frontend Patterns](#frontend-patterns)
- [Security](#security)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Performance](#performance)
- [Deployment](#deployment)

---

## Architecture Overview

LeaveLab follows a modern, scalable architecture built on Next.js 15 with the App Router, Supabase for backend services, and Stripe for payment processing.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js App Router (React 19 + TypeScript)          │   │
│  │  - Server Components (default)                        │   │
│  │  - Client Components (interactive UI)                 │   │
│  │  - Route Handlers (API endpoints)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Middleware                                   │   │
│  │  - Session management                                 │   │
│  │  - Auth protection                                    │   │
│  │  - Route guards                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                        │
│  ┌──────────────────┬──────────────────┬─────────────────┐  │
│  │  Supabase        │  Stripe          │  n8n Webhooks   │  │
│  │  - Auth          │  - Checkout      │  - Automation   │  │
│  │  - PostgreSQL    │  - Subscriptions │  - Emails       │  │
│  │  - Storage       │  - Webhooks      │  - Events       │  │
│  │  - RLS           │  - Portal        │                 │  │
│  └──────────────────┴──────────────────┴─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Request
    │
    ▼
Middleware (auth check)
    │
    ▼
API Route Handler
    │
    ├──▶ Supabase (data operations)
    │       │
    │       ▼
    │   PostgreSQL + RLS (security)
    │
    ├──▶ Stripe (payments)
    │       │
    │       ▼
    │   Webhook ──▶ n8n (automation)
    │
    ▼
Response to Client
```

### Key Design Principles

1. **API-First**: All features start with API routes before UI
2. **Mobile-First**: Responsive design starting at 375px width
3. **Security-First**: RLS policies on all tables, server-side validation
4. **Type-Safe**: End-to-end TypeScript with Zod validation
5. **Modular**: Feature-based directory structure
6. **Test-Driven**: Write tests before implementation

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.4 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 3.4.18 | Styling |
| **shadcn/ui** | Latest | UI components (Radix UI) |
| **React Hook Form** | 7.64.0 | Form management |
| **Zod** | 4.1.12 | Schema validation |
| **SWR** | 2.3.6 | Data fetching & caching |
| **Lucide React** | 0.545.0 | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.74.0 | Backend-as-a-Service |
| **PostgreSQL** | 15+ | Database (via Supabase) |
| **Stripe** | 19.1.0 | Payment processing |
| **n8n** | - | Workflow automation (external) |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest** | Unit testing |
| **Playwright** | E2E testing |
| **Supabase CLI** | Local development |

---

## Project Structure

```
LeaveLab/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # Auth layout group (public)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── reset-password/
│   │   │   └── update-password/
│   │   │
│   │   ├── (dashboard)/               # Dashboard layout group (protected)
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   │
│   │   ├── api/v1/                    # API routes (versioned)
│   │   │   ├── auth/                  # Auth endpoints
│   │   │   ├── profile/               # Profile endpoints
│   │   │   ├── subscriptions/         # Subscription endpoints
│   │   │   ├── account/               # Account management
│   │   │   └── premium/               # Premium content
│   │   │
│   │   ├── auth/callback/             # OAuth callback
│   │   ├── pricing/                   # Pricing page
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page
│   │   └── globals.css                # Global styles
│   │
│   ├── features/                      # Feature modules
│   │   ├── auth/                      # Authentication feature
│   │   │   ├── components/            # Auth-specific components
│   │   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── lib/                   # Business logic
│   │   │   ├── types/                 # TypeScript types
│   │   │   └── constants/             # Constants & messages
│   │   │
│   │   └── subscriptions/             # Subscriptions feature
│   │       ├── components/            # Subscription components
│   │       ├── hooks/                 # Subscription hooks
│   │       ├── lib/                   # Stripe integration
│   │       ├── types/                 # Subscription types
│   │       └── constants/             # Tier definitions
│   │
│   ├── components/                    # Shared components
│   │   └── ui/                        # shadcn/ui components
│   │
│   └── lib/                           # Shared utilities
│       ├── supabase/                  # Supabase clients
│       │   ├── client.ts              # Browser client
│       │   ├── server.ts              # Server client
│       │   └── middleware.ts          # Middleware helper
│       │
│       ├── email/                     # Email templates
│       ├── utils/                     # Utilities
│       │   ├── errors.ts              # Error handling
│       │   ├── response.ts            # API responses
│       │   ├── cn.ts                  # Class name utility
│       │   └── n8n-webhook.ts         # n8n integration
│       │
│       └── utils.ts                   # Shared utilities
│
├── supabase/
│   ├── config.toml                    # Supabase config
│   └── migrations/                    # Database migrations
│       ├── 20251008000001_*.sql       # Auth tables
│       ├── 20251008100001_*.sql       # Subscription tables
│       └── 20251017100001_*.sql       # RLS policies
│
├── tests/
│   ├── unit/                          # Unit tests
│   ├── integration/                   # Integration tests
│   └── e2e/                           # End-to-end tests
│
├── docs/                              # Documentation
│   ├── USER_SUBSCRIPTION_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   ├── API_REFERENCE.md
│   ├── WEBHOOK_EVENTS.md
│   └── DEPLOYMENT_GUIDE.md
│
├── specs/                             # Feature specifications
│   ├── 001-user-authentication-onboarding/
│   └── 002-stripe-membership-subscriptions/
│
├── middleware.ts                      # Next.js middleware
├── next.config.js                     # Next.js config
├── tailwind.config.js                 # Tailwind config
├── tsconfig.json                      # TypeScript config
└── package.json                       # Dependencies
```

### Directory Conventions

#### Feature Modules (`/src/features/*`)

Each feature is self-contained with:

```
feature-name/
├── components/           # Feature-specific components
│   ├── ComponentName.tsx
│   └── index.ts         # Named exports
│
├── hooks/               # Custom React hooks
│   ├── useFeature.ts
│   └── index.ts
│
├── lib/                 # Business logic (server & client)
│   ├── validation.ts    # Zod schemas
│   ├── helpers.ts
│   └── api.ts
│
├── types/               # TypeScript interfaces
│   └── feature.types.ts
│
├── constants/           # Constants, messages, configs
│   ├── messages.ts
│   └── config.ts
│
└── index.ts            # Public API (exports)
```

#### API Routes (`/src/app/api/v1/*`)

API routes follow RESTful conventions:

```
/api/v1/resource/
├── route.ts             # GET /api/v1/resource, POST /api/v1/resource
├── [id]/
│   └── route.ts         # GET /api/v1/resource/:id, PATCH, DELETE
└── action/
    └── route.ts         # POST /api/v1/resource/action
```

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐
│  auth.users  │  (Supabase Auth)
└───────┬──────┘
        │
        │ 1:1
        ▼
┌─────────────────┐
│    profiles     │  (User profiles)
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────────────┐
│  user_subscriptions     │
└──────────┬──────────────┘
           │
           │ many:1
           ▼
┌──────────────────────┐       ┌──────────────────────┐
│  subscription_tiers  │       │  subscription_events │
└──────────────────────┘       └──────────────────────┘
```

### Core Tables

#### `profiles`

User profile information.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  timezone TEXT,
  language TEXT DEFAULT 'en',
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**RLS Policies**:
- Users can read their own profile
- Users can update their own profile
- Deleted profiles are hidden

#### `subscription_tiers`

Subscription tier definitions (Free, Basic, Premium).

```sql
CREATE TABLE subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- 'free' | 'basic' | 'premium'
  display_name TEXT NOT NULL,
  description TEXT,
  stripe_product_id TEXT,
  stripe_price_id_monthly TEXT,
  stripe_price_id_annual TEXT,
  price_monthly_pence INTEGER NOT NULL,
  price_annual_pence INTEGER NOT NULL,
  features JSONB NOT NULL,
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Features Schema** (JSONB):
```json
{
  "max_courses": 1,                    // null = unlimited
  "first_lesson_only": false,
  "community_access": true,
  "email_support": true,
  "one_on_one_support": false,
  "visa_info": "short_term",           // "none" | "short_term" | "all"
  "accommodation_info": "short_term",  // "none" | "short_term" | "all"
  "has_trial": false,
  "trial_days": null
}
```

#### `user_subscriptions`

User subscription records with Stripe integration.

```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT, -- 'monthly' | 'annual'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Status Values**:
- `active`: Subscription is active
- `trialing`: In trial period
- `past_due`: Payment failed
- `cancelled`: User cancelled
- `incomplete`: Payment incomplete
- `incomplete_expired`: Payment expired
- `unpaid`: Payment unpaid

**RLS Policies**:
- Users can read their own subscription
- Only service role can update subscriptions

#### `subscription_events`

Audit log for subscription events (Stripe webhooks).

```sql
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  event_source TEXT NOT NULL, -- 'stripe' | 'system' | 'user' | 'n8n'
  stripe_event_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  metadata JSONB,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `auth_logs`

Security audit log for authentication events.

```sql
CREATE TABLE auth_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Database Functions

#### `create_free_subscription_for_new_user()`

Automatically creates a free-tier subscription when a new user signs up.

```sql
CREATE OR REPLACE FUNCTION create_free_subscription_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_tier_id UUID;
BEGIN
  SELECT id INTO free_tier_id FROM subscription_tiers WHERE name = 'free' LIMIT 1;
  
  IF free_tier_id IS NOT NULL THEN
    INSERT INTO user_subscriptions (user_id, tier_id, status)
    VALUES (NEW.id, free_tier_id, 'active')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `get_user_tier_features(user_id)`

Returns the subscription tier features for a user.

```sql
CREATE OR REPLACE FUNCTION get_user_tier_features(user_id UUID)
RETURNS JSONB AS $$
DECLARE
  features JSONB;
BEGIN
  SELECT t.features INTO features
  FROM user_subscriptions us
  JOIN subscription_tiers t ON us.tier_id = t.id
  WHERE us.user_id = user_id;
  
  RETURN features;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Authentication System

### Architecture

LeaveLab uses **Supabase Auth** for authentication, supporting:
- Email/password authentication
- OAuth providers (Google)
- Email verification
- Password reset with PKCE
- Session management

### Flow Diagrams

#### Email/Password Signup

```
User submits signup form
    │
    ▼
POST /api/v1/auth/signup
    │
    ├──▶ Validate input (Zod)
    │
    ├──▶ Supabase: signUp()
    │       │
    │       ├──▶ Create auth.users record
    │       ├──▶ Send verification email
    │       └──▶ Trigger: Create profile
    │                   └──▶ Create free subscription
    │
    ▼
Return success (check email)
```

#### Login Flow

```
User submits login form
    │
    ▼
POST /api/v1/auth/login
    │
    ├──▶ Validate input (Zod)
    │
    ├──▶ Check failed login attempts (brute force protection)
    │
    ├──▶ Supabase: signInWithPassword()
    │       │
    │       ├──▶ Success: Create session
    │       │       └──▶ Set HTTP-only cookie
    │       │
    │       └──▶ Failure: Log failed attempt
    │               └──▶ Send security alert (5+ failures)
    │
    ▼
Return session or error
```

#### OAuth Flow (Google)

```
User clicks "Continue with Google"
    │
    ▼
Supabase: signInWithOAuth()
    │
    ▼
Redirect to Google
    │
    ▼
User authorizes
    │
    ▼
Redirect to /auth/callback
    │
    ├──▶ Exchange code for session
    │
    ├──▶ Check if email exists
    │       │
    │       ├──▶ Yes: Link accounts
    │       └──▶ No: Create new profile
    │
    ▼
Redirect to /dashboard
```

### Supabase Clients

#### Browser Client (`/src/lib/supabase/client.ts`)

Used in client components:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### Server Client (`/src/lib/supabase/server.ts`)

Used in Server Components and API routes:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

#### Middleware Helper (`/src/lib/supabase/middleware.ts`)

Session management in middleware:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // Refresh session
  await supabase.auth.getUser();
  
  return response;
}
```

### Protected Routes

Routes in `(dashboard)` layout require authentication:

```typescript
// src/app/(dashboard)/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return <>{children}</>;
}
```

---

## Subscription System

### Architecture

The subscription system integrates three key components:
1. **Supabase** (subscription data & RLS)
2. **Stripe** (payment processing)
3. **n8n** (workflow automation)

### Subscription Lifecycle

```
User creates account
    │
    ▼
Free tier subscription (automatic)
    │
    │ User clicks "Subscribe"
    ▼
POST /api/v1/subscriptions/checkout
    │
    ├──▶ Validate tier & billing cycle
    │
    ├──▶ Create/retrieve Stripe Customer
    │
    ├──▶ Create Stripe Checkout Session
    │       - Line item: Subscription price
    │       - Metadata: userId, tierId, billingCycle
    │       - Trial: 7 days (Premium only)
    │
    ▼
Redirect to Stripe Checkout
    │
    ▼
User enters payment details
    │
    ├──▶ Success
    │       │
    │       ▼
    │   Redirect to success_url
    │       │
    │       ▼
    │   Stripe webhook: checkout.session.completed
    │       │
    │       ├──▶ Update user_subscriptions table
    │       │
    │       ├──▶ Send to n8n (welcome email)
    │       │
    │       └──▶ Log event
    │
    └──▶ Cancel
            │
            ▼
        Redirect to cancel_url
```

### Stripe Integration

#### Checkout Session Creation

```typescript
// src/app/api/v1/subscriptions/checkout/route.ts
import { stripe } from '@/features/subscriptions/lib/stripe-server';

export async function POST(request: Request) {
  const { tierId, billingCycle, trial } = await request.json();
  
  // Get tier from database
  const { data: tier } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('id', tierId)
    .single();
  
  // Create or retrieve Stripe customer
  let customerId = userSubscription.stripe_customer_id;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{
      price: billingCycle === 'monthly' 
        ? tier.stripe_price_id_monthly 
        : tier.stripe_price_id_annual,
      quantity: 1,
    }],
    subscription_data: trial ? {
      trial_period_days: 7,
    } : undefined,
    metadata: {
      userId: user.id,
      tierId: tier.id,
      billingCycle,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
  });
  
  return Response.json({ sessionId: session.id, url: session.url });
}
```

#### Webhook Handling

```typescript
// src/app/api/v1/subscriptions/webhook/route.ts
import { stripe } from '@/features/subscriptions/lib/stripe-server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  
  // Verify webhook signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Handle event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event);
      break;
  }
  
  return Response.json({ received: true });
}
```

### Access Control with RLS

Subscription-based access is enforced through PostgreSQL RLS policies:

```sql
-- Example: Premium content access
CREATE POLICY "Users can access premium content based on tier"
  ON premium_content
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_subscriptions us
      JOIN subscription_tiers t ON us.tier_id = t.id
      WHERE us.user_id = auth.uid()
        AND us.status = 'active'
        AND t.name IN ('premium', 'basic') -- or just 'premium'
    )
  );
```

### Frontend Hooks

#### `useSubscription`

Fetches user's current subscription:

```typescript
// src/features/subscriptions/hooks/useSubscription.ts
import useSWR from 'swr';

export function useSubscription() {
  const { data, error, mutate } = useSWR('/api/v1/subscriptions/status', fetcher);
  
  return {
    subscription: data?.subscription,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
```

#### `useSubscriptionGate`

Checks if user has access to a feature:

```typescript
// src/features/subscriptions/hooks/useSubscriptionGate.ts
export function useSubscriptionGate(requiredTier: 'free' | 'basic' | 'premium') {
  const { subscription } = useSubscription();
  
  const tierHierarchy = { free: 0, basic: 1, premium: 2 };
  const hasAccess = tierHierarchy[subscription?.tier.name] >= tierHierarchy[requiredTier];
  
  return {
    hasAccess,
    currentTier: subscription?.tier.name,
    canUpgrade: !hasAccess,
  };
}
```

#### `useCheckout`

Initiates Stripe Checkout:

```typescript
// src/features/subscriptions/hooks/useCheckout.ts
export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  
  const startCheckout = async (tierId: string, billingCycle: 'monthly' | 'annual') => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId, billingCycle }),
      });
      
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  };
  
  return { startCheckout, isLoading };
}
```

---

## API Design

### Conventions

1. **Versioning**: All APIs are versioned (`/api/v1/`)
2. **RESTful**: Follow REST principles
3. **Status Codes**: Use appropriate HTTP status codes
4. **Error Handling**: Consistent error responses
5. **Authentication**: Bearer token or session cookie

### Response Format

#### Success Response

```typescript
{
  "data": {
    // Resource data
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

#### Error Response

```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": {
      "field": "email",
      "issue": "Invalid format"
    }
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

### API Response Helpers

```typescript
// src/lib/utils/response.ts
export function successResponse(data: any, status = 200) {
  return Response.json(
    {
      data,
      meta: { timestamp: new Date().toISOString() },
    },
    { status }
  );
}

export function errorResponse(message: string, code: string, status = 400) {
  return Response.json(
    {
      error: { code, message },
      meta: { timestamp: new Date().toISOString() },
    },
    { status }
  );
}
```

### Validation with Zod

All API inputs are validated with Zod schemas:

```typescript
// src/features/auth/lib/validation.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
});

// Usage in API route
export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const validatedData = signupSchema.parse(body);
    // Proceed with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message, 'VALIDATION_ERROR', 400);
    }
  }
}
```

---

## Frontend Patterns

### Server vs Client Components

**Server Components** (default):
- Fetch data directly from Supabase
- No JavaScript sent to client
- SEO-friendly
- Better performance

```typescript
// Server Component
async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('courses').select('*');
  
  return <CourseList courses={data} />;
}
```

**Client Components** (when needed):
- Interactive UI (forms, buttons)
- Use React hooks (useState, useEffect)
- Client-side data fetching (SWR)

```typescript
'use client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  // ...
}
```

### Data Fetching Strategy

1. **Server Components**: Direct Supabase queries
2. **Client Components**: SWR for caching & revalidation
3. **API Routes**: For mutations and complex operations

### Form Handling

All forms use React Hook Form + Zod:

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/features/auth/lib/validation';

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  
  const onSubmit = async (data) => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### UI Components

We use **shadcn/ui** components (Radix UI + Tailwind):

```bash
# Add a component
npx shadcn-ui@latest add button
```

Components are in `/src/components/ui/`:
- Accessible (WCAG 2.1 AA)
- Keyboard navigable
- Screen reader friendly
- Fully customizable

---

## Security

### Row-Level Security (RLS)

**Every table has RLS enabled**. No data is accessible without proper policies.

Example policies:

```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role bypasses RLS
CREATE POLICY "Service role full access"
  ON profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

### API Security Checklist

- ✅ Input validation (Zod)
- ✅ SQL injection protection (Supabase/parameterized queries)
- ✅ XSS protection (React escapes by default)
- ✅ CSRF protection (SameSite cookies)
- ✅ Rate limiting (Supabase built-in + custom)
- ✅ Authentication required (middleware)
- ✅ Authorization checks (RLS)
- ✅ Sensitive data encryption (Supabase)
- ✅ HTTPS only (production)
- ✅ Environment variables (never commit secrets)

### Stripe Security

- ✅ Webhook signature verification
- ✅ Server-side only API calls
- ✅ No Stripe keys in client code
- ✅ Idempotency keys for duplicate prevention

### Environment Variables

**Never commit**:
- Stripe secret keys
- Supabase service role key
- Webhook secrets
- API keys

Use `.env.local` (gitignored):

```bash
# Public (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Private (server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
N8N_WEBHOOK_URL=https://xxx.n8n.app/webhook/xxx
```

---

## Development Workflow

### Prerequisites

```bash
# Install dependencies
npm install

# Install Supabase CLI
brew install supabase/tap/supabase

# Start Docker Desktop (required for Supabase)
open -a Docker
```

### Local Development

```bash
# 1. Start Supabase (first time)
supabase start

# 2. Apply migrations
supabase db push

# 3. Generate TypeScript types
supabase gen types typescript --local > src/lib/supabase/types.ts

# 4. Start dev server
npm run dev

# App runs at http://localhost:3000
# Supabase Studio at http://localhost:54323
```

### Creating a New Feature

1. **Create feature directory**:
   ```bash
   mkdir -p src/features/my-feature/{components,hooks,lib,types,constants}
   ```

2. **Create API routes**:
   ```bash
   mkdir -p src/app/api/v1/my-feature
   touch src/app/api/v1/my-feature/route.ts
   ```

3. **Write tests first** (TDD):
   ```bash
   touch tests/unit/my-feature.test.ts
   npm run test -- my-feature.test.ts
   ```

4. **Implement feature**

5. **Run tests**:
   ```bash
   npm run test
   npm run test:integration
   ```

6. **Type check**:
   ```bash
   npm run type-check
   ```

7. **Lint**:
   ```bash
   npm run lint
   ```

### Database Migrations

```bash
# Create a new migration
supabase migration new my_migration_name

# Edit the migration file
# supabase/migrations/20251017000001_my_migration_name.sql

# Apply migration locally
supabase db push

# Apply migration to remote (production)
supabase db push --db-url $DATABASE_URL
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit frequently
git add .
git commit -m "feat(my-feature): add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

**Commit Message Convention**:
```
<type>(<scope>): <subject>

types: feat, fix, docs, style, refactor, test, chore
scope: auth, subscriptions, api, ui, etc.

Examples:
feat(auth): add Google OAuth
fix(subscriptions): handle failed payments
docs(api): update API reference
```

---

## Testing Strategy

### Testing Pyramid

```
       E2E Tests (Playwright)
      /                      \
     /   Integration Tests    \
    /    (Jest + Supabase)     \
   /                            \
  /__________Unit Tests__________\
         (Jest + RTL)
```

### Unit Tests

Test individual functions and components:

```typescript
// tests/unit/auth/validation.test.ts
import { signupSchema } from '@/features/auth/lib/validation';

describe('signupSchema', () => {
  it('should validate correct email and password', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'Password123',
    });
    
    expect(result.success).toBe(true);
  });
  
  it('should reject invalid email', () => {
    const result = signupSchema.safeParse({
      email: 'invalid-email',
      password: 'Password123',
    });
    
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests

Test API routes with real Supabase:

```typescript
// tests/integration/auth/signup.test.ts
describe('POST /api/v1/auth/signup', () => {
  it('should create a new user', async () => {
    const response = await fetch('http://localhost:3000/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'Password123',
      }),
    });
    
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data.user).toBeDefined();
  });
});
```

### E2E Tests

Test complete user flows:

```typescript
// tests/e2e/auth/signup.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and log in', async ({ page }) => {
  // Sign up
  await page.goto('http://localhost:3000/signup');
  await page.fill('[name=email]', 'e2e@example.com');
  await page.fill('[name=password]', 'Password123');
  await page.click('button[type=submit]');
  
  // Check for success message
  await expect(page.locator('text=Check your email')).toBeVisible();
});
```

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Integration tests
npm run test:integration

# E2E tests (requires dev server running)
npm run dev # Terminal 1
npm run test:e2e # Terminal 2

# Coverage
npm run test:coverage
```

### Coverage Goals

- **Unit tests**: 80%+ coverage for `/src/features/*/lib/`
- **Integration tests**: All API routes
- **E2E tests**: Critical user journeys

---

## Performance

### Optimization Strategies

1. **Server Components by default**
   - Reduce JavaScript bundle size
   - Faster initial page load

2. **Code splitting**
   - Dynamic imports for heavy components
   - Route-based splitting (automatic with App Router)

3. **Image optimization**
   - Next.js Image component
   - Lazy loading
   - Responsive images

4. **Data fetching**
   - Server-side data fetching (faster)
   - SWR caching (reduce API calls)
   - Pagination for large datasets

5. **Database optimization**
   - Indexes on frequently queried columns
   - Efficient RLS policies
   - Connection pooling (Supabase)

### Performance Targets

- **Lighthouse Score**: >90 (all metrics)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **API Response Time**: <200ms (p95)

### Monitoring

```typescript
// src/lib/utils/performance.ts
export function measureTime(label: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${label}: ${(end - start).toFixed(2)}ms`);
}
```

---

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full deployment instructions.

### Quick Deploy

1. **Vercel** (frontend):
   ```bash
   vercel deploy
   ```

2. **Supabase** (backend):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

3. **Stripe** (webhooks):
   - Configure webhook endpoint in Stripe Dashboard
   - Point to: `https://your-domain.com/api/v1/subscriptions/webhook`

---

## Additional Resources

- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Webhook Events**: [WEBHOOK_EVENTS.md](./WEBHOOK_EVENTS.md)
- **User Guide**: [USER_SUBSCRIPTION_GUIDE.md](./USER_SUBSCRIPTION_GUIDE.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Happy Coding!** 🚀

*Last Updated: October 2025*

