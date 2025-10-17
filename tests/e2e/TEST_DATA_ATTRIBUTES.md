# Test Data Attributes Guide

To make E2E tests more reliable and maintainable, we use `data-testid` attributes on UI elements.

## 🎯 Why Use Data Attributes?

1. **Stable Selectors**: Class names and text content may change, but test IDs remain stable
2. **Clear Intent**: Explicitly marks elements intended for testing
3. **Better Performance**: Direct attribute selectors are faster than complex CSS selectors
4. **Self-Documenting**: Makes it clear which elements are testable

## 📋 Recommended Data Attributes

### Pricing Page Components

#### Pricing Cards
```tsx
<div data-testid="pricing-card" data-tier="basic">
  <h3 data-testid="tier-name">Basic</h3>
  <p data-testid="tier-price">£9.99</p>
  <button data-testid="subscribe-button">Subscribe</button>
</div>
```

#### Billing Toggle
```tsx
<div data-testid="billing-toggle">
  <button data-testid="billing-monthly">Monthly</button>
  <button data-testid="billing-annual">Annual</button>
</div>
```

#### Trial Banner
```tsx
<div data-testid="trial-banner">
  <p data-testid="trial-days">14-day free trial</p>
</div>
```

### Subscription Status Components

#### Subscription Card
```tsx
<div data-testid="subscription-status">
  <div data-testid="tier-badge" data-tier="premium">Premium</div>
  <div data-testid="status-badge" data-status="active">Active</div>
  <div data-testid="billing-info">
    <span data-testid="billing-cycle">Monthly</span>
    <span data-testid="next-billing-date">Jan 1, 2025</span>
    <span data-testid="next-billing-amount">£9.99</span>
  </div>
</div>
```

#### Management Buttons
```tsx
<button data-testid="manage-billing-button">Manage Billing</button>
<button data-testid="cancel-subscription-button">Cancel Subscription</button>
<button data-testid="upgrade-button">Upgrade</button>
```

### Dashboard Components

#### Subscription Widget
```tsx
<div data-testid="dashboard-subscription-widget">
  <h3 data-testid="current-tier">Premium</h3>
  <p data-testid="tier-status">Active</p>
  <p data-testid="trial-remaining">5 days remaining</p>
</div>
```

#### Upgrade Prompt
```tsx
<div data-testid="upgrade-prompt">
  <button data-testid="upgrade-cta">Upgrade Now</button>
</div>
```

### Forms

#### Checkout Form
```tsx
<form data-testid="checkout-form">
  <input data-testid="email-input" />
  <input data-testid="card-element" />
  <button data-testid="submit-payment">Complete Purchase</button>
</form>
```

### Dialogs and Modals

#### Confirmation Dialog
```tsx
<div data-testid="confirm-dialog" role="dialog">
  <h2 data-testid="dialog-title">Confirm Cancellation</h2>
  <p data-testid="dialog-message">Are you sure?</p>
  <button data-testid="confirm-action">Yes, Cancel</button>
  <button data-testid="cancel-action">Keep Subscription</button>
</div>
```

### Loading States

#### Loading Spinner
```tsx
<div data-testid="loading-spinner" data-loading="true">
  Loading...
</div>
```

#### Skeleton Loader
```tsx
<div data-testid="skeleton-loader" aria-busy="true">
  ...
</div>
```

### Notifications and Alerts

#### Toast Notification
```tsx
<div data-testid="toast" role="alert" data-type="success">
  <p data-testid="toast-message">Subscription updated!</p>
</div>
```

#### Error Alert
```tsx
<div data-testid="error-alert" role="alert" data-error="true">
  <p data-testid="error-message">Payment failed</p>
</div>
```

## 🛠️ Implementation Examples

### PricingCard Component

```tsx
export function PricingCard({ tier, onSubscribe }: PricingCardProps) {
  return (
    <div 
      data-testid="pricing-card" 
      data-tier={tier.name.toLowerCase()}
      className="pricing-card"
    >
      <h3 data-testid="tier-name">{tier.displayName}</h3>
      <div data-testid="tier-price">
        <span data-testid="price-amount">{tier.price}</span>
        <span data-testid="price-period">/mo</span>
      </div>
      <button 
        data-testid="subscribe-button"
        onClick={onSubscribe}
      >
        {tier.isCurrent ? 'Current Plan' : 'Subscribe'}
      </button>
    </div>
  );
}
```

### SubscriptionStatus Component

```tsx
export function SubscriptionStatus({ subscription }: Props) {
  return (
    <div data-testid="subscription-status">
      <div 
        data-testid="tier-badge" 
        data-tier={subscription.tier.name}
      >
        {subscription.tier.displayName}
      </div>
      <div 
        data-testid="status-badge" 
        data-status={subscription.status}
      >
        {subscription.status}
      </div>
      {subscription.trial?.active && (
        <div data-testid="trial-info">
          <span data-testid="trial-days-remaining">
            {subscription.trial.daysRemaining} days remaining
          </span>
        </div>
      )}
      <button data-testid="manage-billing-button">
        Manage Billing
      </button>
    </div>
  );
}
```

## 🔍 Using Data Attributes in Tests

### Basic Selection

```typescript
// Find element by testid
const button = page.getByTestId('subscribe-button');
await button.click();

// Find with data attribute
const basicCard = page.locator('[data-tier="basic"]');
await basicCard.getByTestId('subscribe-button').click();
```

### Complex Selectors

```typescript
// Combine testid with other attributes
const activeSubscription = page.locator(
  '[data-testid="subscription-status"][data-status="active"]'
);

// Find within parent
const basicCard = page.locator('[data-tier="basic"]');
const price = await basicCard.getByTestId('tier-price').textContent();
```

### Assertions

```typescript
// Check existence
await expect(page.getByTestId('trial-banner')).toBeVisible();

// Check attributes
await expect(page.getByTestId('status-badge'))
  .toHaveAttribute('data-status', 'active');

// Check text content
await expect(page.getByTestId('tier-name')).toHaveText('Premium');
```

## 📝 Naming Conventions

### Format
- Use kebab-case: `data-testid="subscribe-button"`
- Be descriptive: `upgrade-button` not just `button`
- Include context: `pricing-card` not just `card`

### Prefixes

| Prefix | Usage | Example |
|--------|-------|---------|
| `form-` | Forms | `form-checkout` |
| `input-` | Input fields | `input-email` |
| `button-` | Buttons | `button-submit` |
| `dialog-` | Dialogs/Modals | `dialog-confirm` |
| `error-` | Error messages | `error-alert` |
| `success-` | Success messages | `success-toast` |

### Status Attributes

Use `data-*` attributes for states:
- `data-status="active"` - Subscription status
- `data-tier="premium"` - Tier type
- `data-loading="true"` - Loading state
- `data-error="true"` - Error state

## ✅ Checklist for New Components

When creating a new component that will be tested:

- [ ] Add `data-testid` to main container
- [ ] Add `data-testid` to interactive elements (buttons, links, inputs)
- [ ] Add `data-testid` to elements that display important information
- [ ] Use data attributes for state (e.g., `data-status`, `data-tier`)
- [ ] Document the test IDs in component comments
- [ ] Update this guide if adding new patterns

## 🚫 What NOT to Use

Avoid relying on these for tests:
- ❌ Class names (can change with styling)
- ❌ Text content (can change with copy updates)
- ❌ Complex CSS selectors (fragile)
- ❌ nth-child selectors (breaks with reordering)
- ❌ Position-based selectors (not reliable)

## 🎯 Priority Elements

Add test IDs to these elements first:

1. **Call-to-Action Buttons**
   - Subscribe buttons
   - Upgrade buttons
   - Cancel buttons
   - Manage billing buttons

2. **Status Indicators**
   - Subscription status
   - Tier badges
   - Trial information
   - Billing cycle

3. **Interactive Forms**
   - Input fields
   - Submit buttons
   - Form validation messages

4. **Navigation Elements**
   - Pricing cards
   - Tier selection
   - Billing toggles

5. **Notifications**
   - Success messages
   - Error alerts
   - Toast notifications

## 📚 Resources

- [Testing Library - Data Attributes](https://testing-library.com/docs/queries/bytestid/)
- [Playwright - Locators](https://playwright.dev/docs/locators)
- [Accessibility - ARIA Attributes](https://www.w3.org/WAI/ARIA/apg/)

---

**Remember**: Test IDs make tests more reliable and maintainable. Add them early and consistently!

