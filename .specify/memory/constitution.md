<!--
SYNC IMPACT REPORT
==================
Version: 0.0.0 → 1.0.0
Change Type: Initial Constitution
Modified Principles: None (initial creation)
Added Sections: All core principles, technology stack, development workflow, governance
Removed Sections: None
Templates Requiring Updates:
  ✅ .specify/templates/plan-template.md - updated with constitution gates
  ✅ .specify/templates/spec-template.md - verified alignment
  ✅ .specify/templates/tasks-template.md - verified alignment
Follow-up TODOs: None
-->

# LeaveLab Constitution

## Project Mission

LeaveLab is a platform empowering aspiring digital nomads to launch their location-independent careers. The platform provides curated courses (digital marketing, AI agencies, Amazon FBA), essential travel resources (visa info, job boards, accommodation), a membership-based business model with Stripe integration, an affiliate referral program, and Discord community integration.

## Core Principles

### I. Mobile-First Development (NON-NEGOTIABLE)

75% of users access via mobile - all features MUST be designed mobile-first, then enhanced for desktop. Progressive Web App (PWA) capabilities required for offline access to critical resources. Performance budget: Initial load <3s on 3G, Time to Interactive <5s. Touch-first interactions with thumb-friendly navigation zones. Responsive images with lazy loading mandatory. Lighthouse scores must maintain >90 Performance, >90 Accessibility, >90 Best Practices, 100 SEO.

**Rationale**: Mobile users are our primary audience; degraded mobile experience equals platform failure. Digital nomads are frequently mobile-only when travelling.

### II. API-First Architecture

Every feature MUST expose RESTful API endpoints before UI implementation. OpenAPI/Swagger documentation required for all endpoints. Webhook support for n8n workflow automation integrations (email sequences, onboarding, payment processing, customer service, questions, sales tasks, general admin). API versioning mandatory (v1, v2, etc.) to prevent breaking changes. Rate limiting and authentication on all endpoints. Stripe webhooks for payment events fully implemented and tested.

**Rationale**: n8n integrations and future third-party partnerships require stable, documented APIs. Stripe integration requires reliable webhook handling for subscription management.

### III. Security & Privacy by Design (NON-NEGOTIABLE)

Row-Level Security (RLS) policies required on all Supabase tables. Authentication via Supabase Auth (email/password + social OAuth). User data encrypted at rest and in transit. GDPR compliance: data export, deletion, and consent management. Security audits on sensitive features (payments via Stripe, personal data, affiliate tracking). No sensitive data in client-side code or logs. PCI compliance for payment handling through Stripe integration only (never store card details).

**Rationale**: Handling user personal data, payment info, travel documents, and affiliate commissions requires fortress-level security. Legal compliance is non-negotiable.

### IV. Modular Content Architecture

Courses, resources, membership management, affiliate program, and Discord integration MUST be independently deployable modules. Content types (courses, visa info, accommodation) use shared content management patterns. Supabase tables organized by domain (courses, resources, memberships, affiliates, users). Each module has dedicated API routes and database schema. Content versioning for course updates without breaking student progress. Affiliate tracking uses unique referral codes with attribution stored in database.

**Rationale**: Platform will grow rapidly; modular design prevents technical debt and enables parallel development. Affiliate program requires independent tracking system.

### V. Test-Driven Development (TDD)

Tests written → User approved → Tests fail → Then implement (Red-Green-Refactor). Unit tests for business logic (utilities, helpers, API functions, affiliate calculations). Integration tests for Supabase interactions, n8n webhooks, and Stripe payment flows. E2E tests for critical user flows (signup, course enrollment, payment, affiliate registration). Minimum 80% code coverage on backend logic. Stripe test mode webhooks validated in CI/CD pipeline.

**Rationale**: Fast iteration requires confidence that changes don't break existing functionality. Payment and affiliate systems require extensive testing to prevent revenue loss.

### VI. Performance & User Experience

Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1. Skeleton loaders for all async content. Optimistic UI updates for user actions. Error boundaries and graceful degradation. Analytics on user behaviour to guide UX improvements. All copy MUST be in British English (favour over favor, organise over organize, centre over center). Discord integration loads asynchronously to avoid blocking main thread.

**Rationale**: Smooth, fast experience equals higher engagement and course completion rates. Consistent British English maintains brand voice for UK/EU/Australian target markets.

### VII. Global Design System & Styling Consistency (NON-NEGOTIABLE)

ALL components MUST use the global design system defined in Tailwind configuration and globals.css. Individual component styling is PROHIBITED unless explicitly required for unique functionality. Components inherit from:
- Brand colors (brand-dark-*, brand-red-*, brand-accent-*)
- Glass effects (.glass, .glass-red)
- Typography scale (font-black, text-4xl to text-8xl)
- Animations (animate-glow, animate-pulse-scale, animate-float, animate-blob, magnetic-button, card-3d)
- Spacing system (Tailwind's default scale)
- Border radius (rounded-xl, rounded-2xl, rounded-3xl)

NO custom colors, font sizes, or animations outside the design system. Changes to visual style require design system updates, not component-level overrides. This ensures brand consistency, reduces CSS bloat, and maintains the dark theme + red branding across the entire application.

**Rationale**: Inconsistent styling creates a fragmented user experience and makes maintenance impossible. Global design system ensures every page feels cohesive and premium. Component-level styling overrides lead to technical debt and visual inconsistencies.

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router) with TypeScript
  - Server-side rendering (SSR) for SEO on marketing pages
  - Static generation (SSG) for course content
  - Server Actions for mutations
- **Styling**: Tailwind CSS + Shadcn/ui component library
  - Consistent design system
  - Mobile-first responsive utilities
  - Dark mode support
- **State Management**: React Context + Zustand (for complex client state)
- **Forms**: React Hook Form + Zod validation
- **Internationalisation**: All copy in British English
- **Testing**: Jest + React Testing Library + Playwright (E2E)

### Backend
- **Database**: Supabase PostgreSQL
  - Row-Level Security (RLS) for multi-tenant data isolation
  - Realtime subscriptions for live notifications
- **Authentication**: Supabase Auth
  - Email/password + Google/GitHub OAuth
  - Magic link authentication for passwordless flow
- **Storage**: Supabase Storage for course videos, user uploads
- **Functions**: Supabase Edge Functions (Deno)
  - Stripe payment webhook handlers
  - n8n integration endpoints
  - Affiliate commission calculations
  - Email notifications (Resend or SendGrid)
- **Payment Processing**: Stripe
  - Subscription management for memberships
  - Webhook handling for payment events
  - Customer portal for subscription management
- **APIs**: RESTful via Next.js API Routes + Supabase PostgREST

### Infrastructure & Deployment
- **Hosting**: Vercel (Next.js) + Supabase Cloud
- **CI/CD**: GitHub Actions
  - Automated tests on PR
  - Preview deployments for branches
  - Production deployment on merge to main
- **Monitoring**: Sentry (error tracking) + Vercel Analytics
- **Integrations**: 
  - n8n (self-hosted or cloud) for workflow automation
  - Discord API for community integration (OAuth + embeds/links)
  - Stripe API for payment processing

### Development Tools
- **Version Control**: Git + GitHub
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Documentation**: README, API docs (auto-generated from OpenAPI)

## Platform Features

### Course Content
- Digital Marketing
- AI Agencies
- Amazon FBA
- Additional income streams (to be added)

### Resources
- Visa information by country
- Remote job boards and opportunities
- Accommodation options and reviews
- (Cost of living calculator reserved for separate landing page)

### Membership System
- Stripe-powered subscription tiers
- Gated content based on membership level
- Customer portal for subscription management
- Automated payment failure handling via n8n

### Affiliate Program
- Unique referral codes per user
- Commission tracking and payouts
- Affiliate dashboard with analytics
- Content sharing tools
- Attribution tracking for conversions

### Community Integration
- Discord server integration (OAuth for member verification)
- Direct links to Discord channels
- Embedded Discord widget (optional)
- Automated role assignment based on membership tier
- No native community features built into main site

## Development Workflow

### Branch Strategy
- `main` branch: production-ready code
- Feature branches: `###-feature-name` (e.g., `001-stripe-integration`)
- No direct commits to main; all changes via Pull Requests

### Code Review Requirements
- All PRs require one approval before merge
- Constitution compliance check required
- Tests passing in CI (including Stripe test mode webhooks)
- No linter errors or TypeScript errors
- British English verified in copy changes

### Quality Gates
- Pre-commit: Linter + type checking
- Pre-push: Unit tests
- CI: Full test suite + build verification + Stripe webhook tests
- Production: Manual smoke test on critical flows (payment, affiliate tracking)

### Constitution Compliance Checklist
- [ ] Mobile-first design implemented and tested
- [ ] API endpoints documented with OpenAPI
- [ ] RLS policies applied and tested
- [ ] Module independence maintained
- [ ] Tests written before implementation (TDD)
- [ ] Core Web Vitals meet requirements
- [ ] British English used in all copy
- [ ] Global design system used (no component-level styling)
- [ ] Stripe integration follows PCI compliance
- [ ] n8n webhooks properly authenticated

## Governance

### Constitution Authority
This constitution supersedes all other development practices. All PRs must verify compliance with core principles. Any complexity introduced must be justified against simplicity principle. Payment and affiliate systems require extra scrutiny for security and accuracy.

### Amendment Process
1. Proposal submitted with rationale
2. Team review and discussion
3. Approval requires consensus
4. Version bump following semantic versioning
5. Migration plan documented if needed
6. Constitution compliance checklist updated

### Compliance Review
- **Weekly**: Review PRs for principle adherence
- **Monthly**: Audit codebase for technical debt, security vulnerabilities
- **Quarterly**: Reassess principles based on learnings, user feedback, and platform growth

### Version Management
- **MAJOR**: Breaking changes to principles (e.g., architecture pivot)
- **MINOR**: New principle added or expanded guidance
- **PATCH**: Clarifications, wording improvements

### Runtime Development Guidance
For detailed implementation guidance, developers should reference `CLAUDE.md` in the project root and this constitution during feature development.

**Version**: 1.0.0 | **Ratified**: 2025-10-08 | **Last Amended**: 2025-10-08