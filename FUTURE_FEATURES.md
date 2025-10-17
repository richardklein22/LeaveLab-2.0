# Future Features - To Be Implemented Later

This document tracks features that have **placeholder UI** but are not yet fully functional. These can be added when needed.

---

## 🔒 Phase 8: Account Settings - Pending Features

### 1. Sessions Management
**Status**: Placeholder UI in place  
**Location**: `/settings` → Sessions tab  
**What's Needed**:
- View list of active sessions with:
  - Device information (browser, OS)
  - Last activity timestamp
  - IP address
  - Current session indicator
- "Log out from this device" button for each session
- "Log out from all devices" button (except current)

**Implementation Notes**:
- Query `auth.sessions` table from Supabase
- Use Supabase Auth `admin.listUserSessions()` API
- Create `/api/v1/account/sessions` route (GET, DELETE)
- Create `SessionsList` component

**User Story**: As a user, I want to see where I'm logged in and be able to log out from specific devices for security.

---

### 2. Connected Accounts (OAuth Management)
**Status**: Placeholder UI in place  
**Location**: `/settings` → Connected Accounts tab  
**What's Needed**:
- Display which OAuth providers are linked:
  - Google (if connected)
  - Apple (if connected)
  - Email/Password (if set)
- Show link/unlink buttons for each provider
- Allow adding email/password auth to OAuth-only accounts
- Show account creation method

**Implementation Notes**:
- Query user's identity providers from Supabase `auth.identities`
- Create API endpoint to link/unlink providers
- Handle case where user only has OAuth (must keep at least one auth method)
- Create `ConnectedAccounts` component

**User Story**: As a user, I want to manage how I can log in to my account (email/password, Google, etc.).

---

### 3. Data Export (GDPR Compliance)
**Status**: Placeholder UI in place  
**Location**: `/settings` → Data & Privacy tab  
**What's Needed**:
- "Export my data" button
- Generate JSON file with all user data:
  - Profile information
  - Authentication logs
  - Future: Course enrollments, memberships, activity
- Download as `leavelab-data-{user_id}.json`
- Include human-readable format

**Implementation Notes**:
- Create `/api/v1/account/export` route (GET)
- Query all relevant tables for user's data
- Format as JSON with clear structure
- Add file download response headers
- Log export request for audit trail

**User Story**: As a user, I want to download all my personal data to comply with GDPR and understand what information is stored about me.

**Legal Requirement**: GDPR Article 20 - Right to Data Portability

---

### 4. Account Deletion
**Status**: Placeholder UI in place  
**Location**: `/settings` → Data & Privacy tab (danger zone)  
**What's Needed**:
- "Delete my account" button (red/destructive)
- Confirmation modal with:
  - Warning about permanent deletion
  - Note about 30-day recovery period
  - "Type DELETE to confirm" input
- Soft delete (set `profiles.deleted_at` timestamp)
- 30-day grace period before hard delete
- Immediate logout after deletion

**Implementation Notes**:
- Create `/api/v1/account` route (DELETE)
- Implement soft delete:
  - Set `profiles.deleted_at = NOW()`
  - Keep data for 30 days for recovery
  - Block login for deleted accounts
- Create database function `soft_delete_user()`
- Schedule hard delete job (cron/background task)
- Create account recovery endpoint
- Log deletion request

**User Story**: As a user, I want to be able to permanently delete my account and all associated data if I no longer want to use the service.

**Legal Requirement**: GDPR Article 17 - Right to Erasure ("Right to be Forgotten")

---

## 📋 Implementation Priority (When Ready)

### Priority 1: Security Features
1. **Sessions Management** - Most requested security feature
   - Estimated: 4-6 hours
   - Dependencies: None

### Priority 2: Privacy & Compliance
2. **Data Export (GDPR)** - Legal requirement
   - Estimated: 3-4 hours
   - Dependencies: None

3. **Account Deletion** - Legal requirement
   - Estimated: 6-8 hours
   - Dependencies: Data export (should offer before deletion)

### Priority 3: Convenience
4. **Connected Accounts** - Nice to have
   - Estimated: 5-7 hours
   - Dependencies: OAuth setup complete (Google already done)

---

## 🔧 Technical Notes

### Database Schema Requirements

#### For Sessions Management:
```sql
-- Supabase already provides auth.sessions table
SELECT * FROM auth.sessions WHERE user_id = '{user_id}';
```

#### For Account Deletion:
```sql
-- Add soft delete column (already exists in profiles)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Create soft delete function
CREATE OR REPLACE FUNCTION soft_delete_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET deleted_at = NOW() 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create hard delete function (run after 30 days)
CREATE OR REPLACE FUNCTION hard_delete_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete from all tables
  DELETE FROM profiles WHERE id = user_id;
  DELETE FROM auth_logs WHERE user_id = user_id;
  -- Add more tables as needed
  
  -- Delete from auth.users (Supabase handles this)
  -- This will cascade to auth.identities, auth.sessions, etc.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### API Endpoints to Create

1. `/api/v1/account/sessions` - GET, DELETE
2. `/api/v1/account/export` - GET
3. `/api/v1/account` - DELETE
4. `/api/v1/account/recovery` - POST (restore deleted account)
5. `/api/v1/account/providers` - GET, POST, DELETE

### Components to Create

1. `src/features/auth/components/SessionsList.tsx`
2. `src/features/auth/components/ConnectedAccounts.tsx`
3. `src/features/auth/components/AccountDeletion.tsx`
4. `src/features/auth/components/DataExport.tsx`

---

## 🎯 When to Implement

**Implement when**:
- Users request these features
- Preparing for production launch (GDPR compliance required)
- After main LeaveLab features are built
- During security hardening phase

**Don't implement if**:
- Still in early development/MVP
- Limited resources/time
- Main product features not complete
- User base is small (< 100 users)

---

## 📚 Related Documentation

- Phase 8 Status: `/Users/charlielefever/LeaveLab/PHASE_8_ACCOUNT_SETTINGS_STATUS.md`
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- GDPR Compliance: https://gdpr.eu/
- OAuth Management: https://supabase.com/docs/guides/auth/social-login

---

## ✅ Current Status

**Implemented**:
- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Password reset
- ✅ Profile management (name, bio, avatar, etc.)
- ✅ Change password (with current password verification)

**Placeholder UI (Not Functional)**:
- ⏳ Sessions management
- ⏳ Connected accounts
- ⏳ Data export
- ⏳ Account deletion

**Not Started**:
- ❌ Apple OAuth
- ❌ Two-factor authentication (2FA)
- ❌ Email change verification
- ❌ Account recovery after deletion

---

Last Updated: 2025-10-08  
Status: Active Development  
Phase: 8 (Account Settings)
