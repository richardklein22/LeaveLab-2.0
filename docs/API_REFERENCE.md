# LeaveLab API Reference 📡

**Version**: 1.0  
**Base URL**: `https://leavelab.com/api/v1`  
**Last Updated**: October 2025

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Codes](#error-codes)
- [Rate Limiting](#rate-limiting)
- [Authentication Endpoints](#authentication-endpoints)
- [Profile Endpoints](#profile-endpoints)
- [Subscription Endpoints](#subscription-endpoints)
- [Account Management Endpoints](#account-management-endpoints)
- [Premium Content Endpoints](#premium-content-endpoints)

---

## Overview

The LeaveLab API is a RESTful API that uses JSON for request and response bodies. All endpoints require HTTPS in production.

### Key Features

- **RESTful**: Follows REST principles
- **JSON**: Request and response bodies use JSON
- **Versioned**: API versioned at `/api/v1/`
- **Secure**: HTTPS only, authentication required for most endpoints
- **Consistent**: Standardized response format and error handling

### Base URLs

- **Production**: `https://leavelab.com/api/v1`
- **Development**: `http://localhost:3000/api/v1`

---

## Authentication

### Session-Based Authentication

LeaveLab uses **session-based authentication** via HTTP-only cookies managed by Supabase Auth.

#### How It Works

1. User logs in via `/api/v1/auth/login`
2. Server sets HTTP-only session cookie
3. Browser automatically sends cookie with subsequent requests
4. Server validates session on protected endpoints

#### Protected Endpoints

Most endpoints require authentication. If not authenticated:

```json
{
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Unauthorized"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

**Status Code**: `401 Unauthorized`

---

## Response Format

### Success Response

```json
{
  "data": {
    // Resource data
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `AUTHENTICATION_ERROR` | 401 | Not authenticated |
| `AUTHORIZATION_ERROR` | 403 | Not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `STRIPE_ERROR` | 500 | Payment processing error |

---

## Rate Limiting

### Limits

- **Authenticated requests**: 100 requests/minute
- **Unauthenticated requests**: 20 requests/minute
- **Webhook endpoints**: 1000 requests/minute

### Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1697548800
```

### Rate Limit Exceeded

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 60
    }
  }
}
```

**Status Code**: `429 Too Many Requests`

---

## Authentication Endpoints

### POST /auth/signup

Create a new user account.

#### Request

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Body Parameters**:
- `email` (string, required): Valid email address
- `password` (string, required): Minimum 8 characters, must contain uppercase, lowercase, and number

#### Response (Success)

**Status Code**: `201 Created`

```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com"
    },
    "message": "Account created successfully. Please check your email to verify your account."
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

#### Response (Error)

**Status Code**: `400 Bad Request`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password must contain at least one uppercase letter",
    "details": {
      "field": "password"
    }
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### POST /auth/login

Authenticate a user and create a session.

#### Request

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "rememberMe": true
}
```

**Body Parameters**:
- `email` (string, required): User's email
- `password` (string, required): User's password
- `rememberMe` (boolean, optional): Extend session to 30 days (default: 7 days)

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com"
    }
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

#### Response (Error - Brute Force Protection)

**Status Code**: `429 Too Many Requests`

```json
{
  "error": {
    "code": "TOO_MANY_ATTEMPTS",
    "message": "Too many failed login attempts. Please try again in 10 minutes.",
    "details": {
      "retryAfter": 600
    }
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### POST /auth/logout

Log out the current user and destroy the session.

#### Request

```http
POST /api/v1/auth/logout
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "message": "Logged out successfully"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### POST /auth/reset-password

Request a password reset email.

#### Request

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Body Parameters**:
- `email` (string, required): User's email address

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "message": "If an account exists with that email, you will receive password reset instructions."
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

> **Note**: Response is the same whether the email exists or not (security best practice).

---

### POST /auth/update-password

Update user's password (after reset or while logged in).

#### Request

```http
POST /api/v1/auth/update-password
Content-Type: application/json

{
  "newPassword": "NewSecurePassword456"
}
```

**Body Parameters**:
- `newPassword` (string, required): New password (same validation as signup)

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "message": "Password updated successfully"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### POST /auth/verify-email

Verify a user's email address (usually called automatically from email link).

#### Request

```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

**Body Parameters**:
- `token` (string, required): Verification token from email

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "message": "Email verified successfully"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

## Profile Endpoints

### GET /profile

Get the current user's profile.

**Authentication**: Required

#### Request

```http
GET /api/v1/profile
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "displayName": "John Smith",
    "bio": "Digital nomad based in Bali",
    "avatarUrl": "https://storage.supabase.co/v1/object/public/avatars/user-avatar.jpg",
    "timezone": "Asia/Bali",
    "language": "en",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-10-17T12:00:00Z"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### PATCH /profile

Update the current user's profile.

**Authentication**: Required

#### Request

```http
PATCH /api/v1/profile
Content-Type: application/json

{
  "displayName": "John Smith",
  "bio": "Digital nomad exploring Southeast Asia",
  "timezone": "Asia/Bangkok",
  "language": "en"
}
```

**Body Parameters** (all optional):
- `displayName` (string): User's display name (max 100 characters)
- `bio` (string): User biography (max 500 characters)
- `timezone` (string): IANA timezone (e.g., "America/New_York")
- `language` (string): Language code (e.g., "en", "es")

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "displayName": "John Smith",
    "bio": "Digital nomad exploring Southeast Asia",
    "avatarUrl": "https://storage.supabase.co/v1/object/public/avatars/user-avatar.jpg",
    "timezone": "Asia/Bangkok",
    "language": "en",
    "updatedAt": "2025-10-17T12:00:00Z"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### POST /profile/avatar

Upload a user avatar.

**Authentication**: Required

#### Request

```http
POST /api/v1/profile/avatar
Content-Type: multipart/form-data

avatar: [binary image data]
```

**Body Parameters**:
- `avatar` (file, required): Image file (JPG, PNG, or WebP; max 2MB)

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "avatarUrl": "https://storage.supabase.co/v1/object/public/avatars/550e8400-e29b-41d4-a716-446655440000.jpg"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### DELETE /profile/avatar

Delete the user's avatar.

**Authentication**: Required

#### Request

```http
DELETE /api/v1/profile/avatar
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "message": "Avatar deleted successfully"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

## Subscription Endpoints

### GET /subscriptions/tiers

Get all available subscription tiers.

**Authentication**: Optional (returns different data if authenticated)

#### Request

```http
GET /api/v1/subscriptions/tiers
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "tiers": [
      {
        "id": "tier-free-id",
        "name": "free",
        "displayName": "Free",
        "description": "Get started with digital nomad basics",
        "pricing": {
          "monthly": 0,
          "annual": 0,
          "currency": "GBP"
        },
        "features": {
          "maxCourses": 0,
          "firstLessonOnly": true,
          "communityAccess": false,
          "emailSupport": false,
          "oneOnOneSupport": false,
          "visaInfo": "none",
          "accommodationInfo": "none"
        },
        "isCurrent": true
      },
      {
        "id": "tier-basic-id",
        "name": "basic",
        "displayName": "Basic",
        "description": "Start your digital nomad journey",
        "pricing": {
          "monthly": 70,
          "annual": 672,
          "annualMonthly": 56,
          "savings": 168,
          "savingsPercent": 20,
          "currency": "GBP"
        },
        "features": {
          "maxCourses": 1,
          "firstLessonOnly": false,
          "communityAccess": true,
          "emailSupport": true,
          "oneOnOneSupport": false,
          "visaInfo": "short_term",
          "accommodationInfo": "short_term"
        },
        "stripeMonthlyPriceId": "price_xxx",
        "stripeAnnualPriceId": "price_yyy",
        "isCurrent": false
      },
      {
        "id": "tier-premium-id",
        "name": "premium",
        "displayName": "Premium",
        "description": "Full access to everything you need",
        "pricing": {
          "monthly": 100,
          "annual": 960,
          "annualMonthly": 80,
          "savings": 240,
          "savingsPercent": 20,
          "currency": "GBP"
        },
        "features": {
          "maxCourses": null,
          "firstLessonOnly": false,
          "communityAccess": true,
          "emailSupport": true,
          "oneOnOneSupport": true,
          "visaInfo": "all",
          "accommodationInfo": "all"
        },
        "trial": {
          "days": 7,
          "available": true
        },
        "stripeMonthlyPriceId": "price_zzz",
        "stripeAnnualPriceId": "price_aaa",
        "isCurrent": false
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### GET /subscriptions/status

Get the current user's subscription status.

**Authentication**: Required

#### Request

```http
GET /api/v1/subscriptions/status
```

#### Response (Success - Free Tier)

**Status Code**: `200 OK`

```json
{
  "data": {
    "subscription": {
      "tier": {
        "id": "tier-free-id",
        "name": "free",
        "displayName": "Free"
      },
      "status": "active",
      "canUpgrade": true,
      "canDowngrade": false
    }
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

#### Response (Success - Paid Tier)

**Status Code**: `200 OK`

```json
{
  "data": {
    "subscription": {
      "id": "sub-id",
      "tier": {
        "id": "tier-premium-id",
        "name": "premium",
        "displayName": "Premium"
      },
      "status": "active",
      "billingCycle": "annual",
      "currentPeriodStart": "2025-01-01T00:00:00Z",
      "currentPeriodEnd": "2026-01-01T00:00:00Z",
      "cancelAtPeriodEnd": false,
      "canUpgrade": false,
      "canDowngrade": true,
      "nextBillingDate": "2026-01-01T00:00:00Z",
      "nextBillingAmount": 960
    }
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

#### Response (Success - Trial)

**Status Code**: `200 OK`

```json
{
  "data": {
    "subscription": {
      "id": "sub-id",
      "tier": {
        "id": "tier-premium-id",
        "name": "premium",
        "displayName": "Premium"
      },
      "status": "trialing",
      "billingCycle": "monthly",
      "currentPeriodStart": "2025-10-10T00:00:00Z",
      "currentPeriodEnd": "2025-11-10T00:00:00Z",
      "cancelAtPeriodEnd": false,
      "trial": {
        "active": true,
        "start": "2025-10-10T00:00:00Z",
        "end": "2025-10-17T00:00:00Z",
        "daysRemaining": 3
      },
      "canUpgrade": false,
      "canDowngrade": true,
      "nextBillingDate": "2025-10-17T00:00:00Z",
      "nextBillingAmount": 100
    }
  },
  "meta": {
    "timestamp": "2025-10-14T12:00:00Z"
  }
}
```

---

### POST /subscriptions/checkout

Create a Stripe Checkout session for a subscription.

**Authentication**: Required

#### Request

```http
POST /api/v1/subscriptions/checkout
Content-Type: application/json

{
  "tierId": "tier-premium-id",
  "billingCycle": "annual",
  "trial": true,
  "successUrl": "https://leavelab.com/dashboard?subscription=success",
  "cancelUrl": "https://leavelab.com/pricing"
}
```

**Body Parameters**:
- `tierId` (string, required): ID of the subscription tier
- `billingCycle` (string, required): "monthly" or "annual"
- `trial` (boolean, optional): Whether to start with trial period (Premium only)
- `successUrl` (string, optional): URL to redirect after successful payment
- `cancelUrl` (string, optional): URL to redirect if user cancels

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "sessionId": "cs_test_xxx",
    "url": "https://checkout.stripe.com/pay/cs_test_xxx"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

**Next Steps**: Redirect the user to the `url` to complete checkout.

---

### POST /subscriptions/portal

Create a Stripe Customer Portal session for subscription management.

**Authentication**: Required

#### Request

```http
POST /api/v1/subscriptions/portal
Content-Type: application/json

{
  "returnUrl": "https://leavelab.com/dashboard"
}
```

**Body Parameters**:
- `returnUrl` (string, optional): URL to return to after managing subscription

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "url": "https://billing.stripe.com/session/xxx"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

**Next Steps**: Redirect the user to the `url` to manage their subscription.

---

### POST /subscriptions/webhook

**⚠️ Internal endpoint - called by Stripe only**

Handle Stripe webhook events for subscription updates.

**Authentication**: Webhook signature verification

#### Request

```http
POST /api/v1/subscriptions/webhook
Stripe-Signature: t=xxx,v1=yyy

{
  // Stripe event payload
}
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "received": true
}
```

See [WEBHOOK_EVENTS.md](./WEBHOOK_EVENTS.md) for detailed event documentation.

---

## Account Management Endpoints

### POST /account/change-password

Change the user's password (requires current password verification).

**Authentication**: Required

#### Request

```http
POST /api/v1/account/change-password
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

**Body Parameters**:
- `currentPassword` (string, required): Current password
- `newPassword` (string, required): New password (must meet requirements)

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "message": "Password changed successfully"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### GET /account/sessions

Get all active sessions for the user.

**Authentication**: Required

#### Request

```http
GET /api/v1/account/sessions
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "sessions": [
      {
        "id": "session-1",
        "createdAt": "2025-10-17T10:00:00Z",
        "lastActiveAt": "2025-10-17T12:00:00Z",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...",
        "isCurrent": true
      },
      {
        "id": "session-2",
        "createdAt": "2025-10-15T10:00:00Z",
        "lastActiveAt": "2025-10-16T12:00:00Z",
        "ipAddress": "192.168.1.2",
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) ...",
        "isCurrent": false
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### POST /account/sessions/revoke

Revoke all sessions except the current one (log out all devices).

**Authentication**: Required

#### Request

```http
POST /api/v1/account/sessions/revoke
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "message": "All other sessions have been revoked",
    "revokedCount": 3
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### GET /account/providers

Get connected OAuth providers for the user.

**Authentication**: Required

#### Request

```http
GET /api/v1/account/providers
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "providers": [
      {
        "provider": "email",
        "connectedAt": "2025-01-01T00:00:00Z",
        "canUnlink": false
      },
      {
        "provider": "google",
        "connectedAt": "2025-01-15T00:00:00Z",
        "email": "user@gmail.com",
        "canUnlink": true
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

### GET /account/export

Export all user data (GDPR Article 20 - Data Portability).

**Authentication**: Required

#### Request

```http
GET /api/v1/account/export
```

#### Response (Success)

**Status Code**: `200 OK`  
**Content-Type**: `application/json`

```json
{
  "profile": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "displayName": "John Smith",
    "bio": "Digital nomad...",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "subscription": {
    "tier": "premium",
    "status": "active",
    "billingCycle": "annual"
  },
  "authLogs": [
    {
      "eventType": "login",
      "timestamp": "2025-10-17T10:00:00Z",
      "ipAddress": "192.168.1.1"
    }
  ],
  "exportedAt": "2025-10-17T12:00:00Z"
}
```

---

### DELETE /account

Soft delete the user's account (GDPR Article 17 - Right to Erasure).

**Authentication**: Required

#### Request

```http
DELETE /api/v1/account
Content-Type: application/json

{
  "confirmation": "DELETE"
}
```

**Body Parameters**:
- `confirmation` (string, required): Must be the string "DELETE"

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "message": "Account scheduled for deletion. You have 30 days to recover it.",
    "recoveryDeadline": "2025-11-16T12:00:00Z"
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

**Note**: 
- Account is soft-deleted (can be recovered within 30 days)
- Active subscriptions are automatically cancelled
- After 30 days, all data is permanently deleted

---

## Premium Content Endpoints

### GET /premium/data

Access premium content (requires appropriate subscription tier).

**Authentication**: Required  
**Authorization**: Basic or Premium tier

#### Request

```http
GET /api/v1/premium/data
```

#### Response (Success)

**Status Code**: `200 OK`

```json
{
  "data": {
    "content": "Premium digital nomad content..."
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

#### Response (Error - Insufficient Tier)

**Status Code**: `403 Forbidden`

```json
{
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "This content requires a Basic or Premium subscription",
    "details": {
      "requiredTier": "basic",
      "currentTier": "free"
    }
  },
  "meta": {
    "timestamp": "2025-10-17T12:00:00Z"
  }
}
```

---

## Webhooks

### Stripe Webhooks

LeaveLab receives webhooks from Stripe for subscription events.

**Endpoint**: `POST /api/v1/subscriptions/webhook`

See [WEBHOOK_EVENTS.md](./WEBHOOK_EVENTS.md) for full documentation of webhook events.

---

## Best Practices

### Error Handling

Always check the status code and `error` field:

```typescript
const response = await fetch('/api/v1/subscriptions/status');
const data = await response.json();

if (!response.ok) {
  // Handle error
  console.error(data.error.message);
  return;
}

// Use data
const subscription = data.data.subscription;
```

### Retry Logic

For transient errors (500, 503), implement exponential backoff:

```typescript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url);
    
    if (response.ok || response.status < 500) {
      return response;
    }
    
    // Exponential backoff: 1s, 2s, 4s
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
  }
  
  throw new Error('Max retries exceeded');
}
```

### Caching

Some endpoints set cache headers. Respect them:

```http
Cache-Control: private, max-age=300
```

Use client-side caching (SWR, React Query) for better performance.

---

## Changelog

### Version 1.0 (October 2025)
- Initial API release
- Authentication endpoints
- Profile management
- Subscription management
- Account settings

---

## Support

For API issues or questions:
- **Email**: support@leavelab.com
- **Documentation**: https://docs.leavelab.com
- **Status Page**: https://status.leavelab.com

---

**API Reference Complete** ✅

*Last Updated: October 2025*

