# 🧪 Password Reset Testing Guide

**Issue Fixed**: Form validation error and improper error display  
**Date**: October 8, 2025

---

## ✅ What Was Fixed

### **1. Error Handling**
- ❌ **Before**: Error showed `[object Object]` 
- ✅ **After**: Error properly extracts and displays message string

### **2. Form Submission**
- ❌ **Before**: Only sent `password` field (missing `confirmPassword`)
- ✅ **After**: Sends both `password` and `confirmPassword` for validation

---

## 🧪 Complete Testing Flow

### **Prerequisites:**
1. ✅ Supabase is running: `supabase status`
2. ✅ Next.js dev server is running: `npm run dev`
3. ✅ Mailpit is accessible: http://localhost:54324
4. ✅ You have an existing account to test with

---

## 📋 Step-by-Step Test

### **Step 1: Create Test Account (if needed)**

```
1. Visit: http://localhost:3000/signup
2. Email: test@example.com
3. Password: Test1234!
4. Click "Create account"
5. Check Mailpit for verification email
6. Click verification link
7. You're now logged in to dashboard
8. Click "Logout"
```

### **Step 2: Request Password Reset**

```
1. Visit: http://localhost:3000/login
2. Click "Forgot password?" link
3. Enter email: test@example.com
4. Click "Send reset instructions"
5. ✅ You should see success message:
   "Check your email"
   "If an account exists with that email address..."
```

### **Step 3: Check Email**

```
1. Open Mailpit: http://localhost:54324
2. Find email with subject: "Reset your password" or similar
3. ✅ Email should contain a reset link
4. ⚠️  DO NOT copy the link directly!
5. Click the link in Mailpit's email viewer
   (This ensures proper redirect through /auth/callback)
```

### **Step 4: Verify Callback Redirect**

```
1. After clicking email link:
   - Should redirect to: /auth/callback?token_hash=...&type=recovery
   - Then automatically redirect to: /update-password
2. ✅ You should see "Set new password" page
3. ✅ You should see password requirements
```

### **Step 5: Set New Password**

```
1. New password: NewPass123!
2. Confirm password: NewPass123!
3. ✅ Password requirements should all be green:
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character
4. Click "Update password"
```

### **Step 6: Success & Auto-Redirect**

```
1. ✅ Should see success message:
   "Password updated successfully!"
   "You can now log in with your new password."
   "Redirecting to log in..."
2. ✅ After 2 seconds, auto-redirect to /login
```

### **Step 7: Log In with New Password**

```
1. Email: test@example.com
2. Password: NewPass123! (the NEW password)
3. Click "Log in"
4. ✅ Should land on /dashboard
5. ✅ You're logged in successfully!
```

### **Step 8: Verify Old Password Doesn't Work**

```
1. Log out
2. Try logging in with OLD password: Test1234!
3. ✅ Should get error: "Invalid login credentials"
4. ✅ This confirms password was actually changed
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Invalid or expired reset link"**

**Cause**: 
- Reset link older than 1 hour
- Token already used
- Directly accessing /update-password without clicking email link

**Solution**:
1. Request a new password reset
2. Click the link in the email (within 1 hour)
3. Don't refresh or go back after using the link

---

### **Issue 2: Validation Error "[object Object]"**

**Cause**: Previous version had error handling bug

**Solution**: ✅ **FIXED!** Error now displays properly as:
- "Validation failed" with specific field errors
- Or actual error message from API

---

### **Issue 3: Password Requirements Not Met**

**Cause**: Password doesn't meet requirements

**Solution**: Ensure your password has:
- ✅ At least 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (@$!%*?&#)

**Examples**:
- ❌ `password` - no uppercase, number, or special char
- ❌ `Password` - no number or special char
- ❌ `Password1` - no special char
- ✅ `Password1!` - meets all requirements
- ✅ `NewPass123!` - meets all requirements
- ✅ `MyP@ssw0rd` - meets all requirements

---

### **Issue 4: Passwords Don't Match**

**Cause**: Password and Confirm Password fields don't match

**Solution**: 
- Type carefully
- Use the same exact password in both fields
- Watch for extra spaces

---

### **Issue 5: Not Authenticated**

**Cause**: Accessing /update-password directly without going through email link

**Solution**:
- Don't bookmark or manually visit /update-password
- Always use the link from the password reset email
- The email link authenticates you temporarily

---

### **Issue 6: Email Not Received**

**Cause**: Testing with local Mailpit

**Solution**:
1. Mailpit only catches emails in development
2. Check: http://localhost:54324
3. Emails appear instantly (no delay)
4. If not there, check console for errors

---

## 📊 What to Check in Each Step

### **✅ Request Reset Success Indicators**
- [ ] "Check your email" message appears
- [ ] Generic message (no "user not found")
- [ ] No error messages
- [ ] "Send reset instructions" button worked

### **✅ Email Success Indicators**
- [ ] Email appears in Mailpit
- [ ] Subject mentions password reset
- [ ] Contains clickable reset link
- [ ] Email content is readable

### **✅ Update Password Page Indicators**
- [ ] Page title: "Set new password"
- [ ] Two password input fields
- [ ] Password requirements list visible
- [ ] "Update password" button enabled
- [ ] "Back to log in" link present

### **✅ Success Indicators**
- [ ] Success message shown
- [ ] No error messages
- [ ] Auto-redirect to login (2 seconds)
- [ ] Can log in with new password
- [ ] Cannot log in with old password

---

## 🔍 Debugging Tips

### **Check Browser Console**

Open DevTools (F12) and check Console for:
```javascript
// Should see this on successful password update:
Password updated successfully

// Should NOT see:
[object Object]
Failed to update password
Validation failed
```

### **Check Network Tab**

In DevTools → Network:
```
POST /api/v1/auth/update-password
Status: 200 OK ✅

// If you see:
Status: 400 Bad Request ❌
- Check request payload (should have password + confirmPassword)
- Check response for validation errors

Status: 401 Unauthorized ❌
- You're not authenticated
- Click the email link again
```

### **Check Server Logs**

In terminal running `npm run dev`:
```
// Success:
POST /api/v1/auth/update-password 200

// Validation error:
POST /api/v1/auth/update-password 400

// Not authenticated:
POST /api/v1/auth/update-password 401

// Check for any error messages above the status code
```

---

## 🎯 Quick Test Checklist

Use this for fast testing:

- [ ] 1. Have existing account
- [ ] 2. Visit /login
- [ ] 3. Click "Forgot password?"
- [ ] 4. Enter email
- [ ] 5. See success message
- [ ] 6. Open Mailpit (http://localhost:54324)
- [ ] 7. Click reset link in email
- [ ] 8. Redirected to /update-password
- [ ] 9. Enter new password (e.g., NewPass123!)
- [ ] 10. Confirm new password
- [ ] 11. Click "Update password"
- [ ] 12. See success message
- [ ] 13. Redirected to /login
- [ ] 14. Log in with NEW password
- [ ] 15. Access dashboard ✅

---

## 🎊 Testing Complete!

Once all steps pass, your password reset flow is working perfectly! 🚀

---

## 📝 Notes

- Reset links expire after 1 hour
- Each reset link can only be used once
- Old sessions are invalidated after password change
- Email enumeration is prevented (same message for all emails)
- Passwords must meet strength requirements

---

**Test URL**: http://localhost:3000/login → "Forgot password?"  
**Mailpit URL**: http://localhost:54324
