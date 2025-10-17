# Password Reset PKCE Fix - Final Solution

## 🐛 The Problem

The password reset was failing with:
```
invalid request: both auth code and code verifier should be non-empty
```

This happened because:
1. Supabase's password reset uses **PKCE (Proof Key for Code Exchange)** flow
2. The reset email contains a `code` parameter that needs to be exchanged server-side
3. We were trying to handle the code exchange on the client-side in `UpdatePasswordForm`
4. PKCE requires the code verifier that was generated during the initial request, which is only available server-side

## ✅ The Solution

The fix involves routing password reset links through the `/auth/callback` route (which already handles PKCE for OAuth):

### Flow:
1. User requests password reset → API calls `resetPasswordForEmail()`
2. Supabase sends email with link to `/auth/callback?code=...&next=/update-password`
3. `/auth/callback` route exchanges the code for a session (server-side)
4. `/auth/callback` redirects to `/update-password`
5. `UpdatePasswordForm` verifies the session and shows the form
6. User enters new password and submits

### Changes Made

#### 1. `/src/app/api/v1/auth/reset-password/route.ts`
- Changed `redirectTo` from `/update-password` to `/auth/callback?next=/update-password`
- This ensures the reset link goes through the callback handler

#### 2. `/src/app/auth/callback/route.ts`
- Updated to detect password reset flow (when `next=/update-password`)
- Added proper error handling for PKCE errors
- Redirects to `/update-password` after successful code exchange

#### 3. `/src/features/auth/components/UpdatePasswordForm.tsx`
- Removed client-side code exchange logic
- Simplified to only verify that a session exists
- Shows error if no valid session is found

## 🧪 Testing Instructions

### 1. **Start Your Servers** (if not running)

```bash
# Check Supabase status
supabase status

# Start Supabase if needed
supabase start

# Your Next.js dev server should already be running
# If not: npm run dev
```

### 2. **Request a Password Reset**

1. Open your browser to: http://localhost:3000/reset-password
2. Enter the email address you used to sign up (e.g., the one from your earlier tests)
3. Click **"Send reset instructions"**
4. You should see: "If an account exists with that email, we have sent password reset instructions."

### 3. **Check the Reset Email**

1. Open Mailpit: http://localhost:54323
2. Find the password reset email (should be the most recent)
3. **Important**: Look at the reset link - it should now point to `/auth/callback` not `/update-password`
4. Click the **"Reset Password"** button in the email

### 4. **Complete the Password Reset**

**What should happen:**

1. **Redirect to callback** - You land on `/auth/callback?code=...&next=/update-password`
2. **Code exchange** - The callback route exchanges the code for a session (you won't see this)
3. **Redirect to form** - You're redirected to `/update-password`
4. **Verification** - Brief "Verifying reset link..." message
5. **Form appears** - The password update form is shown
6. **Enter password** - Type your new password (must meet requirements):
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character (@$!%*?&#)
7. **Confirm password** - Retype the same password
8. **Submit** - Click "Update password"
9. **Success message** - See "Password updated successfully!"
10. **Auto-redirect** - After 2 seconds, you're sent to login
11. **Test login** - Log in with your new password

### 5. **Error States to Test**

#### Test 1: Expired/Used Link
1. Request a password reset
2. Click the link in the email
3. Go back and click the same link again
4. **Expected**: "Invalid or expired reset link. Please request a new one."

#### Test 2: Direct Access
1. Navigate directly to: http://localhost:3000/update-password
2. **Expected**: After brief "Verifying..." message, you see the error screen

#### Test 3: Manipulated Code
1. Request a reset
2. Manually change the code in the URL before it redirects
3. **Expected**: Error message about invalid link

## 🔍 How to Verify It's Working

### Check the Browser Network Tab:

1. Open DevTools → Network tab
2. Request a password reset and click the email link
3. You should see these requests:
   ```
   GET /auth/callback?code=...&next=/update-password  → 307 redirect
   GET /update-password                                → 200 OK
   ```

### Check the Terminal Logs:

Your Next.js terminal should show:
```
✓ Compiled /auth/callback in XXXms
GET /auth/callback?code=... 307 in XXms
✓ Compiled /update-password in XXXms  
GET /update-password 200 in XXms
POST /api/v1/auth/update-password 200 in XXms
```

**No** 400 or 401 errors should appear!

## 📝 Technical Details

### PKCE Flow Explained

**PKCE** (Proof Key for Code Exchange) is an OAuth 2.0 security extension:

1. **Code Challenge**: When reset is requested, Supabase generates:
   - A random `code_verifier` (stored server-side)
   - A `code_challenge` (hash of the verifier)
2. **Authorization Code**: Supabase sends an authorization `code` in the email link
3. **Code Exchange**: Server exchanges `code` + `code_verifier` for tokens
4. **Session**: Supabase creates an authenticated session

**Why server-side?**
- The `code_verifier` is secret and never exposed to the client
- Exchange must happen on the server where Supabase can validate it
- Prevents code interception attacks

### Why `/auth/callback`?

The `/auth/callback` route already handles PKCE for OAuth (Google login), so we reuse it for password reset:

- **Unified flow**: One route handles all PKCE exchanges
- **Server-side**: Code exchange happens server-side with cookies
- **Type detection**: Checks `next` parameter to distinguish OAuth from password reset
- **Error handling**: Centralized error handling for all authentication flows

## 🎯 Success Criteria

✅ Reset email link points to `/auth/callback` (not `/update-password`)  
✅ Clicking reset link successfully exchanges code for session  
✅ User is redirected to `/update-password` with active session  
✅ Password form appears without errors  
✅ User can successfully update password  
✅ User can log in with new password  
✅ Expired/used links show appropriate error  

## 🚨 Troubleshooting

### Error: "Invalid or expired reset link"

**Check:**
1. Is Supabase running? (`supabase status`)
2. Did you click an old/used reset link? (Request a fresh one)
3. Check browser console for errors
4. Check Next.js terminal for callback errors

### Error: "code verifier" message

**This means:**
- The code exchange is failing
- Check that the callback route is properly handling the code
- Verify the `redirectTo` URL in the reset API includes `/auth/callback`

### Form doesn't appear

**Check:**
1. Browser console for JavaScript errors
2. Network tab - did `/auth/callback` return 307 redirect?
3. Did you land on `/update-password` after the redirect?
4. Check if session exists (DevTools → Application → Cookies)

### Password update fails (400/401)

**Check:**
1. Is there a valid session? (Check cookies)
2. Does password meet all requirements?
3. Do passwords match?
4. Check browser console and terminal for specific error

## 📚 Related Files

- `/src/app/api/v1/auth/reset-password/route.ts` - Request reset (updated)
- `/src/app/auth/callback/route.ts` - Handle PKCE exchange (updated)
- `/src/features/auth/components/UpdatePasswordForm.tsx` - Update form (simplified)
- `/src/app/(auth)/update-password/page.tsx` - Page wrapper
- `/src/app/api/v1/auth/update-password/route.ts` - Update password API

## 🎉 Next Steps

Once you've confirmed the password reset works end-to-end:

1. ✅ Test all scenarios (success, expired link, direct access)
2. ✅ Verify new password works for login
3. ✅ Clean up any old reset links in Mailpit
4. Move on to **Phase 6: User Story 5 - Profile Management (P2)**

---

## 🔐 Security Notes

- **Email enumeration prevention**: API always returns success message
- **Single-use codes**: Reset codes can only be used once
- **Time expiration**: Codes expire after a set time (Supabase config)
- **Session invalidation**: After password update, all other sessions are logged out
- **HTTPS required**: In production, PKCE requires HTTPS (localhost is exempt)
