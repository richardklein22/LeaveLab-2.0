# Implementation Plan: User Authentication & Onboarding

**Branch**: `001-user-authentication-onboarding` | **Date**: 2025-10-08 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-user-authentication-onboarding/spec.md`

## Summary

Build a complete authentication system enabling users to create accounts via email/password or Google OAuth, manage their profiles, and reset passwords. The system will use Supabase Auth for authentication, PostgreSQL with Row-Level Security for data protection, and Next.js for the frontend. All authentication flows will be mobile-first, with real-time validation, clear error messaging, and loading states. Session management supports 7-day persistence, automatic OAuth account linking, and security alert emails after failed login attempts.

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20.x  
**Primary Dependencies**: 
- Next.js 14+ (App Router, Server Actions, API Routes)
- Supabase JS Client 2.x (Auth, Database, Storage)
- React 18+
- Tailwind CSS 3.x
- Shadcn/ui component library
- React Hook Form + Zod validation
- Jest + React Testing Library + Playwright

**Storage**: Supabase PostgreSQL 15+ with Row-Level Security (RLS)  
**Testing**: Jest (unit), React Testing Library (component), Playwright (E2E), Supabase local development  
**Target Platform**: Web (mobile-first responsive), iOS Safari 15+, Chrome for Android 90+  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: 
- Page load <3s on 3G mobile networks
- Time to Interactive <5s
- Authentication operations complete <3s (95th percentile)
- Lighthouse scores >90 (Performance, Accessibility, Best Practices), 100 (SEO)

**Constraints**: 
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Mobile-first design (75% of user base)
- All copy in British English
- GDPR compliance required
- Row-Level Security mandatory on all database tables

**Scale/Scope**: 
- Initial target: 1,000 concurrent users
- Database: User accounts, profiles, sessions, tokens
- 6 user stories (3 P1, 2 P2, 1 P3)
- 33 functional requirements
- Authentication screens: Signup, Login, Password Reset, Profile Settings, Account Settings

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Review each principle from `.specify/memory/constitution.md` and verify compliance:

- [x] **Mobile-First Development**: Design and implementation prioritises mobile experience, meets performance budgets (<3s load, <5s TTI on 3G)
  - ✅ Responsive Tailwind components with mobile-first breakpoints
  - ✅ Touch-friendly form inputs and buttons (min 44x44px tap targets)
  - ✅ PWA manifest for offline capability
  - ✅ Lighthouse audit targets specified

- [x] **API-First Architecture**: APIs designed and documented before UI, webhook support for n8n, versioned endpoints
  - ✅ Next.js API Routes for auth operations
  - ✅ OpenAPI spec generated for all endpoints
  - ✅ Webhook endpoints for n8n (onboarding, security alerts)
  - ✅ API versioning via /api/v1 prefix

- [x] **Security & Privacy**: RLS policies defined, authentication implemented, GDPR compliance considered
  - ✅ Supabase RLS policies on all tables (users, profiles, sessions)
  - ✅ Email/password + Google OAuth via Supabase Auth
  - ✅ GDPR data export and account deletion endpoints
  - ✅ Password hashing via Supabase Auth (bcrypt)
  - ✅ Security audit logging for all auth events

- [x] **Modular Content Architecture**: Feature can be deployed independently, follows domain-based organisation
  - ✅ Authentication module self-contained in `/src/features/auth`
  - ✅ Database tables namespaced (auth schema)
  - ✅ API routes under `/api/v1/auth`
  - ✅ Independent deployment to Vercel preview environment

- [x] **Test-Driven Development**: Tests written first, 80% coverage target
  - ✅ Unit tests for validation logic (email, password strength)
  - ✅ Integration tests for Supabase Auth flows
  - ✅ E2E tests for critical paths (signup, login, password reset)
  - ✅ 80% coverage target on `/src/features/auth`

- [x] **Performance & UX**: Core Web Vitals targets met, British English copy, skeleton loaders, error boundaries
  - ✅ Skeleton loaders during auth operations
  - ✅ Optimistic UI updates for form submissions
  - ✅ Error boundaries wrap auth components
  - ✅ All copy in British English ("authorise", "organisation", etc.)
  - ✅ Real-time form validation with clear error messages

**Complexity Justification**: None required - follows standard patterns

## Project Structure

### Documentation (this feature)

```
specs/001-user-authentication-onboarding/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (implementation plan)
├── research.md          # Technical research and decisions
├── data-model.md        # Database schema and entities
├── quickstart.md        # Setup and development guide
├── contracts/           # API documentation
│   └── api-spec.json    # OpenAPI specification
└── checklists/
    └── requirements.md  # Quality validation checklist
```

### Source Code (repository root)

```
# Next.js web application structure
src/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Auth layout group
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   ├── signup/
│   │   │   └── page.tsx           # Signup page
│   │   ├── reset-password/
│   │   │   └── page.tsx           # Password reset request
│   │   ├── update-password/
│   │   │   └── page.tsx           # Set new password
│   │   └── verify-email/
│   │       └── page.tsx           # Email verification handler
│   ├── (dashboard)/               # Authenticated layout group
│   │   ├── dashboard/
│   │   │   └── page.tsx           # User dashboard
│   │   ├── profile/
│   │   │   └── page.tsx           # Profile management
│   │   └── settings/
│   │       └── page.tsx           # Account settings
│   ├── api/                       # API Routes
│   │   └── v1/
│   │       ├── auth/
│   │       │   ├── signup/route.ts
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   ├── reset-password/route.ts
│   │       │   ├── update-password/route.ts
│   │       │   └── verify-email/route.ts
│   │       └── webhooks/
│   │           └── n8n/
│   │               ├── auth-events/route.ts
│   │               └── security-alerts/route.ts
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles (Tailwind)
│
├── features/                      # Feature modules
│   └── auth/
│       ├── components/            # Auth-specific components
│       │   ├── LoginForm.tsx
│       │   ├── SignupForm.tsx
│       │   ├── ResetPasswordForm.tsx
│       │   ├── UpdatePasswordForm.tsx
│       │   ├── ProfileForm.tsx
│       │   ├── GoogleOAuthButton.tsx
│       │   └── AuthErrorBoundary.tsx
│       ├── hooks/                 # Custom React hooks
│       │   ├── useAuth.ts
│       │   ├── useSession.ts
│       │   ├── useProfile.ts
│       │   └── useSupabaseAuth.ts
│       ├── lib/                   # Business logic
│       │   ├── validation.ts      # Zod schemas
│       │   ├── auth-service.ts    # Auth operations
│       │   ├── session-manager.ts
│       │   └── security.ts        # Security utilities
│       ├── types/                 # TypeScript types
│       │   ├── auth.types.ts
│       │   ├── profile.types.ts
│       │   └── session.types.ts
│       └── constants/             # Constants and config
│           ├── validation-rules.ts
│           └── error-messages.ts
│
├── lib/                           # Shared utilities
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   ├── server.ts              # Server Supabase client
│   │   ├── middleware.ts          # Auth middleware
│   │   └── types.ts               # Generated database types
│   ├── email/
│   │   ├── templates/             # Email templates
│   │   │   ├── verification.tsx
│   │   │   ├── password-reset.tsx
│   │   │   └── security-alert.tsx
│   │   └── sender.ts              # Email sending service
│   └── utils/
│       ├── errors.ts              # Error handling
│       └── response.ts            # API response helpers
│
├── components/                    # Shared UI components
│   ├── ui/                        # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── alert.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── middleware.ts                  # Next.js middleware (auth)
└── types/
    └── supabase.ts                # Generated Supabase types

# Database migrations
supabase/
├── migrations/
│   ├── 20251008_001_create_auth_schema.sql
│   ├── 20251008_002_create_profiles_table.sql
│   ├── 20251008_003_create_rls_policies.sql
│   └── 20251008_004_create_functions.sql
└── seed.sql                       # Test data

# Testing
tests/
├── unit/
│   ├── auth/
│   │   ├── validation.test.ts
│   │   ├── auth-service.test.ts
│   │   └── session-manager.test.ts
│   └── lib/
│       └── errors.test.ts
├── integration/
│   ├── auth/
│   │   ├── signup.test.ts
│   │   ├── login.test.ts
│   │   ├── oauth.test.ts
│   │   ├── password-reset.test.ts
│   │   └── profile-update.test.ts
│   └── api/
│       └── auth-endpoints.test.ts
└── e2e/
    ├── auth/
    │   ├── signup-flow.spec.ts
    │   ├── login-flow.spec.ts
    │   ├── oauth-flow.spec.ts
    │   ├── password-reset-flow.spec.ts
    │   └── profile-management.spec.ts
    └── fixtures/
        └── test-users.ts

# Configuration
├── .env.local.example             # Environment variables template
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest configuration
├── playwright.config.ts           # Playwright configuration
└── package.json                   # Dependencies
```

**Structure Decision**: Using Next.js 14+ App Router with feature-based organisation. The authentication module is self-contained under `/src/features/auth` with dedicated components, hooks, and business logic. API routes follow RESTful conventions under `/api/v1/auth`. Database migrations managed via Supabase CLI. Testing structure mirrors source code organisation for easy navigation.

## Complexity Tracking

*No violations detected - all constitution principles satisfied.*