# Dashboard Subscription Status - Visual Guide

## Component Layout

### Free Tier User View
```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard Header                                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Welcome to LeaveLab!              [Free Plan] [Upgrade] [⎋]  │
│  You're successfully signed in.                               │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  💫 Unlock Premium Features                                   │
│                                                               │
│  You're currently on the Free Plan. Upgrade to unlock         │
│  advanced features, increased limits, and priority support.   │
│                                                               │
│  [View Plans →]                                               │
└──────────────────────────────────────────────────────────────┘
```

**Design Details:**
- Badge: `[Free Plan]` - Gray outline, simple text
- Button: `[Upgrade]` - Default variant (prominent blue)
- Alert: Blue background (`bg-blue-50/50`)
- CTA: "View Plans" with arrow icon

---

### Basic Tier User View
```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard Header                                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Welcome to LeaveLab!             [Basic Plan] [Upgrade] [⎋]  │
│  You're successfully signed in.                               │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  💫 Upgrade to Premium                                        │
│                                                               │
│  Get the most out of LeaveLab with Premium. Enjoy unlimited  │
│  access, advanced analytics, and exclusive features.          │
│                                                               │
│  [Learn More →]                                               │
└──────────────────────────────────────────────────────────────┘
```

**Design Details:**
- Badge: `[Basic Plan]` - Blue background (`bg-blue-100`), blue text
- Button: `[Upgrade]` - Outline variant (subtle)
- Alert: Purple background (`bg-purple-50/50`)
- CTA: "Learn More" with arrow icon (outline style)

---

### Premium Tier User View
```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard Header                                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Welcome to LeaveLab!           [✨ Premium Plan] [⎋]         │
│  You're successfully signed in.                               │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  [Your Account Card]           [Quick Actions Card]           │
│                                                               │
│  Email: user@example.com       Profile Settings              │
│  User ID: abc123              Account Settings               │
│  Email Verified: ✓                                            │
└──────────────────────────────────────────────────────────────┘
```

**Design Details:**
- Badge: `[✨ Premium Plan]` - Purple-pink gradient, white text, sparkle icon
- Button: NO upgrade button shown
- Alert: NO upgrade alert shown
- Clean, premium experience

---

## Color Schemes

### Free Tier
```css
Badge:
  - Border: border-gray-300
  - Background: transparent
  - Text: inherit

Button:
  - Variant: default
  - Background: primary
  - Text: white

Alert:
  - Border: border-blue-200
  - Background: bg-blue-50/50
  - Title: text-blue-900
  - Description: text-blue-800
  - Icon: text-blue-600
```

### Basic Tier
```css
Badge:
  - Border: border-blue-200
  - Background: bg-blue-100
  - Text: text-blue-700

Button:
  - Variant: outline
  - Border: border-gray-300
  - Text: inherit

Alert:
  - Border: border-purple-200
  - Background: bg-purple-50/50
  - Title: text-purple-900
  - Description: text-purple-800
  - Icon: text-purple-600
```

### Premium Tier
```css
Badge:
  - Border: none (border-0)
  - Background: bg-gradient-to-r from-purple-600 to-pink-600
  - Text: text-white
  - Icon: Sparkles (mr-1.5 h-3.5 w-3.5)

Button: Not shown

Alert: Not shown
```

---

## Mobile Responsive Breakpoints

### Desktop (>768px)
```
┌────────────────────────────────────────┐
│  Welcome!  [Badge] [Upgrade] [Logout]  │
└────────────────────────────────────────┘
```
- All items on one line
- Proper spacing with `gap-3` and `gap-4`
- Full-width alert below

### Tablet (768px - 1024px)
```
┌────────────────────────────────────────┐
│  Welcome!                              │
│  [Badge] [Upgrade] [Logout]            │
└────────────────────────────────────────┘
```
- Header wraps with `flex-wrap`
- Buttons stay together
- Alert adjusts width

### Mobile (<768px)
```
┌──────────────────────┐
│  Welcome!            │
│                      │
│  [Badge]             │
│  [Upgrade] [Logout]  │
│                      │
│  💫 Upgrade Alert    │
│  [View Plans →]      │
└──────────────────────┘
```
- Vertical stacking
- Full-width buttons with `tap-target` class
- Readable alert text

---

## Component Props API

### DashboardSubscriptionStatus

```tsx
interface DashboardSubscriptionStatusProps {
  showUpgradePrompt?: boolean; // Default: false
}
```

**Usage Examples:**

```tsx
// Header badge + upgrade button only
<DashboardSubscriptionStatus />

// Upgrade alert only
<DashboardSubscriptionStatus showUpgradePrompt />

// Both (used in dashboard)
<DashboardSubscriptionStatus />
<DashboardSubscriptionStatus showUpgradePrompt />
```

---

## Icon Usage

### Sparkles (✨)
- **Where:** Premium badge, all upgrade buttons, upgrade alerts
- **Size (Badge):** `h-3.5 w-3.5`
- **Size (Button):** `h-4 w-4`
- **Size (Alert):** `h-5 w-5`

### ArrowRight (→)
- **Where:** "View Plans" and "Learn More" buttons
- **Size:** `h-4 w-4`
- **Position:** `ml-2` (right side of button text)

### Loader2 (spinner)
- **Where:** Loading state in header
- **Size:** `h-4 w-4`
- **Animation:** `animate-spin`

---

## State Transitions

### Loading → Free Tier
```
[🔄 Spinner] → [Free Plan] [Upgrade]
                 ↓
          [Blue Upgrade Alert]
```

### Loading → Basic Tier
```
[🔄 Spinner] → [Basic Plan] [Upgrade]
                 ↓
          [Purple Upgrade Alert]
```

### Loading → Premium Tier
```
[🔄 Spinner] → [✨ Premium Plan]
                 ↓
               (No alert)
```

### After Upgrade
```
[Free Plan] [Upgrade] → User clicks → /pricing
                                         ↓
                                    Checkout
                                         ↓
                                    Success
                                         ↓
                             [✨ Premium Plan]
```

---

## Accessibility

### ARIA Attributes
- Alert component has `role="alert"`
- Buttons have visible text (not icon-only)
- Color is not the only indicator (icons + text)

### Keyboard Navigation
- All buttons are keyboard accessible
- Tab order: Badge (focusable=false) → Upgrade button → Logout button
- Enter/Space activates buttons

### Screen Reader Friendly
- Badge: "Free Plan" / "Basic Plan" / "Premium Plan"
- Button: "Upgrade" with visible text
- Alert: Title + Description structure

---

## Performance Considerations

### SWR Caching
- Subscription data cached for 5 minutes
- Revalidates on window focus
- Deduplicates requests within 2 seconds
- Keeps previous data while revalidating (no flicker)

### Component Optimization
- Client component only where needed
- Server component for static content
- Loading states prevent layout shift
- Conditional rendering (upgrade alerts only when needed)

### Network Efficiency
- Single API call for subscription data
- Automatic background revalidation
- Optimistic updates supported
- Error fallback to Free tier

---

## Integration with Existing Features

### Navigation
- Links to `/pricing` page (existing)
- Works with existing layout and navigation
- Maintains authentication state

### Styling
- Uses existing Shadcn UI components
- Follows Tailwind CSS conventions
- Consistent with app design system
- Responsive with existing breakpoints

### Hooks
- Uses existing `useSubscription` hook
- Compatible with SWR caching strategy
- Shares data with other subscription components
- No prop drilling needed

---

**Quick Reference:**

| Tier | Badge Style | Button Shown | Alert Theme | Icon |
|------|-------------|--------------|-------------|------|
| Free | Gray outline | Yes (default) | Blue | None |
| Basic | Blue solid | Yes (outline) | Purple | None |
| Premium | Purple-pink gradient | No | None | ✨ |

---

**File Locations:**
- Main Page: `src/app/(dashboard)/dashboard/page.tsx`
- Component: `src/app/(dashboard)/dashboard/components/DashboardSubscriptionStatus.tsx`
- Hook: `src/features/subscriptions/hooks/useSubscription.ts`
- Types: `src/features/subscriptions/types/subscription.ts`

**Related Pages:**
- Pricing: `/pricing` (destination for all upgrade buttons)
- Subscription: `/subscription` (manage existing subscription)
- Settings: `/settings` (account management)

---

**Last Updated:** October 17, 2025
**Feature:** Dashboard Subscription Status
**Version:** 1.0

