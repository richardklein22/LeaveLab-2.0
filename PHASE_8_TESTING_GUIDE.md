# Phase 8: Account Settings - Testing Guide

**Quick test guide for all Phase 8 features**

---

## Prerequisites

Make sure you have:
1. ✅ Supabase running (`supabase start`)
2. ✅ Dev server running (`npm run dev`)
3. ✅ A logged-in user account

---

## 🧪 Test Scenarios

### 1. Change Password ✅

**Path**: http://localhost:3000/settings → Security tab (default)

**Test Steps**:
```
1. Log in to your account
2. Navigate to /settings (or click "Account Settings" from dashboard)
3. Security tab should be active by default
4. Enter your current password
5. Enter a new password (must meet requirements):
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character (@$!%*?&#)
6. Confirm new password (must match)
7. Click "Change password"

Expected:
✅ Success message appears
✅ Password is updated
✅ You stay logged in
✅ Other sessions are logged out (if any)
```

**Error Cases**:
```
❌ Wrong current password → "Current password is incorrect"
❌ Weak password → Shows which requirements are missing
❌ Passwords don't match → "Passwords must match"
```

**"Forgot Password" Link**:
```
1. Click "Forgot your current password?" link
2. Should redirect to /reset-password
3. Can request password reset email
```

---

### 2. Sessions Management ✅

**Path**: http://localhost:3000/settings → Sessions tab

**Test Steps**:
```
1. Navigate to /settings
2. Click "Sessions" tab
3. View your current session:
   - Device icon (desktop/mobile/tablet)
   - IP address
   - Last activity timestamp
   - "Current session" badge
4. Click "Log out from all other devices"
5. Confirm action

Expected:
✅ Current session is displayed
✅ Device type is correct
✅ "Current session" badge visible
✅ Other sessions are terminated (if any)
✅ Confirmation dialog appears before logout
```

**Note**: Currently shows only current session. Multi-session tracking requires additional setup (see `FUTURE_FEATURES.md`).

---

### 3. Connected Accounts ✅

**Path**: http://localhost:3000/settings → Connected Accounts tab

**Test Steps**:
```
1. Navigate to /settings
2. Click "Connected Accounts" tab
3. View authentication methods:
   - Email & Password (checkmark if set up)
   - Google OAuth (if connected)
4. Check connection details:
   - Email address
   - Connection date
5. Try to disconnect a provider (optional)

Expected:
✅ Email/Password status is correct
✅ Google OAuth shows if connected
✅ Connection dates are displayed
✅ Cannot disconnect if only one auth method
✅ Warning appears if trying to disconnect last method
```

**Disconnect Flow** (currently returns 501):
```
1. Click "Disconnect" on a provider
2. Confirmation dialog appears
3. Click "Disconnect"
4. Currently shows "Provider unlinking requires additional backend setup"
   (Full OAuth unlinking documented in FUTURE_FEATURES.md)
```

---

### 4. Data Export (GDPR) ✅

**Path**: http://localhost:3000/settings → Data & Privacy tab

**Test Steps**:
```
1. Navigate to /settings
2. Click "Data & Privacy" tab
3. Find "Export Your Data" section
4. Click "Export My Data" button
5. Wait for download (should be instant)
6. File downloads as: leavelab-data-{user_id}-{date}.json

Expected:
✅ Download starts immediately
✅ File is valid JSON
✅ Contains export metadata
✅ Contains account information
✅ Contains profile data
✅ Contains auth logs (last 100)
✅ Contains OAuth providers
✅ Human-readable format
```

**Verify Export Contents**:
```json
{
  "export_info": {
    "exported_at": "2025-10-08T12:34:56.789Z",
    "format": "JSON",
    "version": "1.0"
  },
  "account": {
    "id": "...",
    "email": "you@example.com",
    "email_confirmed": true,
    "created_at": "...",
    "providers": [...]
  },
  "profile": { ... },
  "authentication_logs": [ ... ],
  "metadata": { ... }
}
```

---

### 5. Account Deletion ✅

**Path**: http://localhost:3000/settings → Data & Privacy tab

**⚠️ Warning**: This will soft-delete your account (30-day recovery)

**Test Steps**:
```
1. Navigate to /settings
2. Click "Data & Privacy" tab
3. Scroll to "Delete Account" section (red border)
4. Read the warning message
5. Click "Delete My Account" button
6. Confirmation dialog appears with:
   - Warning about permanent deletion
   - List of what will be deleted
   - "DELETE" confirmation input
7. Type "DELETE" (must be uppercase)
8. Click "Delete Account"

Expected:
✅ Confirmation dialog appears
✅ Must type "DELETE" exactly
✅ Button disabled until correct confirmation
✅ Account is soft-deleted (deleted_at set)
✅ User is logged out immediately
✅ Redirected to /login?deleted=true
✅ Deletion is logged in auth_logs
```

**Error Cases**:
```
❌ Wrong confirmation text → Cannot proceed
❌ Empty confirmation → Button disabled
```

**Account Recovery** (optional - requires manual implementation):
```
1. Within 30 days, log in again
2. Check if deleted_at is set
3. Offer account recovery
4. Clear deleted_at timestamp
5. Account is restored
```

**Hard Delete** (after 30 days - requires cron job):
```
Automatically delete accounts where:
- deleted_at < NOW() - INTERVAL '30 days'
- Permanently removes all data
- No recovery possible
```

---

## 🔍 Database Verification

After testing, verify in your database:

### Check deleted accounts:
```sql
-- View soft-deleted accounts
SELECT id, email, deleted_at 
FROM profiles 
WHERE deleted_at IS NOT NULL;
```

### Check auth logs:
```sql
-- View recent account events
SELECT event_type, created_at, success 
FROM auth_logs 
WHERE user_id = '{your_user_id}' 
ORDER BY created_at DESC 
LIMIT 10;
```

Expected events:
- `data_export` - when user exports data
- `account_deletion` - when user deletes account
- `password_changed` - when password is changed
- `login` - when user logs in
- `failed_login` - when login fails

---

## 🎨 UI/UX Checks

### Mobile Responsiveness
```
1. Resize browser to 375px width
2. Navigate through all tabs
3. Check all buttons are tappable (44px minimum)
4. Test all forms on mobile
5. Verify confirmation dialogs work on mobile
```

### Accessibility
```
1. Tab through all elements (keyboard navigation)
2. Check focus states are visible
3. Verify ARIA labels
4. Test with screen reader (optional)
5. Check color contrast
```

### Loading States
```
1. All buttons show loading spinner when processing
2. Disabled state during operations
3. Clear success messages
4. Clear error messages
```

### British English
```
✅ All copy uses British spelling:
   - "Authorise" not "Authorize"
   - "Organise" not "Organize"
   - "Colour" not "Color"
```

---

## 🐛 Common Issues

### Issue: "Network error" when exporting data
**Solution**: Check that Supabase is running and dev server is connected.

### Issue: Cannot change password
**Solution**: Verify current password is correct. Check browser console for errors.

### Issue: Sessions tab shows no sessions
**Solution**: Normal - only current session is shown. Multi-session requires additional setup.

### Issue: Cannot disconnect OAuth provider
**Solution**: Expected - returns 501. Full OAuth unlinking documented in `FUTURE_FEATURES.md`.

### Issue: Account deletion doesn't work
**Solution**: Make sure you type "DELETE" in uppercase. Check browser console for errors.

---

## 📊 Success Criteria

All Phase 8 features are working if:

- ✅ Can change password with verification
- ✅ Current session is displayed
- ✅ Can log out from all other devices
- ✅ Connected accounts are listed
- ✅ Can export data as JSON
- ✅ Can soft-delete account
- ✅ Confirmation dialogs work
- ✅ All forms validate properly
- ✅ Loading states appear
- ✅ Error messages are clear
- ✅ Mobile-responsive
- ✅ No TypeScript errors
- ✅ No console errors

---

## 🎉 Phase 8 Complete!

If all tests pass, Phase 8 is **production-ready**!

**Next Steps**:
1. ✅ Mark Phase 8 as complete
2. 🧪 Write automated tests (optional)
3. 🚀 Move on to main LeaveLab features
4. 🌐 Deploy to production

See `PHASE_8_COMPLETE.md` for full feature summary.

---

**Happy Testing!** 🧪
