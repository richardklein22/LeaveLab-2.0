# Error Handling Visual Guide 🎨

Visual representations of the error handling system for quick understanding.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       User Request                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Route Handler                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Extract Context & Log Request                     │   │
│  │ 2. Authenticate User                                 │   │
│  │ 3. Validate Input                                    │   │
│  │ 4. Execute Business Logic                           │   │
│  │ 5. Return Success Response                          │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
              ┌──────┴───────┐
              │  Success?    │
              └──────┬───────┘
         Yes ───────┤        │─────── No
                    │        │
                    ▼        ▼
         ┌──────────────┐   ┌────────────────────────────────┐
         │   Success    │   │      Error Handler            │
         │   Response   │   │  ┌────────────────────────┐   │
         │   (200)      │   │  │ 1. Classify Error Type │   │
         └──────────────┘   │  │ 2. Format Message      │   │
                            │  │ 3. Log with Context    │   │
                            │  │ 4. Return Appropriate  │   │
                            │  │    Status Code         │   │
                            │  └────────────────────────┘   │
                            └────────────────────────────────┘
```

## Error Flow Diagram

```
┌────────────┐
│   Error    │
│  Occurs    │
└─────┬──────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│         Error Type Detection                │
│  ┌───────────────────────────────────────┐  │
│  │ • isStripeError()?                    │  │
│  │ • isAuthError()?                      │  │
│  │ • isAppError()?                       │  │
│  │ • instanceof Error?                   │  │
│  └───────────────────────────────────────┘  │
└───────────┬─────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────┐
│         Error Classification                 │
├──────────────────────────────────────────────┤
│ AuthenticationError    → 401                 │
│ ValidationError        → 400                 │
│ NotFoundError         → 404                  │
│ ConflictError         → 409                  │
│ StripeCardError       → 400                  │
│ StripeAPIError        → 502                  │
│ DatabaseError         → 500                  │
│ Unknown Error         → 500                  │
└───────────┬──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────┐
│         Error Formatting                     │
│  ┌────────────────────────────────────────┐  │
│  │ User Message: "Friendly explanation"   │  │
│  │ Error Code: "ERROR_TYPE"               │  │
│  │ Status Code: 4xx or 5xx                │  │
│  │ (No stack trace exposed)               │  │
│  └────────────────────────────────────────┘  │
└───────────┬──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────┐
│         Logging                              │
│  ┌────────────────────────────────────────┐  │
│  │ Level: ERROR                           │  │
│  │ Message: "Operation failed"            │  │
│  │ Context: { userId, endpoint, ... }    │  │
│  │ Error Details: { message, stack }     │  │
│  └────────────────────────────────────────┘  │
└───────────┬──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────┐
│         Response to User                     │
│  {                                           │
│    "error": {                                │
│      "message": "User-friendly message",     │
│      "code": "ERROR_CODE"                    │
│    }                                         │
│  }                                           │
└──────────────────────────────────────────────┘
```

## Error Class Hierarchy

```
                    ┌──────────┐
                    │  Error   │
                    │ (Native) │
                    └────┬─────┘
                         │
                         ▼
                    ┌──────────┐
                    │ AppError │
                    │ (Base)   │
                    └────┬─────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │Validation│    │   Auth   │    │NotFound  │
    │  Error   │    │  Error   │    │  Error   │
    │  (400)   │    │  (401)   │    │  (404)   │
    └──────────┘    └──────────┘    └──────────┘
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │Conflict │    │RateLimit │    │ Stripe   │
    │  Error  │    │  Error   │    │  Error   │
    │  (409)  │    │  (429)   │    │(varies)  │
    └─────────┘    └──────────┘    └──────────┘
         │
         ▼
    ┌─────────┐
    │Database │
    │  Error  │
    │  (500)  │
    └─────────┘
```

## Subscription Checkout Error Flow

```
User clicks "Subscribe to Premium"
         │
         ▼
┌─────────────────────┐
│ Validate User Auth  │
└────────┬────────────┘
         │
   ┌─────┴─────┐
   │ Logged in?│
   └─────┬─────┘
    No ──┤     │── Yes
         │     │
         ▼     ▼
    ┌────────────┐     ┌────────────────────┐
    │Return 401  │     │ Validate Request   │
    │"Login"     │     │ Body               │
    └────────────┘     └────────┬───────────┘
                                │
                          ┌─────┴──────┐
                          │ Valid data?│
                          └─────┬──────┘
                           No ──┤     │── Yes
                                │     │
                                ▼     ▼
                         ┌──────────────┐  ┌─────────────────┐
                         │ Return 400   │  │ Fetch Tier Info │
                         │ Validation   │  └────────┬────────┘
                         │ Error        │           │
                         └──────────────┘     ┌─────┴──────┐
                                              │ Tier found?│
                                              └─────┬──────┘
                                               No ──┤     │── Yes
                                                    │     │
                                                    ▼     ▼
                                          ┌──────────────┐  ┌────────────────┐
                                          │ Return 404   │  │ Check Current  │
                                          │ "Not Found"  │  │ Subscription   │
                                          └──────────────┘  └────────┬───────┘
                                                                     │
                                                               ┌─────┴──────┐
                                                               │  Already   │
                                                               │subscribed? │
                                                               └─────┬──────┘
                                                               Yes ──┤   │── No
                                                                     │   │
                                                                     ▼   ▼
                                                          ┌────────────────┐  ┌─────────────┐
                                                          │ Return 409     │  │ Create      │
                                                          │ "Conflict"     │  │ Stripe      │
                                                          └────────────────┘  │ Session     │
                                                                              └──────┬──────┘
                                                                                     │
                                                                               ┌─────┴──────┐
                                                                               │  Success?  │
                                                                               └─────┬──────┘
                                                                           Yes ──────┤   │── No
                                                                                     │   │
                                                                                     ▼   ▼
                                                                          ┌────────────────┐
                                                                          │ Return Success │
                                                                          │ w/ Session URL │
                                                                          └────────────────┘
                                                                                     │
                                                                                     ▼
                                                                          ┌─────────────────┐
                                                                          │ Return Stripe   │
                                                                          │ Error (formatted)│
                                                                          └─────────────────┘
```

## Webhook Processing Flow

```
Stripe sends webhook
         │
         ▼
┌─────────────────────┐
│ Verify Signature    │
└────────┬────────────┘
         │
   ┌─────┴──────┐
   │  Valid sig?│
   └─────┬──────┘
    No ──┤      │── Yes
         │      │
         ▼      ▼
    ┌────────────┐     ┌──────────────────┐
    │Return 400  │     │ Parse Event      │
    │"Invalid"   │     └────────┬─────────┘
    └────────────┘              │
                                ▼
                     ┌──────────────────────┐
                     │ Check for Duplicate  │
                     └────────┬─────────────┘
                              │
                        ┌─────┴──────┐
                        │ Duplicate? │
                        └─────┬──────┘
                         Yes──┤   │── No
                              │   │
                              ▼   ▼
                     ┌──────────────┐  ┌─────────────────┐
                     │ Return 200   │  │ Log Event to DB │
                     │ w/ duplicate │  └────────┬────────┘
                     │ flag         │           │
                     └──────────────┘           ▼
                                     ┌──────────────────────┐
                                     │ Process by Type      │
                                     │ • checkout.completed │
                                     │ • payment.succeeded  │
                                     │ • payment.failed     │
                                     │ • subscription.*     │
                                     └────────┬─────────────┘
                                              │
                                        ┌─────┴──────┐
                                        │  Success?  │
                                        └─────┬──────┘
                                         Yes──┤   │── No
                                              │   │
                                              ▼   ▼
                                   ┌────────────────┐  ┌────────────────┐
                                   │ Mark Processed │  │ Mark Failed    │
                                   │ Return 200     │  │ Return 500     │
                                   └────────────────┘  │ (Stripe retry) │
                                                       └────────────────┘
```

## Error Boundary Component Tree

```
┌────────────────────────────────────────────────┐
│              Application                       │
│  ┌──────────────────────────────────────────┐ │
│  │        ErrorBoundary (Root)              │ │
│  │  ┌────────────────────────────────────┐  │ │
│  │  │           Layout                   │  │ │
│  │  │  ┌──────────────────────────────┐  │  │ │
│  │  │  │      ErrorBoundary           │  │  │ │
│  │  │  │  ┌────────────────────────┐  │  │  │ │
│  │  │  │  │   Dashboard Component  │  │  │  │ │
│  │  │  │  │                        │  │  │  │ │
│  │  │  │  │  Error occurs here! ❌  │  │  │  │ │
│  │  │  │  └────────────────────────┘  │  │  │ │
│  │  │  │                              │  │  │ │
│  │  │  │  Catches error ✅             │  │  │ │
│  │  │  │  Shows error UI              │  │  │ │
│  │  │  └──────────────────────────────┘  │  │ │
│  │  └────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘

         ┌────────────────────┐
         │   Error Caught     │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Display Error UI  │
         │  • Friendly message│
         │  • Reload button   │
         │  • Home button     │
         │  • Error details   │
         │    (dev only)      │
         └────────────────────┘
```

## Logging Levels Visual

```
  SEVERITY   │  WHEN TO USE                │  COLOR  │  EXAMPLES
─────────────┼─────────────────────────────┼─────────┼────────────────────
  DEBUG 🔍   │  Development info           │  Cyan   │  Cache hit
             │  Non-critical flow          │         │  DB query details
─────────────┼─────────────────────────────┼─────────┼────────────────────
  INFO  ℹ️   │  Normal operations          │  Green  │  Request received
             │  Successful actions         │         │  Webhook processed
─────────────┼─────────────────────────────┼─────────┼────────────────────
  WARN  ⚠️   │  Recoverable issues         │  Yellow │  Slow performance
             │  Unusual but handled        │         │  Deprecated usage
─────────────┼─────────────────────────────┼─────────┼────────────────────
  ERROR ❌   │  Operation failures         │  Red    │  DB error
             │  Exceptions caught          │         │  Stripe failure
─────────────┼─────────────────────────────┼─────────┼────────────────────
  FATAL 💀   │  System-level failures      │ Magenta │  Missing config
             │  Unrecoverable errors       │         │  Server crash
```

## Request Lifecycle with Logging

```
TIME    │  EVENT                           │  LOG LEVEL  │  STATUS
────────┼──────────────────────────────────┼─────────────┼─────────
0ms     │  Request received                │  INFO       │  ℹ️
        │  POST /api/v1/subscriptions/...  │             │
────────┼──────────────────────────────────┼─────────────┼─────────
5ms     │  Auth check complete             │  DEBUG      │  🔍
────────┼──────────────────────────────────┼─────────────┼─────────
10ms    │  Fetching tier info              │  DEBUG      │  🔍
────────┼──────────────────────────────────┼─────────────┼─────────
25ms    │  Creating Stripe customer        │  DEBUG      │  🔍
────────┼──────────────────────────────────┼─────────────┼─────────
120ms   │  Creating checkout session       │  DEBUG      │  🔍
────────┼──────────────────────────────────┼─────────────┼─────────
145ms   │  Request complete                │  INFO       │  ✅
        │  Status: 200                     │             │
        │  Duration: 145ms                 │             │
────────┼──────────────────────────────────┼─────────────┼─────────

OR if error occurs:

80ms    │  Stripe error occurred           │  ERROR      │  ❌
        │  Type: StripeCardError           │             │
────────┼──────────────────────────────────┼─────────────┼─────────
85ms    │  Request failed                  │  WARN       │  ⚠️
        │  Status: 400                     │             │
        │  Duration: 85ms                  │             │
```

## Status Code Decision Tree

```
                    ┌────────────────┐
                    │  What went     │
                    │  wrong?        │
                    └────────┬───────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Authentication│    │  Validation  │    │   Resource   │
│   Issue      │    │    Issue     │    │   Issue      │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     401      │    │     400      │    │     404      │
│ Unauthorized │    │ Bad Request  │    │  Not Found   │
└──────────────┘    └──────────────┘    └──────────────┘

        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ "Please log  │    │ "Invalid     │    │ "Subscription│
│  in to       │    │  input"      │    │  not found"  │
│  continue"   │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘


        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Conflict   │    │  Rate Limit  │    │Server Error  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     409      │    │     429      │    │     500      │
│   Conflict   │    │ Too Many     │    │ Internal     │
│              │    │ Requests     │    │ Error        │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Error Response Format Comparison

### ❌ Before (Inconsistent)
```
Various formats:
• { error: "Something went wrong" }
• { message: "Error" }
• { error: { msg: "Failed" } }
• Plain text: "Error occurred"
```

### ✅ After (Consistent)
```json
{
  "error": {
    "message": "User-friendly message",
    "code": "ERROR_CODE",
    "type": "error_type"
  }
}
```

### For Validation Errors
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": ["Invalid format"],
      "password": ["Too short", "Missing special char"]
    }
  }
}
```

## Edge Case Handling Map

```
                    USER ACTIONS
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌────────────┐   ┌────────────┐   ┌────────────┐
│  Subscribe │   │   Manage   │   │   Portal   │
│  to Tier   │   │Subscription│   │   Access   │
└──────┬─────┘   └──────┬─────┘   └──────┬─────┘
       │                │                │
       ▼                ▼                ▼
  Edge Cases      Edge Cases       Edge Cases
  Checked:        Checked:         Checked:
  • Already       • No active      • No customer
    subscribed      subscription     ID
  • Free tier     • Payment past   • Missing
  • Invalid tier    due              subscription
  • No email      • Cancelled      • DB error
  • Stripe down     but valid
                  • Trial ending

       │                │                │
       ▼                ▼                ▼
  Appropriate     Appropriate      Appropriate
  Response:       Response:        Response:
  409 Conflict    404 Not Found    404 Not Found
  400 Bad Req     200 + Info       500 Server Err
  404 Not Found   Portal URL       (with context)
```

## Complete Error Handling Stack

```
┌─────────────────────────────────────────────┐
│              Frontend Layer                 │
│  • ErrorBoundary catches React errors       │
│  • Display user-friendly UI                 │
│  • Provide recovery options                 │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│              API Layer                      │
│  • Validate input (ValidationError)         │
│  • Check auth (AuthenticationError)         │
│  • Handle business logic errors             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│           Integration Layer                 │
│  • Stripe errors (formatStripeError)        │
│  • Database errors (formatDatabaseError)    │
│  • External API errors                      │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│            Error Handler                    │
│  • Classify error type                      │
│  • Format response                          │
│  • Log with context                         │
│  • Return appropriate status                │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│            Logging System                   │
│  • Structured logs                          │
│  • Performance metrics                      │
│  • Error details (server-side only)         │
│  • Context tracking                         │
└─────────────────────────────────────────────┘
```

---

## Quick Decision Matrix

**"I need to..."**

| Scenario | Use This | Example |
|----------|----------|---------|
| User not authenticated | `AuthenticationError` | `throw new AuthenticationError('Please log in')` |
| Invalid input | `ValidationError` | `throw new ValidationError('Email is required')` |
| Resource not found | `NotFoundError` | `throw new NotFoundError('Subscription not found')` |
| Already exists | `ConflictError` | `throw new ConflictError('Already subscribed')` |
| Stripe fails | Handle Stripe errors | `if (isStripeError(error)) return handleStripeErrorResponse(error)` |
| Log request | Use logger | `logger.logRequest('POST', endpoint, context)` |
| Catch React error | ErrorBoundary | `<ErrorBoundary><Component /></ErrorBoundary>` |

---

**This visual guide provides quick reference for understanding the error handling system at a glance!** 🎨


