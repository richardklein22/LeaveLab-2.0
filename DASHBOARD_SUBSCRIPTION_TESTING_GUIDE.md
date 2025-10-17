# Dashboard Subscription Status - Testing Guide

## Overview
This guide helps you test the new subscription status display on the dashboard.

## Prerequisites
- Development server running (`npm run dev`)
- Supabase local setup running
- At least one test user account

## Test Scenarios

### Scenario 1: Free Tier User Experience

**Setup:**
1. Log in with a user account that has no paid subscription
2. Navigate to `/dashboard`

**Expected Results:**
- ✅ Header shows "Free Plan" badge with gray outline
- ✅ Header shows "Upgrade" button (default variant, prominent)
- ✅ Below header shows blue upgrade alert: "Unlock Premium Features"
- ✅ Alert includes description and "View Plans" button
- ✅ Clicking any upgrade button redirects to `/pricing`

**Visual:**
```
┌─────────────────────────────────────────────────┐
│ Welcome to LeaveLab!     [Free Plan] [Upgrade] [Logout] │
│ You're successfully signed in.                  │
├─────────────────────────────────────────────────┤
│ 💫 Unlock Premium Features                      │
│ You're currently on the Free Plan. Upgrade...   │
│ [View Plans →]                                   │
└─────────────────────────────────────────────────┘
```

### Scenario 2: Basic Tier User Experience

**Setup:**
1. Create a Basic tier subscription for a test user
2. Log in and navigate to `/dashboard`

**Expected Results:**
- ✅ Header shows "Basic Plan" badge with blue styling
- ✅ Header shows "Upgrade" button (outline variant)
- ✅ Below header shows purple upgrade alert: "Upgrade to Premium"
- ✅ Alert is more subtle than Free tier alert
- ✅ Alert includes "Learn More" button
- ✅ Clicking upgrade button redirects to `/pricing`

**Visual:**
```
┌─────────────────────────────────────────────────┐
│ Welcome to LeaveLab!    [Basic Plan] [Upgrade] [Logout] │
│ You're successfully signed in.                  │
├─────────────────────────────────────────────────┤
│ 💫 Upgrade to Premium                            │
│ Get the most out of LeaveLab with Premium...    │
│ [Learn More →]                                   │
└─────────────────────────────────────────────────┘
```

### Scenario 3: Premium Tier User Experience

**Setup:**
1. Create a Premium tier subscription for a test user
2. Log in and navigate to `/dashboard`

**Expected Results:**
- ✅ Header shows "Premium Plan" badge with purple-pink gradient
- ✅ Badge includes sparkle icon ✨
- ✅ NO upgrade button shown in header
- ✅ NO upgrade alert shown below header
- ✅ Clean, uncluttered premium experience

**Visual:**
```
┌─────────────────────────────────────────────────┐
│ Welcome to LeaveLab!    [✨ Premium Plan] [Logout] │
│ You're successfully signed in.                  │
├─────────────────────────────────────────────────┤
│ [Account Card]           [Quick Actions Card]    │
└─────────────────────────────────────────────────┘
```

### Scenario 4: Loading State

**Setup:**
1. Log in and navigate to `/dashboard`
2. Observe initial load

**Expected Results:**
- ✅ Header shows loading spinner while subscription data loads
- ✅ Upgrade alert section is empty (no layout shift)
- ✅ Once loaded, correct tier information appears
- ✅ Smooth transition from loading to loaded state

### Scenario 5: Mobile Responsiveness

**Setup:**
1. Open dashboard on mobile device or resize browser to mobile width
2. Test with any tier

**Expected Results:**
- ✅ Header wraps to multiple lines gracefully
- ✅ Tier badge and buttons stack vertically if needed
- ✅ All buttons maintain tap-target size (minimum 44x44px)
- ✅ Upgrade alert is readable and properly formatted
- ✅ No horizontal scroll

### Scenario 6: Navigation Flow

**Setup:**
1. From dashboard, click any upgrade button
2. Complete checkout flow
3. Return to dashboard

**Expected Results:**
- ✅ Clicking "Upgrade" redirects to `/pricing`
- ✅ After successful subscription upgrade, tier badge updates
- ✅ Upgrade prompts disappear after reaching Premium
- ✅ No need to refresh page (SWR auto-revalidates)

## Manual Testing Checklist

### Functionality
- [ ] Free tier badge displays correctly
- [ ] Basic tier badge displays correctly
- [ ] Premium tier badge displays correctly
- [ ] Upgrade button appears for Free tier
- [ ] Upgrade button appears for Basic tier
- [ ] Upgrade button hidden for Premium tier
- [ ] Upgrade alert shows for Free tier
- [ ] Upgrade alert shows for Basic tier
- [ ] Upgrade alert hidden for Premium tier
- [ ] All upgrade buttons link to /pricing
- [ ] Loading spinner shows during initial load

### Visual Design
- [ ] Free tier badge has gray outline
- [ ] Basic tier badge has blue styling
- [ ] Premium tier badge has gradient background
- [ ] Premium tier badge has sparkle icon
- [ ] Free tier alert has blue theme
- [ ] Basic tier alert has purple theme
- [ ] All text is readable (proper contrast)
- [ ] Icons render correctly

### Responsive Design
- [ ] Desktop layout (>768px) looks good
- [ ] Tablet layout (768px-1024px) looks good
- [ ] Mobile layout (<768px) looks good
- [ ] Header wraps properly on small screens
- [ ] Buttons are tap-friendly on mobile
- [ ] No horizontal overflow

### Edge Cases
- [ ] Handles missing subscription data gracefully
- [ ] Falls back to Free tier if API error
- [ ] Loading state doesn't cause layout shift
- [ ] Works with very long email addresses
- [ ] Works with multiple rapid tier changes

## Automated Testing (Future)

### Component Tests
```tsx
// Test tier badge rendering
test('renders Free tier badge correctly')
test('renders Basic tier badge correctly')
test('renders Premium tier badge correctly')

// Test upgrade button visibility
test('shows upgrade button for Free tier')
test('shows upgrade button for Basic tier')
test('hides upgrade button for Premium tier')

// Test upgrade alerts
test('shows Free tier upgrade alert')
test('shows Basic tier upgrade alert')
test('hides Premium tier upgrade alert')

// Test loading states
test('shows loading spinner while fetching')
test('hides upgrade alert during loading')
```

### Integration Tests
```tsx
// Test navigation
test('clicking upgrade button navigates to pricing')
test('tier updates after subscription change')
test('auto-refreshes subscription data every 5 minutes')
```

## Troubleshooting

### Issue: Badge not showing
**Solution:** Check browser console for useSubscription errors. Ensure API route is accessible.

### Issue: Wrong tier displayed
**Solution:** Clear browser cache and localStorage. Check database subscription status.

### Issue: Upgrade button not linking
**Solution:** Verify /pricing route exists and is accessible.

### Issue: Loading state stuck
**Solution:** Check network tab for failed API calls. Verify Supabase connection.

### Issue: Layout looks broken on mobile
**Solution:** Clear Tailwind cache and rebuild. Check for CSS conflicts.

## Success Criteria

✅ All tier badges render correctly
✅ Upgrade buttons show/hide based on tier
✅ Upgrade alerts display appropriately
✅ Navigation to pricing works
✅ Mobile responsive
✅ No performance issues
✅ No console errors
✅ Matches design specifications

## Next Steps After Testing

1. If all tests pass → Mark Phase 4 dashboard task complete
2. Test upgrade flow end-to-end (dashboard → pricing → checkout → back to dashboard)
3. Monitor for any user feedback or issues
4. Consider A/B testing upgrade prompt messaging
5. Track conversion metrics (upgrades from dashboard vs other pages)

---

**Last Updated:** October 17, 2025
**Feature:** Dashboard Subscription Status
**Status:** Ready for Testing

