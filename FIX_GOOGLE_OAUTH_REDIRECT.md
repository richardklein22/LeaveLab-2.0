# Fix Google OAuth Redirect URI Mismatch

**Error**: `Error 400: redirect_uri_mismatch`  
**Status**: ⚠️ **Needs Google Cloud Console Update**

---

## 🚨 The Problem

When you click "Sign up with Google", the app redirects to Google, but Google rejects it because the **redirect URI** isn't authorized in your Google Cloud Console.

**What Supabase is sending**:
```
http://localhost:54321/auth/v1/callback
```

**What Google expects**: This exact URI to be in your OAuth client's "Authorized redirect URIs" list.

---

## ✅ The Solution (2 Minutes)

### **Step 1: Open Google Cloud Console**

1. Go to: https://console.cloud.google.com
2. Make sure you're in the correct project
3. Click **"APIs & Services"** (left sidebar)
4. Click **"Credentials"**

### **Step 2: Edit Your OAuth 2.0 Client**

1. Find your OAuth 2.0 Client ID in the list:
   ```
   Client ID: 168048179340-g9flbea731fqle2kle644os32m0dntg3.apps.googleusercontent.com
   ```
2. Click the **✏️ pencil icon** (Edit) on the right

### **Step 3: Add Authorized Redirect URIs**

Scroll down to **"Authorized redirect URIs"**

Click **"+ ADD URI"**

Add this **exact** URI:
```
http://localhost:54321/auth/v1/callback
```

**Important Notes**:
- ✅ Use `http` (not `https`) for localhost
- ✅ Port must be `54321` (Supabase's API port)
- ✅ Path must be `/auth/v1/callback` (exact)
- ✅ **No trailing slash** at the end
- ✅ Copy-paste to avoid typos

### **Step 4: Add Authorized JavaScript Origins (Recommended)**

Scroll up to **"Authorized JavaScript origins"**

Click **"+ ADD URI"**

Add these URIs (one at a time):
```
http://localhost:3000
```
```
http://localhost:54321
```

### **Step 5: Save**

1. Scroll to the bottom
2. Click **"SAVE"**
3. Wait for the green "OAuth client updated" message

---

## 🎯 Complete Configuration

After saving, your OAuth 2.0 Client should have:

### **Authorized JavaScript origins:**
```
http://localhost:3000
http://localhost:54321
```

### **Authorized redirect URIs:**
```
http://localhost:54321/auth/v1/callback
```

---

## 🧪 Test Again

1. **No restart needed** - Google updates are instant
2. Clear your browser cache (or use incognito/private mode)
3. Go to: `http://localhost:3000/signup`
4. Click **"🔵 Sign up with Google"**
5. Should redirect to Google sign-in ✅
6. After authorization, should redirect back to your app ✅
7. Should land on `/dashboard` ✅

---

## 🚨 Still Not Working?

### **Issue: Same error after adding URI**

**Check**:
1. Did you save the changes in Google Cloud Console?
2. Is the URI **exactly** `http://localhost:54321/auth/v1/callback`?
3. No extra spaces or trailing slashes?
4. Try in an incognito/private window (clears old OAuth state)

### **Issue: Different error**

**If you see**:
- "Access blocked: This app's request is invalid"
  - Check OAuth consent screen configuration
  - Add your email as a test user
  
- "This app hasn't been verified"
  - This is normal for development
  - Click "Advanced" → "Go to [Your App] (unsafe)"
  
- "Admin has not granted permission"
  - Your Google Workspace admin needs to approve
  - Or use a personal Gmail account for testing

### **Issue: Works but shows wrong redirect URI**

Clear browser cookies/cache or test in incognito mode.

---

## 📋 Checklist

Before testing:
- [ ] Opened Google Cloud Console
- [ ] Found OAuth 2.0 Client ID
- [ ] Added `http://localhost:54321/auth/v1/callback` to redirect URIs
- [ ] Added `http://localhost:3000` to JavaScript origins
- [ ] Clicked "Save"
- [ ] Saw "OAuth client updated" confirmation

Test:
- [ ] Opened `http://localhost:3000/signup` in browser
- [ ] Clicked "Sign up with Google"
- [ ] Redirected to Google sign-in page (no error)
- [ ] Signed in with Google account
- [ ] Redirected back to app
- [ ] Landed on `/dashboard`
- [ ] Saw user info displayed

---

## 🎓 Why This Happens

**OAuth Security**: Google requires you to pre-register **exact** redirect URIs to prevent OAuth hijacking attacks. This ensures that OAuth tokens can only be sent to URIs you control.

**Common Mistake**: Developers often register the frontend URL (`http://localhost:3000`) but forget that Supabase Auth handles the callback on its own API port (`54321`).

---

## 🌐 When You Deploy to Production

You'll need to add your production redirect URI too:

```
https://yourdomain.com/auth/v1/callback
```

And JavaScript origin:
```
https://yourdomain.com
```

Same rules apply:
- ✅ Use `https` for production
- ✅ Exact domain
- ✅ Exact path
- ✅ No trailing slash

---

## ✅ After This Fix

Once the redirect URI is added, your Google OAuth will work perfectly:

1. Click "Sign up with Google"
2. → Redirects to Google
3. → You authorize
4. → Redirects to `http://localhost:54321/auth/v1/callback`
5. → Supabase processes OAuth response
6. → Creates user account
7. → Auto-verifies email
8. → Redirects to `/dashboard`
9. → You're logged in! 🎉

---

**Add the redirect URI in Google Cloud Console and you're good to go!** 🚀

**Google Cloud Console**: https://console.cloud.google.com/apis/credentials
