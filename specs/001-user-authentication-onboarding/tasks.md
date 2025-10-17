# Tasks: User Authentication & Onboarding

**Feature**: 001-user-authentication-onboarding  
**Input**: Design documents from `/specs/001-user-authentication-onboarding/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-spec.json

**Tests**: This feature follows TDD (Constitution Principle V) - tests are written FIRST before implementation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This project uses Next.js App Router structure:
- **Source**: `src/` at repository root
- **Tests**: `tests/` at repository root
- **Migrations**: `supabase/migrations/`
- **Config**: Root directory

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] **T001** Create Next.js 14+ project with TypeScript and App Router
  - Run: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
  - Configure `next.config.js` with Supabase domains
  
- [ ] **T002** [P] Install core dependencies
  - `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs`
  - `npm install react-hook-form @hookform/resolvers zod`
  - `npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge`
  
- [ ] **T003** [P] Install development dependencies
  - `npm install -D @types/node @types/react jest @testing-library/react @testing-library/jest-dom`
  - `npm install -D @playwright/test eslint prettier`
  
- [ ] **T004** [P] Configure TypeScript
  - Update `tsconfig.json` with strict mode and path aliases
  - Configure `@/*` alias for imports
  
- [ ] **T005** [P] Configure ESLint and Prettier
  - Create `.eslintrc.json` with Next.js + TypeScript rules
  - Create `.prettierrc` with project formatting rules
  
- [ ] **T006** Initialize Supabase CLI and local development
  - Run: `supabase init`
  - Run: `supabase start` (requires Docker)
  - Save connection details from output
  
- [ ] **T007** Create environment configuration
  - Create `.env.local.example` with all required variables
  - Create `.env.local` with local Supabase credentials
  - Add `.env.local` to `.gitignore`
  
- [ ] **T008** [P] Setup project structure
  - Create `/src/app/(auth)/` directory (auth layout group)
  - Create `/src/app/(dashboard)/` directory (authenticated layout group)
  - Create `/src/app/api/v1/` directory (API routes)
  - Create `/src/features/auth/` directory (auth module)
  - Create `/src/lib/supabase/` directory (Supabase utilities)
  - Create `/src/components/ui/` directory (Shadcn/ui components)
  
- [ ] **T009** Configure Tailwind CSS
  - Update `tailwind.config.ts` with custom theme (British English colors/labels)
  - Add Shadcn/ui configuration
  - Create `src/app/globals.css` with base styles and mobile-first breakpoints
  
- [ ] **T010** [P] Setup testing infrastructure
  - Create `jest.config.js` for unit tests
  - Create `playwright.config.ts` for E2E tests
  - Create `/tests/unit/`, `/tests/integration/`, `/tests/e2e/` directories
  - Add test scripts to `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Migrations

- [ ] **T011** Create profiles table migration
  - File: `supabase/migrations/20251008_001_create_profiles_table.sql`
  - Include: profiles table schema, indexes, updated_at trigger, auto-profile-creation trigger
  - Run: `supabase db push`
  
- [ ] **T012** Create auth_logs table migration
  - File: `supabase/migrations/20251008_002_create_auth_logs_table.sql`
  - Include: auth_logs table schema, indexes, RLS policies, cleanup function
  - Run: `supabase db push`
  
- [ ] **T013** Create database functions migration
  - File: `supabase/migrations/20251008_003_create_functions.sql`
  - Include: `check_failed_login_attempts()`, `get_user_profile()`, `soft_delete_user()`
  - Run: `supabase db push`
  
- [ ] **T014** Configure storage bucket migration
  - File: `supabase/migrations/20251008_004_configure_storage.sql`
  - Include: Create `avatars` bucket, RLS policies for upload/view/delete
  - Run: `supabase db push`
  
- [ ] **T015** Generate TypeScript types from database schema
  - Run: `supabase gen types typescript --local > src/lib/supabase/types.ts`
  - Verify types compile with `npm run type-check`

### Core Libraries & Utilities

- [ ] **T016** [P] Create Supabase client utilities
  - File: `src/lib/supabase/client.ts` (browser client)
  - File: `src/lib/supabase/server.ts` (server component client)
  - File: `src/lib/supabase/middleware.ts` (route handler client)
  - Export typed clients using generated types
  
- [ ] **T017** [P] Create validation schemas
  - File: `src/features/auth/lib/validation.ts`
  - Schemas: signupSchema, loginSchema, resetPasswordSchema, updatePasswordSchema, profileSchema
  - Use Zod with British English error messages
  
- [ ] **T018** [P] Create auth error handling utilities
  - File: `src/lib/utils/errors.ts`
  - Functions: formatAuthError(), isAuthError(), getErrorMessage()
  - Map Supabase errors to user-friendly British English messages
  
- [ ] **T019** [P] Create API response helpers
  - File: `src/lib/utils/response.ts`
  - Functions: successResponse(), errorResponse(), validationErrorResponse()
  - Standardize JSON API responses
  
- [ ] **T020** [P] Create auth constants
  - File: `src/features/auth/constants/validation-rules.ts` (password rules, email rules)
  - File: `src/features/auth/constants/error-messages.ts` (error messages in British English)
  - File: `src/features/auth/constants/routes.ts` (auth route constants)

### Core Auth Infrastructure

- [ ] **T021** Create Next.js middleware for auth
  - File: `middleware.ts` (root directory)
  - Implement: Session refresh, protected route checking, redirect logic
  - Test: Unauthenticated users redirected to /login
  
- [ ] **T022** [P] Create auth service layer
  - File: `src/features/auth/lib/auth-service.ts`
  - Functions: signUp(), signIn(), signOut(), resetPassword(), updatePassword()
  - Wrap Supabase Auth with error handling and logging
  
- [ ] **T023** [P] Create session manager
  - File: `src/features/auth/lib/session-manager.ts`
  - Functions: getSession(), refreshSession(), terminateSession(), terminateAllSessions()
  - Handle 7-day session duration
  
- [ ] **T024** [P] Create security utilities
  - File: `src/features/auth/lib/security.ts`
  - Functions: logAuthEvent(), checkFailedLoginAttempts(), sendSecurityAlert()
  - Implement failed login tracking (5 attempts in 10 minutes)

### Shared UI Components (Shadcn/ui)

- [ ] **T025** [P] Install Shadcn/ui components
  - Run: `npx shadcn-ui@latest add button input form label alert skeleton`
  - Components: Button, Input, Form, Label, Alert, Skeleton (loading states)
  - Customize for mobile-first (44x44px min tap targets)
  
- [ ] **T026** [P] Create auth error boundary
  - File: `src/features/auth/components/AuthErrorBoundary.tsx`
  - Catch and display auth errors gracefully
  - Include retry logic for transient failures
  
- [ ] **T027** [P] Create loading components
  - File: `src/features/auth/components/LoadingSpinner.tsx`
  - File: `src/features/auth/components/FormSkeleton.tsx`
  - Mobile-optimized skeleton loaders

### Base Layouts

- [ ] **T028** Create auth layout
  - File: `src/app/(auth)/layout.tsx`
  - Layout for login, signup, password reset pages
  - Mobile-first, centered card design
  
- [ ] **T029** Create dashboard layout
  - File: `src/app/(dashboard)/layout.tsx`
  - Layout for authenticated pages
  - Include header with logout, profile link

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Email/Password Account Creation (Priority: P1) 🎯 MVP

**Goal**: Allow prospective digital nomads to create accounts with email/password and verify their email to activate their account.

**Independent Test**: Visit signup page, enter valid credentials, receive verification email, click link, verify account is activated and accessible.

### Tests for User Story 1 (TDD - Write First, Ensure FAIL)

- [ ] **T030** [P] [US1] Unit test: Email validation
  - File: `tests/unit/auth/validation.test.ts`
  - Test: signupSchema rejects invalid emails, accepts valid emails
  - Test: Real-time validation feedback
  
- [ ] **T031** [P] [US1] Unit test: Password strength validation
  - File: `tests/unit/auth/validation.test.ts`
  - Test: Password meets complexity requirements (8+ chars, mixed case, number, special char)
  - Test: Weak passwords rejected with specific error messages
  
- [ ] **T032** [P] [US1] Integration test: Signup flow
  - File: `tests/integration/auth/signup.test.ts`
  - Test: User can sign up with valid credentials
  - Test: Verification email is sent
  - Test: Duplicate email returns error
  - Test: Profile is auto-created on signup
  
- [ ] **T033** [P] [US1] Integration test: Email verification
  - File: `tests/integration/auth/email-verification.test.ts`
  - Test: Verification link activates account
  - Test: Expired link (>24h) shows error
  - Test: User redirected to dashboard after verification
  
- [ ] **T034** [P] [US1] E2E test: Complete signup journey
  - File: `tests/e2e/auth/signup-flow.spec.ts`
  - Test: Full flow from signup page to verified dashboard access
  - Test: Mobile viewport (375x667)

### Implementation for User Story 1

- [ ] **T035** [P] [US1] Create SignupForm component
  - File: `src/features/auth/components/SignupForm.tsx`
  - Include: Email input, password input, real-time validation, loading states
  - Use React Hook Form + Zod validation
  - British English copy: "Create your account", "Email address", "Password"
  
- [ ] **T036** [P] [US1] Create PasswordRequirements component
  - File: `src/features/auth/components/PasswordRequirements.tsx`
  - Display: 8+ characters, uppercase, lowercase, number, special character
  - Real-time feedback with checkmarks
  
- [ ] **T037** [US1] Create signup page
  - File: `src/app/(auth)/signup/page.tsx`
  - Server Component with SignupForm
  - Include: "Already have an account? Log in" link
  - Mobile-optimized layout
  
- [ ] **T038** [US1] Create signup API route
  - File: `src/app/api/v1/auth/signup/route.ts`
  - POST handler: Validate input, call Supabase Auth signUp
  - Send verification email with redirect to /verify-email
  - Return success or validation errors
  
- [ ] **T039** [US1] Create email verification page
  - File: `src/app/(auth)/verify-email/page.tsx`
  - Handle verification token from URL
  - Call Supabase verifyOtp
  - Redirect to dashboard on success, show error on failure
  
- [ ] **T040** [US1] Create email verification API route
  - File: `src/app/api/v1/auth/verify-email/route.ts`
  - POST handler: Verify email token
  - Log auth event (email_verified)
  - Return success or error
  
- [ ] **T041** [US1] Create email templates
  - File: `src/lib/email/templates/verification.tsx`
  - React Email template for verification email
  - British English: "Verify your email address"
  - Include 24-hour expiry note
  
- [ ] **T042** [US1] Configure Supabase Auth email templates
  - Update: Supabase Dashboard → Authentication → Email Templates
  - Customize verification email with British English copy
  - Set redirect URL to `${NEXT_PUBLIC_APP_URL}/verify-email`

**Checkpoint**: User Story 1 complete - users can sign up and verify email. Test independently before proceeding.

---

## Phase 4: User Story 4 - Login with Email/Password (Priority: P1)

**Goal**: Allow returning users to access their accounts by providing email and password.

**Independent Test**: Navigate to login page, enter valid credentials, verify successful access to dashboard.

**Note**: This is implemented before US3 (Password Reset) because login is a prerequisite for password reset testing.

### Tests for User Story 4 (TDD - Write First, Ensure FAIL)

- [ ] **T043** [P] [US4] Integration test: Login flow
  - File: `tests/integration/auth/login.test.ts`
  - Test: User can log in with correct credentials
  - Test: Wrong password shows error
  - Test: Unverified email blocked from login
  - Test: Session persists for 7 days
  
- [ ] **T044** [P] [US4] Integration test: Failed login tracking
  - File: `tests/integration/auth/failed-logins.test.ts`
  - Test: 5 failed attempts in 10 minutes triggers security email
  - Test: Email contains timestamp, IP, password reset link
  
- [ ] **T045** [P] [US4] E2E test: Login and session persistence
  - File: `tests/e2e/auth/login-flow.spec.ts`
  - Test: Login, close browser, return within 7 days → still logged in
  - Test: "Remember me" extends session
  - Test: Mobile viewport

### Implementation for User Story 4

- [ ] **T046** [P] [US4] Create LoginForm component
  - File: `src/features/auth/components/LoginForm.tsx`
  - Include: Email input, password input, "Remember me" checkbox, loading states
  - Use React Hook Form + Zod validation
  - British English: "Log in to your account", "Forgot password?" link
  
- [ ] **T047** [US4] Create login page
  - File: `src/app/(auth)/login/page.tsx`
  - Server Component with LoginForm
  - Include: "Don't have an account? Sign up" link
  - Mobile-optimized layout
  
- [ ] **T048** [US4] Create login API route
  - File: `src/app/api/v1/auth/login/route.ts`
  - POST handler: Validate input, call Supabase Auth signInWithPassword
  - Check email verification status (FR-005)
  - Handle "Remember me" for extended session
  - Log auth event (login or failed_login)
  - Return session or error
  
- [ ] **T049** [US4] Create logout API route
  - File: `src/app/api/v1/auth/logout/route.ts`
  - POST handler: Call Supabase Auth signOut
  - Clear session cookies
  - Log auth event (logout)
  
- [ ] **T050** [US4] Implement failed login tracking
  - File: `src/features/auth/lib/security.ts` (add to existing)
  - Function: trackFailedLogin() - increment counter in auth_logs
  - Function: checkAndAlertFailedLogins() - check 5 in 10 min, send email
  
- [ ] **T051** [US4] Create security alert email template
  - File: `src/lib/email/templates/security-alert.tsx`
  - British English: "Security Alert: Multiple Failed Login Attempts"
  - Include: Attempt count, timestamp, IP, password reset link
  
- [ ] **T052** [US4] Create dashboard page (placeholder)
  - File: `src/app/(dashboard)/dashboard/page.tsx`
  - Simple authenticated page showing user email
  - Includes logout button
  - Used to verify login works

**Checkpoint**: User Story 4 complete - users can log in and sessions persist. Test independently.

---

## Phase 5: User Story 3 - Password Reset (Priority: P1)

**Goal**: Allow users who forgot their password to regain access via email link.

**Independent Test**: Click "Forgot password?", enter email, receive reset email, set new password, log in with new credentials.

### Tests for User Story 3 (TDD - Write First, Ensure FAIL)

- [ ] **T053** [P] [US3] Integration test: Password reset request
  - File: `tests/integration/auth/password-reset.test.ts`
  - Test: Reset email sent for existing account
  - Test: Generic message shown for non-existent email (no enumeration)
  - Test: Reset link valid for 1 hour
  
- [ ] **T054** [P] [US3] Integration test: Password reset completion
  - File: `tests/integration/auth/password-reset.test.ts`
  - Test: User can set new password with valid token
  - Test: Expired token (>1h) rejected
  - Test: Old token invalidated when new one requested
  - Test: User can log in with new password
  
- [ ] **T055** [P] [US3] E2E test: Complete password reset flow
  - File: `tests/e2e/auth/password-reset-flow.spec.ts`
  - Test: Full flow from forgot password → email → new password → login
  - Test: Mobile viewport

### Implementation for User Story 3

- [ ] **T056** [P] [US3] Create ResetPasswordForm component
  - File: `src/features/auth/components/ResetPasswordForm.tsx`
  - Email input only
  - British English: "Reset your password", "Enter your email address"
  
- [ ] **T057** [P] [US3] Create UpdatePasswordForm component
  - File: `src/features/auth/components/UpdatePasswordForm.tsx`
  - New password input with PasswordRequirements
  - Confirm password field
  
- [ ] **T058** [US3] Create reset password request page
  - File: `src/app/(auth)/reset-password/page.tsx`
  - Server Component with ResetPasswordForm
  - Show: "Check your email for reset instructions" after submission
  
- [ ] **T059** [US3] Create update password page
  - File: `src/app/(auth)/update-password/page.tsx`
  - Server Component with UpdatePasswordForm
  - Handle reset token from URL query parameter
  - Show success message and login link after password update
  
- [ ] **T060** [US3] Create reset password API route
  - File: `src/app/api/v1/auth/reset-password/route.ts`
  - POST handler: Call Supabase Auth resetPasswordForEmail
  - Generic success message (no email enumeration)
  - Log auth event (password_reset_request)
  
- [ ] **T061** [US3] Create update password API route
  - File: `src/app/api/v1/auth/update-password/route.ts`
  - POST handler: Verify token, update password with Supabase Auth updateUser
  - Invalidate all existing sessions
  - Log auth event (password_reset_complete)
  - Return success or error
  
- [ ] **T062** [US3] Create password reset email template
  - File: `src/lib/email/templates/password-reset.tsx`
  - British English: "Reset your LeaveLab password"
  - Include: Reset button, 1-hour expiry note, ignore message
  
- [ ] **T063** [US3] Configure Supabase password reset emails
  - Update: Supabase Dashboard → Authentication → Email Templates
  - Customize password reset email with British English
  - Set redirect URL to `${NEXT_PUBLIC_APP_URL}/update-password`
  
- [ ] **T064** [US3] Add "Forgot password?" link to login page
  - Update: `src/app/(auth)/login/page.tsx`
  - Link to /reset-password

**Checkpoint**: User Story 3 complete - users can reset forgotten passwords. Test independently.

---

## Phase 6: User Story 2 - Google OAuth Account Creation & Login (Priority: P2)

**Goal**: Allow users to quickly create accounts or log in using their Google accounts.

**Independent Test**: Click "Continue with Google", authorize in Google, verify account created or logged in.

### Tests for User Story 2 (TDD - Write First, Ensure FAIL)

- [ ] **T065** [P] [US2] Integration test: Google OAuth signup
  - File: `tests/integration/auth/oauth.test.ts`
  - Test: New user creates account via Google
  - Test: Profile auto-created with Google name/avatar
  
- [ ] **T066** [P] [US2] Integration test: Google OAuth login
  - File: `tests/integration/auth/oauth.test.ts`
  - Test: Existing Google user can log in
  - Test: Email/password account automatically linked to Google (same email)
  - Test: Notification shown: "Google account linked successfully"
  
- [ ] **T067** [P] [US2] Integration test: OAuth cancellation
  - File: `tests/integration/auth/oauth.test.ts`
  - Test: User cancels Google auth → returned to login with message
  
- [ ] **T068** [P] [US2] E2E test: Google OAuth flow
  - File: `tests/e2e/auth/oauth-flow.spec.ts`
  - Test: Complete Google OAuth signup/login
  - Note: May require test Google account or mocking

### Implementation for User Story 2

- [ ] **T069** [P] [US2] Create GoogleOAuthButton component
  - File: `src/features/auth/components/GoogleOAuthButton.tsx`
  - Google-styled button: "Continue with Google"
  - Loading state during OAuth redirect
  
- [ ] **T070** [US2] Add Google OAuth to signup page
  - Update: `src/app/(auth)/signup/page.tsx`
  - Add GoogleOAuthButton above form
  - Divider: "or sign up with email"
  
- [ ] **T071** [US2] Add Google OAuth to login page
  - Update: `src/app/(auth)/login/page.tsx`
  - Add GoogleOAuthButton above form
  - Divider: "or log in with email"
  
- [ ] **T072** [US2] Create Google OAuth initiation route
  - File: `src/app/api/v1/auth/oauth/google/route.ts`
  - GET handler: Initiate Google OAuth with Supabase Auth
  - Redirect to Google authorization screen
  - Set redirect_to query parameter for post-auth redirect
  
- [ ] **T073** [US2] Create OAuth callback handler
  - File: `src/app/api/v1/auth/oauth/callback/route.ts`
  - GET handler: Handle OAuth callback from Google
  - Exchange code for session
  - Check for account linking (email match)
  - Log auth event (oauth_linked if applicable)
  - Redirect to dashboard or show linking notification
  
- [ ] **T074** [US2] Configure Google OAuth in Supabase
  - Supabase Dashboard → Authentication → Providers → Google
  - Enable Google provider
  - Add Google Client ID and Secret (from Google Cloud Console)
  - Set redirect URI: `${SUPABASE_URL}/auth/v1/callback`
  
- [ ] **T075** [US2] Implement account linking notification
  - Update: `src/app/(dashboard)/dashboard/page.tsx`
  - Show alert if `?oauth_linked=true` in URL
  - Message: "Google account linked successfully"

**Checkpoint**: User Story 2 complete - users can sign up/login with Google. Test independently.

---

## Phase 7: User Story 5 - Profile Management (Priority: P2)

**Goal**: Allow logged-in users to view and update their profile information (name, avatar, bio, preferences).

**Independent Test**: Log in, navigate to profile settings, update display name and upload avatar, verify changes persist.

### Tests for User Story 5 (TDD - Write First, Ensure FAIL)

- [ ] **T076** [P] [US5] Integration test: Profile updates
  - File: `tests/integration/auth/profile-update.test.ts`
  - Test: User can update display name
  - Test: User can update bio
  - Test: User can update timezone/language preferences
  - Test: Changes persist across sessions
  
- [ ] **T077** [P] [US5] Integration test: Avatar upload
  - File: `tests/integration/auth/avatar-upload.test.ts`
  - Test: User can upload JPG/PNG/WebP (under 5MB)
  - Test: Oversized file rejected
  - Test: Unsupported format rejected
  - Test: Old avatar replaced by new upload
  
- [ ] **T078** [P] [US5] Integration test: Email change
  - File: `tests/integration/auth/email-change.test.ts`
  - Test: Email change sends verification to new address
  - Test: Change not applied until verified
  - Test: User can log in with old email until verification
  
- [ ] **T079** [P] [US5] E2E test: Profile management
  - File: `tests/e2e/auth/profile-management.spec.ts`
  - Test: Update profile, upload avatar, verify in UI
  - Test: Unsaved changes warning

### Implementation for User Story 5

- [ ] **T080** [P] [US5] Create useProfile hook
  - File: `src/features/auth/hooks/useProfile.ts`
  - Functions: getProfile(), updateProfile(), uploadAvatar()
  - Integrate with Supabase client
  
- [ ] **T081** [P] [US5] Create ProfileForm component
  - File: `src/features/auth/components/ProfileForm.tsx`
  - Fields: Display name, bio, timezone, language
  - Use React Hook Form + Zod
  - Unsaved changes warning
  - British English labels
  
- [ ] **T082** [P] [US5] Create AvatarUpload component
  - File: `src/features/auth/components/AvatarUpload.tsx`
  - File input with drag-and-drop
  - Image preview
  - Client-side compression to 800x800, 80% quality
  - Format/size validation
  
- [ ] **T083** [US5] Create profile page
  - File: `src/app/(dashboard)/profile/page.tsx`
  - Server Component loading initial profile data
  - ProfileForm and AvatarUpload components
  - Success/error toasts
  
- [ ] **T084** [US5] Create get profile API route
  - File: `src/app/api/v1/profile/route.ts`
  - GET handler: Fetch profile from profiles table
  - Include user data from auth.users
  - Return combined profile object
  
- [ ] **T085** [US5] Create update profile API route
  - File: `src/app/api/v1/profile/route.ts`
  - PATCH handler: Update profiles table
  - Validate input (display name, bio, timezone, language)
  - Log profile update
  - Return updated profile
  
- [ ] **T086** [US5] Create avatar upload API route
  - File: `src/app/api/v1/profile/avatar/route.ts`
  - POST handler: Upload to Supabase Storage avatars bucket
  - Validate file type and size
  - Compress image on server if needed
  - Update profile.avatar_url
  - Return public URL
  
- [ ] **T087** [US5] Create image compression utility
  - File: `src/lib/utils/image.ts`
  - Function: compressImage() - resize to max dimensions, compress quality
  - Support: JPG, PNG, WebP
  - Return: Blob ready for upload
  
- [ ] **T088** [US5] Implement email change flow
  - Update: Profile API route to handle email change requests
  - Send verification email to new address
  - Supabase Auth handles verification
  - Old email remains active until new email verified

**Checkpoint**: User Story 5 complete - users can manage their profiles. Test independently.

---

## Phase 8: User Story 6 - Account Settings & Password Change (Priority: P3)

**Goal**: Allow users to manage account security settings (change password, view sessions, manage OAuth, delete account).

**Independent Test**: Log in, navigate to account settings, change password, verify new password works for login.

### Tests for User Story 6 (TDD - Write First, Ensure FAIL)

- [ ] **T089** [P] [US6] Integration test: Password change
  - File: `tests/integration/auth/password-change.test.ts`
  - Test: User can change password with correct current password
  - Test: Wrong current password rejected
  - Test: New password must meet strength requirements
  - Test: User can log in with new password
  
- [ ] **T090** [P] [US6] Integration test: Session management
  - File: `tests/integration/auth/session-management.test.ts`
  - Test: User can view active sessions
  - Test: User can terminate all sessions
  - Test: Other sessions logged out, current session remains
  
- [ ] **T091** [P] [US6] Integration test: Account deletion
  - File: `tests/integration/auth/account-deletion.test.ts`
  - Test: User can soft-delete account
  - Test: Deleted account cannot log in
  - Test: GDPR data export works before deletion
  
- [ ] **T092** [P] [US6] E2E test: Account settings
  - File: `tests/e2e/auth/account-settings.spec.ts`
  - Test: Change password, log out, log in with new password
  - Test: View sessions, log out all devices

### Implementation for User Story 6

- [ ] **T093** [P] [US6] Create ChangePasswordForm component
  - File: `src/features/auth/components/ChangePasswordForm.tsx`
  - Fields: Current password, new password, confirm new password
  - Password requirements validation
  - Success/error feedback
  
- [ ] **T094** [P] [US6] Create SessionsList component
  - File: `src/features/auth/components/SessionsList.tsx`
  - Display: Active sessions with device info, last activity
  - Action: "Log out all devices" button
  
- [ ] **T095** [P] [US6] Create ConnectedAccounts component
  - File: `src/features/auth/components/ConnectedAccounts.tsx`
  - Display: Which OAuth providers are linked (Google)
  - Action: Link email/password auth if only OAuth exists
  
- [ ] **T096** [P] [US6] Create AccountDeletion component
  - File: `src/features/auth/components/AccountDeletion.tsx`
  - Warning message about 30-day recovery period
  - Confirmation modal
  - "Delete my account" button
  
- [ ] **T097** [US6] Create account settings page
  - File: `src/app/(dashboard)/settings/page.tsx`
  - Tabs: Security, Sessions, Connected Accounts, Data & Privacy
  - Components: ChangePasswordForm, SessionsList, ConnectedAccounts, AccountDeletion
  
- [ ] **T098** [US6] Create change password API route
  - File: `src/app/api/v1/account/change-password/route.ts`
  - POST handler: Verify current password, update to new password
  - Call Supabase Auth updateUser
  - Log auth event (password_change)
  - Return success or error
  
- [ ] **T099** [US6] Create sessions API routes
  - File: `src/app/api/v1/account/sessions/route.ts`
  - GET handler: List active sessions from auth.sessions
  - DELETE handler: Terminate all sessions except current
  - Log auth event (logout for each terminated session)
  
- [ ] **T100** [US6] Create account deletion API route
  - File: `src/app/api/v1/account/route.ts`
  - DELETE handler: Soft-delete by setting profiles.deleted_at
  - Call soft_delete_user() database function
  - Log auth event (account_deleted)
  - Sign out user
  - Return success message with 30-day recovery note
  
- [ ] **T101** [US6] Create data export API route
  - File: `src/app/api/v1/account/export/route.ts`
  - GET handler: Export all user data (GDPR compliance)
  - Collect: profile, auth_logs, (future: courses, memberships)
  - Return: JSON file download
  - British English filename: `leavelab-data-{user_id}.json`
  
- [ ] **T102** [US6] Implement OAuth provider management
  - Update: Connected accounts to show link status
  - Allow: Adding email/password to OAuth-only accounts
  - API: Endpoint to set password for OAuth users

**Checkpoint**: User Story 6 complete - users can manage account security. Test independently.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Testing & Quality

- [ ] **T103** [P] Run full test suite and verify 80% coverage
  - Run: `npm run test:coverage`
  - Verify: >80% coverage on `/src/features/auth/lib/`
  - Fix: Any failing tests
  
- [ ] **T104** [P] Run E2E tests on mobile viewports
  - Test: All E2E tests on 375x667 (iPhone SE)
  - Test: All E2E tests on 360x640 (Android)
  - Fix: Any mobile-specific issues
  
- [ ] **T105** [P] Security audit
  - Check: All RLS policies active on Supabase tables
  - Check: No sensitive data in client-side code
  - Check: HTTPS enforced in production
  - Check: Rate limiting configured on API routes

### Performance & UX

- [ ] **T106** [P] Lighthouse audit on all auth pages
  - Target: >90 Performance, >90 Accessibility, >90 Best Practices, 100 SEO
  - Test: /signup, /login, /reset-password on mobile
  - Fix: Any issues below targets
  
- [ ] **T107** [P] Optimize images and assets
  - Compress: All static images
  - Configure: Next.js Image component for avatars
  - Add: Lazy loading for below-the-fold content
  
- [ ] **T108** [P] Implement skeleton loaders
  - Add: Skeleton states to all async operations
  - Ensure: No layout shift (CLS <0.1)
  - Test: On slow 3G network throttling
  
- [ ] **T109** [P] Error boundary testing
  - Test: AuthErrorBoundary catches and displays errors
  - Test: Retry logic works
  - Test: Fallback UI is user-friendly

### Documentation

- [ ] **T110** [P] Update API documentation
  - Generate: OpenAPI spec from route handlers
  - Verify: All endpoints in `contracts/api-spec.json` implemented
  - Add: Postman collection for API testing
  
- [ ] **T111** [P] Create component documentation
  - Document: All auth components in Storybook (optional) or README
  - Include: Props, usage examples, mobile considerations
  
- [ ] **T112** [P] Update quickstart.md
  - Verify: Setup instructions work end-to-end
  - Add: Troubleshooting for common issues
  - Update: Environment variable examples

### n8n Integration

- [ ] **T113** [P] Create n8n webhook endpoints
  - File: `src/app/api/v1/webhooks/n8n/auth-events/route.ts`
  - Trigger: On signup, login, password_change, account_deleted
  - Payload: User ID, event type, timestamp
  
- [ ] **T114** [P] Create n8n security alerts webhook
  - File: `src/app/api/v1/webhooks/n8n/security-alerts/route.ts`
  - Trigger: On 5 failed logins
  - Payload: User ID, attempt count, IP address
  
- [ ] **T115** Configure n8n workflows (manual)
  - Setup: n8n instance or cloud account
  - Create: Workflows for onboarding emails, security alerts
  - Test: Webhooks trigger correctly

### Final Validation

- [ ] **T116** Validate all 33 functional requirements
  - Go through: FR-001 through FR-033 in spec.md
  - Test: Each requirement met
  - Document: Any exceptions or future work
  
- [ ] **T117** Verify British English throughout
  - Check: All UI copy uses British spelling
  - Examples: "Authorise", "Organise", "Centre", "Colour"
  - Fix: Any American English found
  
- [ ] **T118** Run constitution compliance check
  - Verify: All 6 core principles met
  - Document: Constitution compliance in CLAUDE.md
  - Note: Any deviations with justification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Setup completion - **BLOCKS all user stories**
- **Phase 3 (US1 - Signup)**: Depends on Foundational completion
- **Phase 4 (US4 - Login)**: Depends on US1 (need users to exist to test login)
- **Phase 5 (US3 - Password Reset)**: Depends on US1 and US4 (need login functionality to test reset)
- **Phase 6 (US2 - OAuth)**: Depends on US1 and US4 (can proceed in parallel with US3)
- **Phase 7 (US5 - Profile)**: Depends on US4 (need login to access profile)
- **Phase 8 (US6 - Settings)**: Depends on US4 and US5 (need login and profile)
- **Phase 9 (Polish)**: Depends on all desired user stories being complete

### Critical Path (Minimum Viable Product)

For MVP, implement in this order:
1. Phase 1: Setup (T001-T010)
2. Phase 2: Foundational (T011-T029) ← **CRITICAL BLOCKER**
3. Phase 3: US1 - Signup (T030-T042)
4. Phase 4: US4 - Login (T043-T052)
5. Phase 5: US3 - Password Reset (T053-T064)

**Stop here for MVP** - This delivers core authentication with 3 P1 user stories complete.

### Full Feature Delivery

After MVP, add remaining stories:
6. Phase 6: US2 - OAuth (T065-T075)
7. Phase 7: US5 - Profile (T076-T088)
8. Phase 8: US6 - Settings (T089-T102)
9. Phase 9: Polish (T103-T118)

### Parallel Opportunities

Tasks marked **[P]** can run in parallel within their phase:

**Setup Phase**:
- T002, T003, T004, T005, T008, T010 can all run simultaneously

**Foundational Phase**:
- T016, T017, T018, T019, T020 (core libraries) can run simultaneously
- T022, T023, T024 (auth services) can run simultaneously
- T025, T026, T027 (UI components) can run simultaneously

**Within Each User Story**:
- All tests for a story can run in parallel
- Independent components for a story can run in parallel
- API routes for a story can be built in parallel

**Across User Stories** (after Foundational):
- US2 (OAuth) and US3 (Password Reset) can proceed in parallel after US1+US4 complete
- Different team members can work on different stories simultaneously

---

## Parallel Example: User Story 1 (Signup)

```bash
# Tests (all in parallel):
T030: Unit test - Email validation
T031: Unit test - Password strength
T032: Integration test - Signup flow
T033: Integration test - Email verification
T034: E2E test - Complete signup

# Components (in parallel):
T035: SignupForm component
T036: PasswordRequirements component

# Then (sequential):
T037: Signup page (uses T035, T036)
T038: Signup API route
T039: Email verification page
T040: Email verification API route
T041: Email templates
T042: Configure Supabase
```

---

## Implementation Strategy

### TDD Approach (Constitution Requirement)

For EVERY task:
1. **Write test FIRST** (ensure it FAILS)
2. Run test: `npm run test` → RED ❌
3. **Implement feature** to pass test
4. Run test: `npm run test` → GREEN ✅
5. **Refactor** if needed
6. Run test: `npm run test` → Still GREEN ✅
7. Commit

### MVP First (Recommended)

Complete minimum viable authentication:

1. **Phase 1**: Setup (T001-T010) → ~2 hours
2. **Phase 2**: Foundational (T011-T029) → ~8 hours
3. **Phase 3**: US1 - Signup (T030-T042) → ~6 hours
4. **Phase 4**: US4 - Login (T043-T052) → ~4 hours
5. **Phase 5**: US3 - Password Reset (T053-T064) → ~4 hours

**Total MVP: ~24 hours** (3 days)

**Stop and validate**: Deploy to staging, test end-to-end, gather feedback.

### Incremental Delivery

After MVP, add one story at a time:

1. **Add US2** (OAuth) → ~4 hours → Deploy & test
2. **Add US5** (Profile) → ~5 hours → Deploy & test
3. **Add US6** (Settings) → ~5 hours → Deploy & test
4. **Polish** (Phase 9) → ~4 hours → Final deployment

**Total Full Feature: ~42 hours** (5-6 days)

### Parallel Team Strategy

With 2-3 developers:

**Week 1**:
- All: Complete Setup + Foundational together (Day 1-2)
- Dev A: US1 (Signup) - Day 3
- Dev B: US4 (Login) - Day 3 (depends on US1, wait)
- Dev C: Tests + Infrastructure - Day 3

**Week 2**:
- Dev A: US3 (Password Reset) - Day 1
- Dev B: US2 (OAuth) - Day 1-2
- Dev C: US5 (Profile) - Day 1-2
- All: US6 (Settings) + Polish - Day 3

---

## Task Summary

- **Total Tasks**: 118
- **Setup**: 10 tasks
- **Foundational**: 19 tasks (CRITICAL PATH)
- **User Story 1 (P1)**: 13 tasks (5 tests + 8 implementation)
- **User Story 4 (P1)**: 10 tasks (3 tests + 7 implementation)
- **User Story 3 (P1)**: 12 tasks (3 tests + 9 implementation)
- **User Story 2 (P2)**: 11 tasks (4 tests + 7 implementation)
- **User Story 5 (P2)**: 13 tasks (4 tests + 9 implementation)
- **User Story 6 (P3)**: 14 tasks (4 tests + 10 implementation)
- **Polish**: 16 tasks

### Test Coverage

- **Unit tests**: 6 test files
- **Integration tests**: 10 test files
- **E2E tests**: 6 test files
- **Target coverage**: 80% on `/src/features/auth/lib/`

### Independent Test Criteria

Each user story can be tested independently:

- **US1**: Sign up new user → verify email → check dashboard access
- **US4**: Log in with credentials → verify session persists 7 days
- **US3**: Request password reset → use link → log in with new password
- **US2**: Click Google OAuth → authorize → verify account created/logged in
- **US5**: Log in → update profile → verify changes persist
- **US6**: Log in → change password → log out → log in with new password

---

## Notes

- **[P]** indicates tasks that can run in parallel (different files, no dependencies)
- **[Story]** label (US1, US2, etc.) maps each task to its user story for traceability
- **TDD is mandatory** per Constitution Principle V - tests MUST be written before implementation
- **Foundational phase is critical** - nothing can proceed until T011-T029 are complete
- Each user story is **independently testable** - can deploy and validate one story at a time
- **British English** required throughout (Constitution Principle VI)
- Commit frequently after each task or logical group
- **MVP scope**: Phase 1-5 (Setup + Foundational + US1 + US4 + US3)
- **Full feature**: Phase 1-9 (all user stories + polish)

---

**Ready to implement!** Start with T001 and follow TDD approach. 🚀
