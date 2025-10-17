# QA Testing Checklist - LeaveLab Subscription System

**Last Updated:** October 17, 2025  
**Version:** 1.0  
**Tested By:** _____________  
**Date:** _____________

---

## 📋 How to Use This Checklist

1. Test all items in order
2. Mark [x] for passing tests
3. Mark [ ] and add notes for failing tests
4. Document any bugs in `KNOWN_ISSUES.md`
5. Retest after fixes

---

## 🔐 Authentication & Onboarding

### Email Authentication
- [ ] **Signup with email works**
  - Navigate to `/signup`
  - Enter email, password, display name
  - Submit form
  - ✅ User created in database
  - ✅ Verification email sent (if enabled)
  - ✅ Redirected to dashboard or verify-email page

- [ ] **Email verification works**
  - Click verification link in email
  - ✅ Email verified in Supabase
  - ✅ User can log in

- [ ] **Login with email works**
  - Navigate to `/login`
  - Enter email and password
  - Submit form
  - ✅ Redirected to dashboard
  - ✅ Session persists

- [ ] **Logout works**
  - Click logout button
  - ✅ Session cleared
  - ✅ Redirected to home/login
  - ✅ Cannot access protected routes

- [ ] **Password reset works**
  - Navigate to `/reset-password`
  - Enter email
  - ✅ Reset email sent
  - Click reset link
  - ✅ Redirected to update-password page
  - Enter new password
  - ✅ Password updated
  - ✅ Can log in with new password

### OAuth Authentication
- [ ] **Google OAuth signup works**
  - Click "Continue with Google" on signup page
  - Authorize with Google
  - ✅ User created in database
  - ✅ Profile created with Google name
  - ✅ Redirected to dashboard

- [ ] **Google OAuth login works**
  - Click "Continue with Google" on login page
  - Authorize with Google (existing account)
  - ✅ Redirected to dashboard
  - ✅ Session persists

### Session Management
- [ ] **Session persists across page refresh**
  - Log in
  - Refresh page
  - ✅ Still logged in
  - ✅ No re-authentication required

- [ ] **Session expires after timeout**
  - Log in
  - Wait for session timeout (or mock it)
  - ✅ User logged out
  - ✅ Redirected to login

- [ ] **Protected routes require authentication**
  - Try accessing `/dashboard` without login
  - ✅ Redirected to `/login`
  - Try accessing `/subscription` without login
  - ✅ Redirected to `/login`
  - Try accessing `/premium-content` without login
  - ✅ Redirected to `/login`

---

## 💳 Pricing & Checkout Flow

### Pricing Page
- [ ] **Pricing page loads correctly**
  - Navigate to `/pricing`
  - ✅ All three tiers display (Free, Basic, Premium)
  - ✅ Prices display correctly (£0, £70, £100)
  - ✅ Features list shows for each tier
  - ✅ Page responsive on mobile

- [ ] **Monthly/Annual toggle works**
  - Click toggle to "Annual"
  - ✅ Prices update to annual (£700, £1000 or discounted)
  - ✅ "per year" label displays
  - Toggle back to "Monthly"
  - ✅ Prices revert to monthly

- [ ] **Subscribe button for unauthenticated users**
  - Click "Subscribe to Basic" without being logged in
  - ✅ Redirected to `/login?redirect=/pricing`
  - Log in
  - ✅ Redirected back to `/pricing`

### Checkout Flow
- [ ] **Create Basic subscription (Monthly)**
  - Log in as Free user
  - Navigate to `/pricing`
  - Click "Subscribe to Basic" (monthly)
  - ✅ Redirected to Stripe Checkout
  - ✅ Checkout URL valid
  - ✅ Session contains correct price
  - Enter test card: `4242 4242 4242 4242`
  - ✅ Payment processes
  - ✅ Redirected back to site
  - ✅ Success message displays

- [ ] **Create Premium subscription (Monthly)**
  - Log in as Free user
  - Navigate to `/pricing`
  - Click "Subscribe to Premium" (monthly)
  - ✅ Redirected to Stripe Checkout
  - Complete payment with test card
  - ✅ Subscription created
  - ✅ User has Premium access

- [ ] **Create Basic subscription (Annual)**
  - Log in as Free user
  - Toggle to "Annual"
  - Click "Subscribe to Basic"
  - ✅ Annual price ID used
  - ✅ Checkout shows annual billing

- [ ] **Already subscribed user sees correct messaging**
  - Log in as Basic user
  - Navigate to `/pricing`
  - Click "Subscribe to Basic"
  - ✅ Shows "Current Plan" or prevents duplicate subscription
  - ✅ Clear error message if attempted

- [ ] **Cancel during checkout returns correctly**
  - Start checkout flow
  - Click "Back" in Stripe Checkout
  - ✅ Redirected to `/pricing?cancelled=true`
  - ✅ No subscription created
  - ✅ User remains on Free tier

### Webhook Processing
- [ ] **Webhook processes checkout.session.completed**
  - Complete a checkout
  - ✅ Webhook received by `/api/v1/subscriptions/webhook`
  - ✅ Subscription created in database
  - ✅ User tier updated
  - ✅ n8n webhook triggered (if configured)

- [ ] **Webhook processes subscription.updated**
  - Upgrade a subscription in Stripe
  - ✅ Webhook received
  - ✅ Database updated with new tier
  - ✅ User access updated immediately

- [ ] **Webhook processes subscription.deleted**
  - Cancel a subscription in Stripe
  - ✅ Webhook received
  - ✅ Subscription status updated to 'cancelled'
  - ✅ User access reverts to Free tier

---

## 🎫 Subscription Management

### Subscription Status Page
- [ ] **Subscription status displays correctly**
  - Log in as Basic user
  - Navigate to `/subscription`
  - ✅ Current tier shows "Basic"
  - ✅ Billing cycle shows (Monthly/Annual)
  - ✅ Next billing date displays
  - ✅ "Manage Billing" button visible

- [ ] **Free tier user sees correct status**
  - Log in as Free user
  - Navigate to `/subscription`
  - ✅ Shows "Free Plan"
  - ✅ Upgrade prompts visible
  - ✅ Link to pricing page

- [ ] **Premium tier user sees correct status**
  - Log in as Premium user
  - Navigate to `/subscription`
  - ✅ Shows "Premium Plan"
  - ✅ All features listed
  - ✅ No upgrade prompts

### Customer Portal
- [ ] **Customer Portal opens correctly**
  - Log in as subscribed user (Basic/Premium)
  - Navigate to `/subscription`
  - Click "Manage Billing"
  - ✅ Stripe Customer Portal opens
  - ✅ Subscription details visible
  - ✅ Can update payment method
  - ✅ Can cancel subscription

- [ ] **Update payment method**
  - Open Customer Portal
  - Click "Update payment method"
  - Enter new card details
  - ✅ Card updated in Stripe
  - ✅ Changes reflected immediately

- [ ] **Cancel subscription via portal**
  - Open Customer Portal
  - Click "Cancel subscription"
  - Confirm cancellation
  - ✅ Subscription cancelled
  - ✅ Access continues until period end
  - ✅ Status updated in database

### Upgrade/Downgrade
- [ ] **Upgrade from Free to Basic**
  - Log in as Free user
  - Subscribe to Basic tier
  - ✅ Subscription created
  - ✅ Access granted immediately
  - ✅ Dashboard badge updates

- [ ] **Upgrade from Basic to Premium**
  - Log in as Basic user
  - Navigate to `/pricing`
  - Click "Subscribe to Premium"
  - ✅ Proration handled by Stripe
  - ✅ Immediate upgrade
  - ✅ Premium access granted

- [ ] **Downgrade from Premium to Basic**
  - Log in as Premium user
  - Open Customer Portal
  - Change plan to Basic
  - ✅ Downgrade scheduled for end of period
  - ✅ User notified of change
  - ✅ Premium access continues until period end

- [ ] **Cancelled subscription behavior**
  - Cancel a subscription
  - ✅ Access continues until period end
  - ✅ "Cancelled" status shows with end date
  - ✅ After period end, reverts to Free
  - ✅ Can resubscribe anytime

---

## 🔒 Access Control & Content Gating

### Dashboard
- [ ] **Free tier badge displays correctly**
  - Log in as Free user
  - Navigate to `/dashboard`
  - ✅ Badge shows "Free Plan"
  - ✅ Upgrade button visible
  - ✅ Upgrade prompt alert displays

- [ ] **Basic tier badge displays correctly**
  - Log in as Basic user
  - Navigate to `/dashboard`
  - ✅ Badge shows "Basic Plan" (blue)
  - ✅ Upgrade button visible
  - ✅ Subtle upgrade prompt for Premium

- [ ] **Premium tier badge displays correctly**
  - Log in as Premium user
  - Navigate to `/dashboard`
  - ✅ Badge shows "Premium Plan" (purple gradient + sparkle)
  - ✅ No upgrade button
  - ✅ No upgrade prompts

### Premium Content Page
- [ ] **Free user sees locked content**
  - Log in as Free user
  - Navigate to `/premium-content`
  - ✅ Content is locked
  - ✅ Upgrade prompt displays
  - ✅ Preview cards at 60% opacity
  - ✅ "Upgrade to Premium" button visible

- [ ] **Basic user sees locked content**
  - Log in as Basic user
  - Navigate to `/premium-content`
  - ✅ Content is locked (same as Free)
  - ✅ Upgrade prompt for Premium

- [ ] **Premium user sees unlocked content**
  - Log in as Premium user
  - Navigate to `/premium-content`
  - ✅ Content is fully visible
  - ✅ Success message: "Welcome to Premium Content!"
  - ✅ All content cards display properly
  - ✅ Tier badge shows "Premium"

### API Protection
- [ ] **Premium API endpoint protects correctly**
  - Open browser console
  - Log in as Free user
  - Run: `fetch('/api/v1/premium/data', {credentials:'include'}).then(r=>r.json()).then(console.log)`
  - ✅ Returns 403 Forbidden
  - ✅ Error message: "Premium subscription required. Your current plan is Free."

- [ ] **Basic user cannot access Premium API**
  - Log in as Basic user
  - Run same fetch command
  - ✅ Returns 403 Forbidden
  - ✅ Error message mentions Basic plan

- [ ] **Premium user can access Premium API**
  - Log in as Premium user
  - Run same fetch command
  - ✅ Returns 200 OK
  - ✅ Full premium data object returned
  - ✅ Contains analytics, insights, resources

- [ ] **Unauthenticated user gets 401**
  - Log out
  - Run fetch command
  - ✅ Returns 401 Unauthorized
  - ✅ Error message: "Authentication required"

---

## 🎯 Trial Period (If Implemented)

- [ ] **Trial activates on first Premium subscription**
  - Subscribe to Premium with trial enabled
  - ✅ Trial starts immediately
  - ✅ No charge during trial
  - ✅ Full Premium access granted

- [ ] **Trial days remaining display**
  - During trial period
  - ✅ Dashboard shows "X days remaining"
  - ✅ `/subscription` page shows trial status

- [ ] **Trial converts to paid subscription**
  - Wait for trial to end (or mock it)
  - ✅ First payment processed
  - ✅ Subscription continues
  - ✅ No interruption in access

- [ ] **Trial cancellation works**
  - Cancel during trial period
  - ✅ Subscription cancelled
  - ✅ No charge applied
  - ✅ Access continues until trial end

---

## 📱 Mobile Responsiveness

### General Mobile Testing
- [ ] **All pages load on mobile (375px width)**
  - Test viewport: iPhone SE (375x667)
  - `/` - Home
  - `/login` - Login page
  - `/signup` - Signup page
  - `/pricing` - Pricing page
  - `/dashboard` - Dashboard
  - `/subscription` - Subscription management
  - `/premium-content` - Premium content
  - ✅ No horizontal scrolling
  - ✅ All text readable
  - ✅ All buttons tappable

### Pricing Page Mobile
- [ ] **Pricing cards stack on mobile**
  - Navigate to `/pricing` on mobile
  - ✅ Cards stack vertically
  - ✅ Each card full width
  - ✅ Features list readable

- [ ] **Toggle button touch-friendly**
  - ✅ Toggle button at least 44x44px
  - ✅ Easy to tap
  - ✅ Visual feedback on tap

- [ ] **Subscribe buttons accessible**
  - ✅ Buttons at least 44px tall
  - ✅ Adequate spacing between buttons
  - ✅ No accidental clicks

### Dashboard Mobile
- [ ] **Tier badge resizes appropriately**
  - ✅ Badge visible but not oversized
  - ✅ Text readable

- [ ] **Cards stack on mobile**
  - ✅ Account cards stack vertically
  - ✅ No overlap

### Forms Mobile
- [ ] **Login form works on mobile**
  - ✅ Input fields full width
  - ✅ Keyboard doesn't obscure fields
  - ✅ Submit button accessible

- [ ] **Signup form works on mobile**
  - ✅ All fields accessible
  - ✅ Validation messages visible

### Tablet Testing (768px)
- [ ] **Pricing page works on tablet**
  - ✅ Cards display 2 or 3 columns
  - ✅ Layout looks intentional

- [ ] **Dashboard works on tablet**
  - ✅ Card grid appropriate
  - ✅ No wasted space

---

## 🌐 Browser Compatibility

### Chrome (Latest)
- [ ] **All features work in Chrome**
  - Authentication ✅
  - Checkout flow ✅
  - Subscription management ✅
  - Access control ✅
  - No console errors ✅

### Firefox (Latest)
- [ ] **All features work in Firefox**
  - Authentication ✅
  - Checkout flow ✅
  - Subscription management ✅
  - Access control ✅
  - No console errors ✅

### Safari (Latest)
- [ ] **All features work in Safari**
  - Authentication ✅
  - Checkout flow ✅
  - Subscription management ✅
  - Access control ✅
  - No console errors ✅
  - Note: Safari has stricter cookie policies

### Edge (Latest)
- [ ] **All features work in Edge**
  - Authentication ✅
  - Checkout flow ✅
  - Subscription management ✅
  - Access control ✅

### Mobile Browsers
- [ ] **Mobile Safari (iOS)**
  - All features work ✅
  - Touch interactions work ✅

- [ ] **Chrome Mobile (Android)**
  - All features work ✅
  - Touch interactions work ✅

---

## ⚡ Performance

### Page Load Times
- [ ] **Home page loads quickly**
  - ✅ Loads in < 2 seconds
  - ✅ First Contentful Paint < 1.5s

- [ ] **Pricing page loads quickly**
  - ✅ Loads in < 2 seconds
  - ✅ All tiers visible quickly

- [ ] **Dashboard loads quickly**
  - ✅ Loads in < 2 seconds
  - ✅ Subscription data loads quickly

### API Response Times
- [ ] **Subscription status API fast**
  - `/api/v1/subscriptions/status`
  - ✅ Responds in < 500ms

- [ ] **Tiers API fast**
  - `/api/v1/subscriptions/tiers`
  - ✅ Responds in < 300ms

- [ ] **Checkout API fast**
  - `/api/v1/subscriptions/checkout`
  - ✅ Responds in < 1000ms (Stripe call)

### Lighthouse Scores
- [ ] **Run Lighthouse audit**
  - Command: `npx lighthouse http://localhost:3001`
  - ✅ Performance > 85
  - ✅ Accessibility > 90
  - ✅ Best Practices > 90
  - ✅ SEO > 90

### Bundle Size
- [ ] **Check bundle size**
  - Run: `npm run build`
  - ✅ No warnings about large bundles
  - ✅ Total size reasonable (< 500KB)

### Console Errors
- [ ] **No console errors on any page**
  - Check console on all pages
  - ✅ No red errors
  - ✅ No unhandled promise rejections
  - Warnings OK if documented

---

## 🛡️ Security

### Authentication Security
- [ ] **Passwords not visible in network tab**
  - Login/signup
  - ✅ Password not in request body (or encrypted)
  - ✅ No passwords in console.log

- [ ] **Session tokens secure**
  - ✅ HttpOnly cookies used
  - ✅ Secure flag set (in production)
  - ✅ SameSite attribute set

### API Security
- [ ] **No API keys exposed in frontend**
  - Check Network tab and Sources
  - ✅ STRIPE_SECRET_KEY not visible
  - ✅ Only publishable key in frontend

- [ ] **Protected routes require authentication**
  - Try accessing API without auth
  - ✅ Returns 401 Unauthorized

- [ ] **Webhook signature verified**
  - Check `/api/v1/subscriptions/webhook/route.ts`
  - ✅ Stripe signature verified
  - ✅ Invalid signatures rejected

### XSS Protection
- [ ] **User input sanitized**
  - Try entering `<script>alert('xss')</script>` in forms
  - ✅ Script not executed
  - ✅ React escapes by default

### CSRF Protection
- [ ] **Forms protected**
  - ✅ Supabase handles CSRF protection
  - ✅ No custom forms vulnerable

---

## ♿ Accessibility

### Keyboard Navigation
- [ ] **All interactive elements accessible via keyboard**
  - Tab through all pages
  - ✅ All buttons reachable
  - ✅ All links reachable
  - ✅ All form fields reachable
  - ✅ Tab order logical

- [ ] **Enter key submits forms**
  - Focus on form field
  - Press Enter
  - ✅ Form submits

### Screen Reader
- [ ] **Form labels present**
  - ✅ All input fields have labels
  - ✅ Labels associated with inputs

- [ ] **Error messages announced**
  - Submit form with errors
  - ✅ Errors have `role="alert"`
  - ✅ Screen reader announces errors

- [ ] **Images have alt text**
  - ✅ All images have alt attributes
  - ✅ Decorative images have empty alt

### Color Contrast
- [ ] **Text readable**
  - ✅ Body text contrast > 4.5:1
  - ✅ Large text contrast > 3:1
  - ✅ Button text readable

- [ ] **Focus indicators visible**
  - Tab through page
  - ✅ Focus ring visible on all elements
  - ✅ Focus ring not removed

### ARIA Attributes
- [ ] **Modals have proper ARIA**
  - ✅ `role="dialog"`
  - ✅ `aria-modal="true"`
  - ✅ Focus trapped in modal

- [ ] **Buttons have proper labels**
  - Icon-only buttons
  - ✅ `aria-label` present

---

## 🐛 Edge Cases & Error Handling

### Network Errors
- [ ] **Handle network failures gracefully**
  - Throttle network to "Slow 3G"
  - Try loading pages
  - ✅ Loading states show
  - ✅ Error messages clear
  - ✅ Retry buttons present

### Payment Failures
- [ ] **Card declined handled**
  - Use test card: `4000 0000 0000 0002` (declined)
  - ✅ Clear error message
  - ✅ User can retry
  - ✅ No charge attempted

- [ ] **Insufficient funds handled**
  - Use test card: `4000 0000 0000 9995`
  - ✅ Appropriate error message

### Concurrent Requests
- [ ] **Double-click handled**
  - Rapidly click "Subscribe" button
  - ✅ Only one checkout session created
  - ✅ No duplicate subscriptions

### Session Expiration
- [ ] **Expired session handled**
  - Mock expired session
  - ✅ User redirected to login
  - ✅ Can complete action after re-login

### Already Subscribed
- [ ] **Duplicate subscription prevented**
  - Try subscribing to same tier
  - ✅ Error message clear
  - ✅ No duplicate charge

---

## 📊 Testing Summary

**Total Tests:** _____ / _____  
**Passing:** _____  
**Failing:** _____  
**Blocked:** _____

**Critical Issues Found:** _____  
**Medium Issues Found:** _____  
**Minor Issues Found:** _____

**Ready for Production?** [ ] Yes [ ] No

**Notes:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

---

## ✅ Sign-off

**Tested By:** _______________  
**Date:** _______________  
**Approved By:** _______________  
**Date:** _______________

---

**Next Steps After Testing:**
1. Fix all critical issues
2. Document known issues in `KNOWN_ISSUES.md`
3. Retest after fixes
4. Deploy to staging
5. Final production test

