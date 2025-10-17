# LeaveLab - Quick Start Guide

## 🚀 Your App is Ready!

---

## ✅ What's Been Built

### Phase 1 & 2: Foundation ✅
- Next.js 15 project with TypeScript
- Supabase local development setup
- Database with tables: `profiles`, `auth_logs`
- Tailwind CSS + Shadcn/ui components
- Testing infrastructure (Jest, Playwright)

### Phase 3: Email/Password Signup ✅
- Signup page with form validation
- Password strength requirements with real-time feedback
- Email verification flow
- Dashboard for authenticated users
- All features mobile-optimized & British English

### Phase 4: User Login ✅
- Login page with email/password
- "Remember me" functionality (30 days vs 7 days)
- Failed login tracking (5 attempts → security alert)
- Email verification check before login
- Logout functionality
- Session persistence

---

## 🌐 Access Your App

| Service | URL | Purpose |
|---------|-----|---------|
| **Next.js App** | http://localhost:3000 | Your application |
| **Signup Page** | http://localhost:3000/signup | User registration |
| **Login Page** | http://localhost:3000/login | User login |
| **Dashboard** | http://localhost:3000/dashboard | Protected dashboard |
| **Supabase Studio** | http://localhost:54323 | Database management |
| **Mailpit** | http://localhost:54324 | Email testing |

---

## 🧪 Test the Complete Auth Flow

### Phase 3: Signup Flow

#### Step 1: Visit Signup Page
```
http://localhost:3000/signup
```

#### Step 2: Try Invalid Inputs
- **Bad email**: `notanemail` → Should show error
- **Weak password**: `password` → Should show requirements not met

#### Step 3: Create Account
- **Email**: `test@example.com`
- **Password**: `Test1234!`
- Click "Create account"

#### Step 4: Check Verification Email
1. Go to http://localhost:54324
2. Find the verification email from Supabase
3. Click the verification link
4. Should redirect to dashboard

#### Step 5: Verify in Database
1. Open Supabase Studio: http://localhost:54323
2. Navigate to "Table Editor"
3. Check:
   - `auth.users` → Your user exists
   - `public.profiles` → Profile auto-created
   - `public.auth_logs` → Signup event logged

### Phase 4: Login Flow

#### Step 1: Log Out (if logged in)
- Click "Log out" button on dashboard
- Should redirect to `/login`

#### Step 2: Visit Login Page
```
http://localhost:3000/login
```

#### Step 3: Try Invalid Credentials
- Enter wrong password → Should show error
- Try 5 times → Should trigger security alert in console

#### Step 4: Log In Successfully
- **Email**: `test@example.com`
- **Password**: `Test1234!`
- Check "Remember me" (optional)
- Click "Log in"
- Should redirect to `/dashboard`

#### Step 5: Test Session Persistence
- Refresh the page
- Should stay logged in
- Navigate away and come back
- Should still be logged in

#### Step 6: Test Logout
- Click "Log out" button
- Should redirect to `/login`
- Try accessing `/dashboard` → Should redirect to `/login`

---

## 📦 What's Included

### Components
- ✅ `SignupForm` - Email/password form with validation
- ✅ `PasswordRequirements` - Real-time password strength indicator
- ✅ Shadcn/ui components (Button, Input, Form, Label, Alert, Card)

### API Routes
- ✅ `POST /api/v1/auth/signup` - Create account
- ✅ `POST /api/v1/auth/verify-email` - Verify email token
- ✅ `GET /auth/callback` - Handle Supabase redirects

### Pages
- ✅ `/signup` - Registration page
- ✅ `/verify-email` - Email verification status
- ✅ `/dashboard` - Protected dashboard (placeholder)

### Database
- ✅ `profiles` table with RLS policies
- ✅ `auth_logs` table for security tracking
- ✅ Auto-profile creation trigger
- ✅ Storage bucket for avatars

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Check Supabase status
supabase status

# View database
supabase studio

# Run tests
npm test

# Type check
npm run type-check

# Stop Supabase (when done)
supabase stop

# Restart Supabase
supabase start
```

---

## 📋 Password Requirements

Your password must have:
- ✅ At least 8 characters
- ✅ One uppercase letter
- ✅ One lowercase letter
- ✅ One number
- ✅ One special character (@$!%*?&#)

---

## 🎯 Next Features to Implement

According to `specs/001-user-authentication-onboarding/tasks.md`:

### Phase 4: Login (Tasks T043-T052)
- Login form
- "Remember me" functionality
- Failed login tracking (5 attempts in 10 min)
- Security alerts

### Phase 5: Password Reset (Tasks T053-T064)
- Password reset request form
- Reset email
- New password form
- Password change confirmation

---

## 🔍 Debugging Tips

### Email Not Sending?
- Check Mailpit: http://localhost:54324
- All emails go to Mailpit in local development

### Supabase Not Working?
```bash
# Check if running
supabase status

# Restart if needed
supabase stop && supabase start
```

### TypeScript Errors?
```bash
npm run type-check
```

### Page Not Loading?
```bash
# Check if Next.js is running
curl http://localhost:3000
# Should return 200

# Restart if needed
npm run dev
```

---

## 📊 Project Structure

```
LeaveLab/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── signup/page.tsx        # Signup page
│   │   │   ├── verify-email/page.tsx  # Verification page
│   │   │   └── layout.tsx              # Auth layout
│   │   ├── (dashboard)/
│   │   │   └── dashboard/page.tsx      # Dashboard
│   │   ├── api/v1/auth/
│   │   │   ├── signup/route.ts         # Signup API
│   │   │   └── verify-email/route.ts   # Verify API
│   │   └── auth/callback/route.ts      # Supabase callback
│   ├── components/ui/                   # Shadcn components
│   ├── features/auth/
│   │   ├── components/
│   │   │   ├── SignupForm.tsx
│   │   │   └── PasswordRequirements.tsx
│   │   ├── constants/
│   │   │   ├── error-messages.ts
│   │   │   └── routes.ts
│   │   └── lib/
│   │       └── validation.ts            # Zod schemas
│   └── lib/
│       ├── supabase/                    # Supabase clients
│       └── utils/                       # Helper functions
├── supabase/
│   ├── config.toml
│   └── migrations/                      # 4 migrations
├── tests/
│   ├── unit/auth/validation.test.ts    # 21 passing tests
│   ├── integration/
│   └── e2e/
├── specs/                               # Feature specifications
└── .specify/memory/                     # Constitution
```

---

## 🎨 Design System

- **Colors**: HSL-based with CSS variables
- **Typography**: System fonts, mobile-optimized
- **Spacing**: Tailwind default scale
- **Tap Targets**: Minimum 44x44px (mobile-first)
- **Language**: British English throughout

---

## 📝 Notes

1. **Local Development**: All Supabase data is local (Docker)
2. **Production**: Push migrations with `supabase db push`
3. **Email Templates**: Using Supabase defaults (customizable later)
4. **Session Duration**: 7 days (as per constitution)
5. **RLS**: All tables have Row Level Security enabled

---

## 🐛 Found a Bug?

Check these files:
- `PHASE_3_STATUS.md` - Implementation details
- `specs/001-user-authentication-onboarding/` - Feature spec
- `IMPLEMENTATION_STATUS.md` - Progress tracker

---

**Status**: ✅ **MVP Phase 3 Complete**  
**Ready for**: Manual testing & Phase 4 (Login) implementation

---

**Questions?** Check the docs in:
- `.specify/memory/constitution.md` - Project principles
- `specs/001-user-authentication-onboarding/spec.md` - Feature requirements
- `specs/001-user-authentication-onboarding/tasks.md` - Task breakdown
