# Research: User Authentication & Onboarding

**Feature**: 001-user-authentication-onboarding  
**Date**: 2025-10-08  
**Status**: Complete

## Overview

This document captures technical research and decisions for implementing authentication using Next.js 14+, Supabase Auth, and TypeScript. Research focuses on mobile-first auth UX, session management, OAuth integration, and security best practices.

---

## 1. Next.js 14 App Router + Supabase Auth Integration

### Decision

Use Supabase Auth with Next.js 14 App Router, leveraging Server Components, Server Actions, and middleware for authentication flows.

###

 Rationale

- **Server Components**: Reduce client-side JavaScript, improving mobile performance
- **Server Actions**: Simplify form submissions without custom API routes for mutations
- **Middleware**: Centralized auth checking for protected routes
- **Supabase PKC**: Proof Key for Code Exchange (PKCE) flow supported out-of-the-box for OAuth
- **Type Safety**: Full TypeScript support with generated database types

### Implementation Pattern

```typescript
// Server Component (no client JS for initial load)
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) redirect('/login')
  return <DashboardContent user={session.user} />
}

// Server Action for mutations
'use server'
export async function updateProfile(formData: FormData) {
  const supabase = createServerActionClient({ cookies })
  // mutation logic
}
```

### Alternatives Considered

- **NextAuth.js**: More boilerplate, less integrated with Supabase ecosystem
- **Clerk**: Third-party SaaS, vendor lock-in, additional cost
- **Auth0**: Enterprise-focused, overkill for current needs

### References

- [Supabase Auth with Next.js App Router](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js 14 Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)

---

## 2. OAuth Account Linking Strategy

### Decision

Implement automatic account linking when email addresses match across authentication providers (email/password and Google OAuth).

### Rationale

- **User Experience**: Seamless for users who forget which method they used
- **Data Consistency**: Single user record per email, no duplicates
- **Security**: Supabase Auth handles email verification, ensuring email ownership

### Implementation Pattern

Supabase Auth handles this automatically when configured with `autoconfirm` for OAuth providers:

```sql
-- Enable automatic account linking in Supabase
UPDATE auth.config
SET autoconfirm_email = true
WHERE provider = 'google';
```

When a user signs in with Google using an email that exists with password auth:
1. Supabase checks if email is verified
2. If verified, links the Google provider to existing account
3. User is logged in with merged identity
4. Frontend displays "Google account linked successfully"

### Alternatives Considered

- **Manual Linking**: Requires user to explicitly link accounts (more friction)
- **Separate Accounts**: Creates data inconsistency, poor UX
- **Error on Duplicate**: Blocks users from OAuth if they have password account

### References

- [Supabase OAuth Identity Linking](https://supabase.com/docs/guides/auth/auth-identity-linking)

---

## 3. Session Management & 7-Day Persistence

### Decision

Use Supabase Auth session management with 7-day JWT refresh tokens and HTTP-only cookies.

### Rationale

- **Security**: Tokens stored in HTTP-only cookies, not localStorage (XSS protection)
- **Convenience**: 7-day refresh window balances security and UX for mobile users
- **Automatic Refresh**: Supabase client auto-refreshes tokens before expiration
- **Server-Side Validation**: Sessions validated on server, not trusted client-side

### Implementation Pattern

```typescript
// Configure Supabase client with cookie-based sessions
const supabase = createClientComponentClient({
  cookies: {
    get: (name: string) => cookieStore.get(name)?.value,
    set: (name: string, value: string, options: CookieOptions) => {
      cookieStore.set({
        name,
        value,
        ...options,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    },
  },
})
```

### Configuration

```sql
-- Supabase dashboard configuration
JWT expiry: 3600 (1 hour access token)
Refresh token rotation: enabled
Refresh token expiry: 604800 (7 days)
```

### Alternatives Considered

- **24-hour sessions**: Too aggressive for mobile users, frequent re-authentication
- **30-day sessions**: Security risk for platform with personal/payment data
- **Persistent sessions (no expiry)**: Security anti-pattern

### References

- [Supabase Session Management](https://supabase.com/docs/guides/auth/sessions)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## 4. Mobile-First Form Validation & UX

### Decision

Use React Hook Form + Zod for client-side validation with real-time feedback, and Shadcn/ui components for accessible, mobile-optimized inputs.

### Rationale

- **Performance**: React Hook Form minimizes re-renders (critical for mobile)
- **Type Safety**: Zod schemas provide runtime validation + TypeScript types
- **Accessibility**: Shadcn/ui components follow ARIA guidelines
- **Mobile UX**: Large tap targets (44x44px), clear error messages, appropriate input types

### Implementation Pattern

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain a lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain a number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain a special character' }),
})

function SignupForm() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', // Validate on blur for better mobile UX
  })
  
  return (
    <Form {...form}>
      <FormField name="email" render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input 
              type="email" 
              inputMode="email" // Mobile keyboard optimization
              autoComplete="email"
              {...field} 
            />
          </FormControl>
          <FormMessage /> {/* Real-time error display */}
        </FormItem>
      )} />
    </Form>
  )
}
```

### Mobile Optimizations

- **Input Types**: `type="email"`, `inputMode="email"` for proper mobile keyboards
- **Autocomplete**: `autoComplete` attributes for password managers
- **Tap Targets**: Minimum 44x44px buttons (Shadcn/ui default: 40px, override to 44px)
- **Focus Management**: Auto-focus on errors for accessibility
- **Loading States**: Skeleton loaders during async operations

### Alternatives Considered

- **Formik**: More verbose, performance overhead
- **Uncontrolled forms**: Harder to validate incrementally
- **Server-only validation**: Poor UX, especially on slow mobile networks

### References

- [React Hook Form Best Practices](https://react-hook-form.com/advanced-usage)
- [Mobile Form Design Best Practices](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)

---

## 5. Security: Failed Login Attempts & Alert Emails

### Decision

After 5 failed login attempts within 10 minutes, send security alert email with details and password reset link. No account lockout to avoid friction.

### Rationale

- **User Awareness**: Alerts genuine users to suspicious activity
- **Password Reset Convenience**: Direct link in email reduces support burden
- **No False Positives**: Avoids locking out legitimate users who forgot password
- **Rate Limiting**: Supabase Auth provides backend rate limiting (prevents brute force at scale)

### Implementation Pattern

```typescript
// Supabase Edge Function (triggered by auth.failed_login event)
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

Deno.serve(async (req) => {
  const { user_id, email, ip_address, timestamp } = await req.json()
  
  // Check failed attempts in last 10 minutes
  const { data: attempts } = await supabase
    .from('auth_logs')
    .select('*')
    .eq('user_id', user_id)
    .eq('event', 'failed_login')
    .gte('created_at', new Date(Date.now() - 10 * 60 * 1000))
  
  if (attempts.length >= 5) {
    // Send security alert email
    await resend.emails.send({
      to: email,
      from: 'security@leavelab.com',
      subject: 'Security Alert: Multiple Failed Login Attempts',
      html: SecurityAlertTemplate({
        attempts: attempts.length,
        lastAttempt: timestamp,
        location: ip_address,
        resetPasswordUrl: `${process.env.APP_URL}/reset-password`,
      }),
    })
    
    // Trigger n8n webhook for admin notification
    await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({ user_id, attempts: attempts.length }),
    })
  }
  
  return new Response('OK')
})
```

### Database Logging

```sql
-- Auth events logging table
CREATE TABLE auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event TEXT NOT NULL, -- 'login', 'failed_login', 'logout', 'password_change'
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_auth_logs_user_event_time 
ON auth_logs(user_id, event, created_at DESC);
```

### Alternatives Considered

- **Account Lockout**: Creates friction, especially for legitimate users with typos
- **CAPTCHA**: Annoying on mobile, can be bypassed by sophisticated bots
- **No Action**: Leaves users unaware of potential account compromise

### References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Supabase Realtime Event Hooks](https://supabase.com/docs/guides/database/webhooks)

---

## 6. Password Requirements & Validation

### Decision

Enforce 8+ characters, mixed case, numbers, and special characters. Display requirements prominently with real-time validation feedback.

### Rationale

- **Security**: Meets NIST guidelines for password strength
- **User Guidance**: Clear requirements prevent frustration during signup
- **Balance**: Not overly complex (no 16+ char requirement) to avoid user friction

### Implementation

```typescript
// Zod schema with detailed error messages
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#)')

// Password requirements display
function PasswordRequirements({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number', valid: /\d/.test(password) },
    { label: 'One special character', valid: /[@$!%*?&#]/.test(password) },
  ]
  
  return (
    <ul className="text-sm space-y-1">
      {checks.map((check) => (
        <li key={check.label} className={check.valid ? 'text-green-600' : 'text-gray-500'}>
          {check.valid ? '✓' : '○'} {check.label}
        </li>
      ))}
    </ul>
  )
}
```

### Alternatives Considered

- **Weaker Requirements**: 6 characters, no special chars (too weak)
- **Stronger Requirements**: 12+ characters, 2+ special chars (too much friction)
- **Password Strength Meter**: Visual indicator (deferred to future iteration)

### References

- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

## 7. Email Verification Flow

### Decision

Send verification email immediately after signup. Block access to protected routes until verified. Verification links expire after 24 hours.

### Rationale

- **Security**: Ensures user owns the email address
- **Anti-Spam**: Reduces fake account creation
- **GDPR Compliance**: Verified emails required for marketing communications

### Implementation

```typescript
// Signup Server Action
'use server'
export async function signup(formData: FormData) {
  const supabase = createServerActionClient({ cookies })
  
  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
      data: {
        display_name: formData.get('name'),
      },
    },
  })
  
  if (error) throw error
  
  // Trigger n8n onboarding webhook
  await fetch(process.env.N8N_WEBHOOK_URL + '/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: data.user.id, email: data.user.email }),
  })
  
  return { success: true, message: 'Check your email for verification link' }
}

// Verification page
export default async function VerifyEmailPage({ searchParams }: { searchParams: { token: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase.auth.verifyOtp({
    token_hash: searchParams.token,
    type: 'signup',
  })
  
  if (error) {
    return <ErrorMessage message="Verification link expired or invalid" />
  }
  
  redirect('/dashboard?welcome=true')
}
```

### Email Template (British English)

```
Subject: Verify your LeaveLab account

Hello!

Thank you for signing up for LeaveLab. Please verify your email address by clicking the button below:

[Verify Email Address]

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

Cheers,
The LeaveLab Team
```

### Alternatives Considered

- **No Email Verification**: Security risk, enables spam accounts
- **Magic Link Only**: Requires email for every login (too much friction)
- **SMS Verification**: More expensive, not necessary for current scale

### References

- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

---

## 8. Profile Picture Upload

### Decision

Use Supabase Storage with client-side image optimization before upload. Support JPG, PNG, WebP with 5MB limit.

### Rationale

- **Performance**: Client-side compression reduces upload time on mobile
- **Storage Costs**: Smaller images = lower costs
- **User Experience**: Show upload progress, immediate preview

### Implementation

```typescript
// Profile picture upload with optimization
import { compressImage } from '@/lib/utils/image'

async function uploadProfilePicture(file: File) {
  const supabase = createClientComponentClient()
  
  // Validate file type and size
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WebP image')
  }
  
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be less than 5MB')
  }
  
  // Compress image to max 800x800, 80% quality
  const compressed = await compressImage(file, { maxWidth: 800, quality: 0.8 })
  
  // Upload to Supabase Storage
  const fileName = `${userId}-${Date.now()}.${file.type.split('/')[1]}`
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, compressed, {
      cacheControl: '3600',
      upsert: true,
    })
  
  if (error) throw error
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)
  
  // Update profile
  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)
  
  return publicUrl
}
```

### Storage Configuration

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- RLS policy: Users can only upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy: Anyone can view avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

### Alternatives Considered

- **Third-Party CDN**: Cloudinary, Imgix (additional cost, vendor lock-in)
- **Base64 in Database**: Poor performance, bloats database
- **No Avatar Support**: Reduced personalization

### References

- [Supabase Storage Best Practices](https://supabase.com/docs/guides/storage)
- [Client-Side Image Compression](https://github.com/Donaldcwl/browser-image-compression)

---

## 9. GDPR Compliance: Data Export & Deletion

### Decision

Provide user-initiated data export and account deletion endpoints that comply with GDPR Article 15 (right to access) and Article 17 (right to erasure).

### Rationale

- **Legal Requirement**: GDPR mandatory for UK/EU users
- **User Trust**: Transparency builds confidence
- **Constitution Compliance**: Security & Privacy principle (III)

### Implementation

```typescript
// Data export endpoint
export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Collect all user data
  const [profile, sessions, authLogs] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('sessions').select('*').eq('user_id', user.id),
    supabase.from('auth_logs').select('*').eq('user_id', user.id),
  ])
  
  const exportData = {
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    profile: profile.data,
    sessions: sessions.data,
    auth_logs: authLogs.data,
    // Add other related data as features are built
  }
  
  return Response.json(exportData, {
    headers: {
      'Content-Disposition': `attachment; filename="leavelab-data-${user.id}.json"`,
    },
  })
}

// Account deletion endpoint
export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Soft delete (mark as deleted, actual deletion after 30 days for recovery)
  await supabase.from('profiles').update({ 
    deleted_at: new Date().toISOString(),
    email: `deleted_${user.id}@leavelab.com`, // Anonymize email
  }).eq('id', user.id)
  
  // Log out user
  await supabase.auth.signOut()
  
  // Trigger n8n webhook for admin notification
  await fetch(process.env.N8N_WEBHOOK_URL + '/auth/account-deleted', {
    method: 'POST',
    body: JSON.stringify({ user_id: user.id }),
  })
  
  return Response.json({ success: true })
}
```

### Alternatives Considered

- **Manual Process**: Support tickets for data requests (poor UX, non-compliant)
- **Immediate Hard Delete**: No recovery period (risky for accidental deletions)

### References

- [GDPR Compliance Checklist](https://gdpr.eu/checklist/)
- [Supabase GDPR Guide](https://supabase.com/docs/guides/platform/going-into-prod#gdpr-compliance)

---

## 10. Testing Strategy

### Decision

Three-layer testing: Unit tests for validation/business logic, integration tests for Supabase interactions, E2E tests for critical user flows.

### Rationale

- **Fast Feedback**: Unit tests run in milliseconds
- **Confidence**: Integration tests catch Supabase-specific issues
- **Real-World Coverage**: E2E tests verify entire user experience
- **Constitution Compliance**: TDD principle (V) requires 80% coverage

### Test Structure

```typescript
// Unit Test Example
describe('Password Validation', () => {
  it('should reject passwords shorter than 8 characters', () => {
    expect(() => passwordSchema.parse('Short1!')).toThrow('at least 8 characters')
  })
  
  it('should accept valid passwords', () => {
    expect(passwordSchema.parse('ValidPass123!')).toBe('ValidPass123!')
  })
})

// Integration Test Example
describe('Signup Flow', () => {
  it('should create user and send verification email', async () => {
    const supabase = createClient(TEST_URL, TEST_ANON_KEY)
    
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'TestPass123!',
    })
    
    expect(error).toBeNull()
    expect(data.user?.email).toBe('test@example.com')
    expect(data.user?.email_confirmed_at).toBeNull()
  })
})

// E2E Test Example (Playwright)
test('user can sign up with email/password', async ({ page }) => {
  await page.goto('/signup')
  
  await page.fill('[name="email"]', 'e2e-test@example.com')
  await page.fill('[name="password"]', 'E2ETest123!')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/verify-email')
  await expect(page.locator('text=Check your email')).toBeVisible()
})
```

### Coverage Targets

- **Unit Tests**: 90% coverage on `/src/features/auth/lib`
- **Integration Tests**: All Supabase Auth methods
- **E2E Tests**: P1 user stories (signup, login, password reset)

### Alternatives Considered

- **E2E Only**: Slow, expensive, hard to debug
- **Unit Only**: Misses integration issues
- **No Tests**: Violates constitution, high risk

### References

- [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

## Summary of Key Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| **Auth Provider** | Supabase Auth | Integrated with stack, handles OAuth, RLS, sessions |
| **OAuth Strategy** | Automatic account linking | Seamless UX, no duplicate accounts |
| **Session Duration** | 7 days | Balances security and mobile convenience |
| **Failed Login** | Security alert email (5 attempts) | User awareness without lockout friction |
| **Password Policy** | 8+ chars, mixed case, number, special char | NIST-compliant, user-friendly |
| **Email Verification** | Required, 24-hour expiry | Security and anti-spam |
| **Profile Pictures** | Supabase Storage, client-side compression | Performance, cost-effective |
| **GDPR** | Self-service export/deletion | Legal compliance, user trust |
| **Testing** | Unit + Integration + E2E (80% coverage) | Fast feedback, high confidence |
| **Mobile UX** | React Hook Form + Zod + Shadcn/ui | Performance, accessibility, type safety |

---

## Next Steps

Research complete. Proceed to Phase 1:
1. Create `data-model.md` with database schema
2. Generate API contracts in `/contracts/`
3. Write `quickstart.md` for setup instructions
4. Update agent context file
