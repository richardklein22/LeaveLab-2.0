# Password Reset Fix - PKCE Flow

## 🐛 Problem

The password reset flow was failing with "Invalid or expired reset link" because Supabase's newer versions use PKCE (Proof Key for Code Exchange) flow instead of the older token-based flow. When users clicked the reset link in their email, they were landing on `/update-password?code=...` but the code wasn't being exchanged for a session before attempting to update the password.

## ✅ Solution

Updated the `UpdatePasswordForm` component to:

1. **Automatically detect and exchange PKCE codes** - When the component loads with a `code` parameter in the URL, it automatically exchanges it for an authenticated session
2. **Verify session existence** - If no code is present, it checks if the user already has a valid session
3. **Show appropriate UI states** - Display loading, error, or success states based on the verification result
4. **Prevent form display on error** - Only show the password update form if the user is properly authenticated

### Changes Made

#### `/src/features/auth/components/UpdatePasswordForm.tsx`

- Added `useEffect` hook to handle code exchange on component mount
- Added `verifying` state to show loading UI during verification
- Added session check for cases where no code is present
- Updated error handling to prevent form display when verification fails
- Automatically removes code from URL after successful exchange for cleaner UX

## 🧪 How to Test

### 1. Start Your Development Servers

Make sure both Supabase and Next.js are running:

```bash
# Terminal 1 - Supabase (if not already running)
supabase start

# Terminal 2 - Next.js dev server
npm run dev
```

### 2. Request a Password Reset

1. Open http://localhost:3000/reset-password
2. Enter an email address that you've previously signed up with (e.g., the one you used for testing earlier)
3. Click "Send reset instructions"
4. You should see a success message

### 3. Check Your Email (Mailpit)

1. Open Mailpit at http://localhost:54323
2. Find the password reset email
3. Click the "Reset Password" button/link in the email

### 4. Verify the Flow

**What should happen:**

1. **Loading State** - You'll briefly see "Verifying reset link..." with a spinner
2. **Password Form** - The form appears with two password input fields
3. **URL Clean-up** - The URL changes from `/update-password?code=...` to just `/update-password`
4. **Password Update** - Enter and confirm your new password (must meet requirements)
5. **Success State** - See "Password updated successfully!" message
6. **Automatic Redirect** - After 2 seconds, you're redirected to the login page
7. **Login Works** - You can now log in with your new password

**If the reset link is invalid/expired, you'll see:**
- An error message: "Invalid or expired reset link. Please request a new one."
- A button to request a new reset link

### 5. Test Edge Cases

#### Test Expired Link
1. Request a password reset
2. Wait for the link to expire (or use an old link from a previous test)
3. Click the expired link
4. **Expected:** Error message with option to request a new link

#### Test Direct Access Without Code
1. Navigate directly to http://localhost:3000/update-password (without code parameter)
2. **Expected:** Error message (no valid session)

#### Test Invalid Code
1. Navigate to http://localhost:3000/update-password?code=invalid-code-12345
2. **Expected:** Error message after verification attempt

## 📝 Technical Details

### PKCE Flow

Supabase's password reset now uses PKCE (Proof Key for Code Exchange) for enhanced security:

1. User requests reset via `supabase.auth.resetPasswordForEmail()`
2. Supabase sends email with a link containing a `code` parameter
3. User clicks link and lands on your app with the code
4. Your app calls `supabase.auth.exchangeCodeForSession(code)`
5. Supabase exchanges the code for an authenticated session
6. User can now update their password via `supabase.auth.updateUser({ password })`

### Component States

The `UpdatePasswordForm` component has four main states:

1. **Verifying** - Exchanging code for session or checking existing session
2. **Error** - Verification failed, show error message and "Request new link" button
3. **Success** - Password updated, show success message and redirect countdown
4. **Ready** - Authenticated and ready to accept new password input

### Security Considerations

- **Email Enumeration Prevention** - API always returns success, even if email doesn't exist
- **Session Validation** - Component verifies session before showing password form
- **Code Expiration** - Supabase codes expire after a set time (configurable in Supabase dashboard)
- **Session Invalidation** - After password update, all other sessions are invalidated for security

## 🎯 Next Steps

After confirming the password reset works:

1. ✅ Test the complete flow end-to-end
2. ✅ Verify error states work correctly
3. ✅ Confirm new password works for login
4. Move on to Phase 6: User Story 5 - Profile Management (P2)

## 📚 Related Files

- `/src/features/auth/components/UpdatePasswordForm.tsx` - Main component (updated)
- `/src/app/(auth)/update-password/page.tsx` - Page wrapper
- `/src/app/api/v1/auth/reset-password/route.ts` - Request reset API
- `/src/app/api/v1/auth/update-password/route.ts` - Update password API
- `/src/features/auth/lib/validation.ts` - Validation schemas
- `/src/app/auth/callback/route.ts` - OAuth/Email verification callback

## 🔍 Debugging Tips

If you encounter issues:

1. **Check Browser Console** - Look for any error messages during code exchange
2. **Check Server Logs** - Look for "Code exchange error" in the Next.js terminal
3. **Check Supabase Logs** - Run `supabase logs` to see Supabase-side errors
4. **Verify Email Template** - Check Mailpit to ensure the reset link is correct
5. **Check Supabase Config** - Verify `supabase/config.toml` has correct site URL

### Common Issues

**"Invalid or expired reset link" immediately:**
- Check if Supabase is running (`supabase status`)
- Verify the code hasn't already been used (codes are single-use)
- Check if the code has expired

**Form doesn't appear:**
- Check browser console for JavaScript errors
- Verify session was established after code exchange
- Check network tab for failed API calls

**Password update fails:**
- Verify password meets all requirements (8+ chars, uppercase, lowercase, number, special char)
- Check that passwords match
- Verify session is authenticated
