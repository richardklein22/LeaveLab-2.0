# Known Issues - LeaveLab Subscription System

**Last Updated:** October 17, 2025  
**Version:** 1.0

---

## 🚨 High Priority

> Issues that significantly impact core functionality or user experience.

**None currently identified** ✅

---

## ⚠️ Medium Priority

> Issues that impact some users or have acceptable workarounds.

### 1. Stripe Webhook Latency
**Issue:** There can be a 1-3 second delay between completing Stripe checkout and the webhook updating the user's subscription status in the database.

**Impact:**
- Users may briefly see their old tier after returning from Stripe
- Refreshing the page or waiting a few seconds resolves it

**Workaround:**
- Show "Processing your subscription..." message on success redirect
- Auto-refresh subscription status after 2-3 seconds

**Fix Proposed:**
- Implement optimistic UI updates
- Add polling mechanism for subscription status after checkout
- Show loading state during webhook processing

**Priority:** Medium  
**Assigned To:** Future sprint  
**Status:** Documented

---

### 2. Safari Cookie Restrictions (Third-Party Cookies)
**Issue:** Safari's Intelligent Tracking Prevention (ITP) may interfere with Stripe checkout redirects or OAuth flows if cookies are blocked.

**Impact:**
- Some Safari users may experience issues with Stripe Checkout
- OAuth login may fail if third-party cookies are blocked

**Workaround:**
- Users can enable "Allow all cookies" in Safari settings
- Use Safari's "Privacy Preserving Ad Measurement" exception

**Fix Proposed:**
- Implement Stripe's SCA-compliant payment intents API
- Use first-party cookies for all auth flows
- Add user guidance if cookies are blocked

**Priority:** Medium  
**Assigned To:** Phase 6 (Browser Compatibility)  
**Status:** Monitoring

---

## ℹ️ Low Priority

> Minor issues with minimal user impact.

### 1. Loading Skeleton Placeholder
**Issue:** Some pages show a generic loading spinner instead of content-aware skeletons.

**Impact:**
- Slightly less polished user experience
- No functional impact

**Affected Pages:**
- `/subscription` - Uses generic Loader2 component
- `/premium-content` - Uses generic loading message

**Fix Proposed:**
- Replace with Skeleton components that match content layout
- Improves perceived performance

**Priority:** Low  
**Assigned To:** Agent 3 (UI Polish)  
**Status:** Enhancement planned

---

### 2. Mobile Viewport Height on Safari iOS
**Issue:** On Safari iOS, the viewport height calculation doesn't account for the browser chrome (address bar, toolbar).

**Impact:**
- Some full-height sections may be slightly cut off on mobile Safari
- Scrolling reveals hidden content

**Affected Pages:**
- Auth pages (login, signup) with centered forms
- Any pages using `h-screen` Tailwind class

**Workaround:**
- Users can scroll to see hidden content
- Scrolling causes address bar to hide, revealing full content

**Fix Proposed:**
- Use `dvh` (dynamic viewport height) instead of `vh`
- Replace `h-screen` with `min-h-screen` where appropriate
- Test with Safari 15+

**Priority:** Low  
**Assigned To:** Agent 3 (Mobile Responsiveness)  
**Status:** Enhancement planned

---

### 3. Console Warning: SWR Dedupe Interval
**Issue:** Browser console shows informational message about SWR deduping interval.

**Impact:**
- Console noise in development
- No functional impact

**Message:**
```
SWR: Request for '/api/v1/subscriptions/status' deduplicated
```

**Fix Proposed:**
- This is expected behavior and helps performance
- Can be silenced by adjusting SWR configuration
- Consider acceptable as is

**Priority:** Low  
**Status:** Not a bug - expected behavior

---

### 4. Stripe Customer Portal Opens in Same Tab
**Issue:** Customer Portal opens in the same browser tab, requiring users to navigate back.

**Impact:**
- Slightly annoying UX
- Users must use back button or close tab

**Fix Proposed:**
- Option 1: Open Customer Portal in new tab (`target="_blank"`)
- Option 2: Use iframe embed (more complex)
- Option 3: Keep current behavior (Stripe best practice)

**Priority:** Low  
**Status:** Under review - Stripe recommends same-tab

---

## 🔬 Testing Notes

### Issues Found During Testing

_Document any issues found during QA testing here:_

**Example Format:**
```markdown
### Issue Title
**Found By:** Name
**Date:** YYYY-MM-DD
**Severity:** High/Medium/Low
**Description:** What happened
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3
**Expected:** What should happen
**Actual:** What actually happened
**Browser:** Chrome 118, Safari 17, etc.
**Status:** Open/In Progress/Fixed
```

---

## 🐛 Resolved Issues

> Issues that have been fixed.

### 1. TypeScript Errors in Subscription Middleware ✅ **FIXED**
**Issue:** TypeScript compilation errors due to Supabase nested select types.

**Fixed By:** Phase 4 implementation  
**Fix Date:** October 17, 2025  
**Solution:** Added proper array/object handling for Supabase nested queries

---

### 2. Pricing Display Incorrect ✅ **FIXED**
**Issue:** Prices were showing as £0.70 instead of £70 due to double division by 100.

**Fixed By:** Phase 3 implementation  
**Fix Date:** October 17, 2025  
**Solution:** Updated `formatPrice` function to accept pounds directly

---

### 3. Authentication Redirect Not Working ✅ **FIXED**
**Issue:** Users weren't redirected back to pricing page after login.

**Fixed By:** Phase 3 implementation  
**Fix Date:** October 17, 2025  
**Solution:** Added `redirect` query parameter handling in login/OAuth flows

---

## 📋 Issue Tracking

**Open Issues:** 6  
**High Priority:** 0  
**Medium Priority:** 2  
**Low Priority:** 4

**Recent Fixes:** 3  
**In Progress:** 0

---

## 🔄 How to Report New Issues

1. **Check if already documented** - Search this file first
2. **Gather information:**
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/device info
   - Screenshots if applicable
3. **Add to this file** in the appropriate priority section
4. **Notify team** via your issue tracking system
5. **Update status** as issue progresses

---

## 📊 Issue Severity Definitions

**High Priority:**
- Blocks core functionality
- Affects all or most users
- No acceptable workaround
- Security vulnerability
- Data loss or corruption

**Medium Priority:**
- Impacts some users
- Has acceptable workaround
- Affects non-critical functionality
- Performance degradation

**Low Priority:**
- Minor visual issues
- Affects very few users
- Has easy workaround
- Enhancement request
- Documentation issue

---

**Last Review Date:** October 17, 2025  
**Next Review Date:** Before production deployment

