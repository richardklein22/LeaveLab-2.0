# Phase 4: Access Control - Testing Guide 🧪

**Quick testing guide to verify all Phase 4 features work correctly.**

---

## ✅ Pre-Test Checklist

Make sure you have:
- [x] Development server running (`npm run dev`)
- [x] Supabase local instance running
- [x] Test users in all three tiers (Free, Basic, Premium)
- [x] Browser with dev tools open

---

## 🧪 Test Suite

### **Test 1: Dashboard Subscription Badges** ⏱️ 2 minutes

**What to test:** Tier badges and upgrade buttons display correctly.

**Steps:**
1. Navigate to `http://localhost:3001/dashboard`
2. Check the badge in the top-right corner

**Expected Results:**

| User Tier | Badge Style | Upgrade Button |
|-----------|-------------|----------------|
| Free | Gray outline | ✅ Visible "Upgrade" button |
| Basic | Blue background | ✅ Visible "Upgrade" button |
| Premium | Purple gradient + sparkle icon | ❌ No upgrade button |

**Also Check:**
- Free tier users should see a blue upgrade prompt below the header
- Basic tier users should see a subtle purple upgrade prompt
- Premium tier users should see NO upgrade prompt

---

### **Test 2: Premium Content Page** ⏱️ 3 minutes

**What to test:** Content gating based on subscription tier.

**Steps:**
1. Navigate to `http://localhost:3001/premium-content`
2. Observe what content is displayed

**Expected Results:**

#### **Free Tier User:**
- ❌ Content is LOCKED
- ✅ See upgrade prompt: "Premium Content Locked"
- ✅ See preview cards (at 60% opacity):
  - Long-term Visa Guides
  - Accommodation Resources
  - One-on-One Support
- ✅ "Upgrade to Premium" button visible

#### **Basic Tier User:**
- ❌ Content is LOCKED (same as Free)
- ✅ See upgrade prompt
- ✅ Message: "Premium subscription required..."

#### **Premium Tier User:**
- ✅ Content is UNLOCKED
- ✅ See success message: "Welcome to Premium Content!"
- ✅ See full content sections:
  - Long-term Visa Information (2 cards)
  - Accommodation & Living (2 cards)
  - Expert Support (1 card)
- ✅ Tier badge shows "Premium"

---

### **Test 3: Server-Side API Protection** ⏱️ 5 minutes

**What to test:** Premium API endpoint only accessible to Premium users.

#### **Method 1: Browser Console Test**

**Steps:**
1. Open browser dev tools (F12)
2. Navigate to `/dashboard` (to be authenticated)
3. Open Console tab
4. Paste and run this code:

```javascript
fetch('/api/v1/premium/data', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(data => {
    console.log('Response:', data);
  })
  .catch(err => console.error('Error:', err));
```

**Expected Results:**

| User Tier | Status Code | Response |
|-----------|-------------|----------|
| Free | 403 | `{ "error": "Premium subscription required. Your current plan is Free." }` |
| Basic | 403 | `{ "error": "Premium subscription required. Your current plan is Basic." }` |
| Premium | 200 | Full premium data object with `analytics`, `insights`, `resources`, etc. |
| Not logged in | 401 | `{ "error": "Authentication required" }` |

#### **Method 2: cURL Test**

```bash
# Test as authenticated user (get session token first)
curl -i http://localhost:3001/api/v1/premium/data \
  -H "Cookie: YOUR_SESSION_COOKIE"

# Expected:
# Free/Basic: HTTP 403 with error message
# Premium: HTTP 200 with premium data JSON
```

#### **Method 3: Visual Test in Browser**

1. Navigate to `http://localhost:3001/api/v1/premium/data` directly
2. Browser should redirect to login if not authenticated
3. After login, check the JSON response

---

### **Test 4: Tier Upgrade Flow** ⏱️ 5 minutes

**What to test:** Content access changes immediately after upgrading.

**Steps:**
1. Start as Free tier user
2. Navigate to `/premium-content` → Should see locked content
3. Navigate to `/dashboard` → Click "Upgrade" button
4. Navigate to `/pricing` → Subscribe to Premium
5. Complete Stripe checkout (use test card `4242 4242 4242 4242`)
6. Return to site → Navigate to `/premium-content`

**Expected Result:**
- ✅ Content is now UNLOCKED
- ✅ Premium badge appears
- ✅ No upgrade buttons visible
- ✅ Dashboard shows "Premium Plan" badge

**Also test API access:**
```javascript
// Should now return full data (was 403 before)
fetch('/api/v1/premium/data', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);
```

---

### **Test 5: Responsive Design** ⏱️ 3 minutes

**What to test:** UI components work on mobile devices.

**Steps:**
1. Open browser dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. Test all pages:
   - `/dashboard`
   - `/premium-content`
   - `/pricing`

**Expected Results:**
- ✅ Tier badges resize appropriately
- ✅ Upgrade prompts are mobile-friendly
- ✅ Premium content cards stack vertically
- ✅ All text is readable
- ✅ Buttons are tap-friendly (not too small)

---

## 🐛 Common Issues & Fixes

### **Issue: "Authentication required" error**
**Cause:** User is not logged in or session expired.  
**Fix:** Navigate to `/login` and sign in again.

### **Issue: Premium content still locked after upgrading**
**Cause:** Frontend cache or Stripe webhook delay.  
**Fix:** 
1. Wait 5-10 seconds for webhook processing
2. Refresh the page (F5)
3. Check `/subscription` page to verify tier

### **Issue: Upgrade button still visible for Premium users**
**Cause:** Subscription data not loaded or cache issue.  
**Fix:**
1. Open browser dev tools → Network tab
2. Refresh page
3. Check `/api/v1/subscriptions/status` response
4. Should show `tier.name: "premium"`

### **Issue: API returns 500 error**
**Cause:** Database connection or Supabase configuration issue.  
**Fix:**
1. Check Supabase is running: `supabase status`
2. Check `.env.local` has correct Supabase credentials
3. Check server logs for detailed error

---

## 📊 Test Results Checklist

Use this checklist to track your testing:

- [ ] **Dashboard badges display correctly for all tiers**
  - [ ] Free tier: Gray outline badge + upgrade button
  - [ ] Basic tier: Blue badge + upgrade button
  - [ ] Premium tier: Purple gradient badge + no upgrade button

- [ ] **Upgrade prompts display correctly**
  - [ ] Free tier: Blue alert with "Unlock Premium Features"
  - [ ] Basic tier: Purple alert with "Upgrade to Premium"
  - [ ] Premium tier: No upgrade prompt

- [ ] **Premium content page gates correctly**
  - [ ] Free/Basic: Locked content + upgrade prompt
  - [ ] Premium: Full content access + success message

- [ ] **Premium API endpoint protects correctly**
  - [ ] Free/Basic: Returns 403 Forbidden
  - [ ] Premium: Returns 200 OK with data
  - [ ] Not logged in: Returns 401 Unauthorized

- [ ] **Tier upgrade flow works**
  - [ ] Content unlocks immediately after upgrading
  - [ ] API access granted after upgrading
  - [ ] Badges update after upgrading

- [ ] **Mobile responsiveness**
  - [ ] All components display correctly on mobile
  - [ ] Text is readable
  - [ ] Buttons are tap-friendly

---

## ✅ When All Tests Pass

If all tests pass, Phase 4 is **production-ready**! ✨

**Next steps:**
1. Mark Phase 4 as complete ✅
2. Move to **Phase 5: Testing & Polish**
   - E2E testing with Playwright
   - Performance optimization
   - Final bug fixes
   - Documentation

---

## 🚨 If Tests Fail

1. **Document the failing test** (which test, expected vs actual)
2. **Check the browser console** for JavaScript errors
3. **Check the server logs** for backend errors
4. **Check Supabase logs** for database errors
5. **Ask for help** with specific error messages

---

## 🎯 Performance Benchmarks

Optional performance checks:

- [ ] Dashboard loads in < 1 second
- [ ] Premium content page loads in < 1.5 seconds
- [ ] API endpoint responds in < 200ms
- [ ] No console errors or warnings
- [ ] No memory leaks (check Chrome DevTools Memory tab)

---

**Happy Testing!** 🧪✨

