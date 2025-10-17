# Error Handling Quick Reference Card 📋

Quick reference for implementing consistent error handling across the LeaveLab application.

## Import Statements

```typescript
// Error utilities
import { 
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  StripeError,
  isStripeError,
  isAuthError,
} from '@/lib/utils/errors';

// Response utilities
import {
  successResponse,
  errorResponse,
  handleErrorResponse,
  handleStripeErrorResponse,
  handleDatabaseErrorResponse,
  validationErrorResponse,
} from '@/lib/utils/response';

// Logging
import { logger, extractRequestContext } from '@/lib/utils/logger';
```

## API Route Template

```typescript
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  AuthenticationError,
  NotFoundError,
  handleErrorResponse,
  handleStripeErrorResponse,
  isStripeError,
} from '@/lib/utils/errors';
import { successResponse } from '@/lib/utils/response';
import { logger, extractRequestContext } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  const context = extractRequestContext(request);
  logger.logRequest('POST', '/api/v1/your-endpoint', context);
  
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    // Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in');
    }
    
    context.userId = user.id;
    
    // Parse body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError('Invalid JSON in request body');
    }
    
    // Validate input
    if (!body.requiredField) {
      throw new ValidationError('requiredField is required');
    }
    
    // Your business logic here
    const result = await yourBusinessLogic(body);
    
    // Log success
    const duration = Date.now() - startTime;
    logger.logResponse('POST', '/api/v1/your-endpoint', 200, duration, context);
    
    return successResponse(result, 200);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Endpoint error', context, error);
    logger.logResponse('POST', '/api/v1/your-endpoint', 500, duration, context);
    
    // Handle Stripe errors specially
    if (isStripeError(error)) {
      return handleStripeErrorResponse(error);
    }
    
    return handleErrorResponse(error);
  }
}
```

## Error Classes Quick Reference

| Error Class | Status Code | When to Use |
|------------|-------------|-------------|
| `ValidationError` | 400 | Invalid input, missing required fields |
| `AuthenticationError` | 401 | Not logged in, invalid token |
| `AuthorizationError` | 403 | Logged in but insufficient permissions |
| `NotFoundError` | 404 | Resource doesn't exist |
| `ConflictError` | 409 | Resource already exists, state conflict |
| `RateLimitError` | 429 | Too many requests |
| `StripeError` | varies | Stripe payment errors |
| `DatabaseError` | 500 | Database operation failures |

## Common Patterns

### Authentication Check
```typescript
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  throw new AuthenticationError('You must be logged in');
}
```

### Input Validation
```typescript
if (!body.tierId || !body.billingCycle) {
  throw new ValidationError('tierId and billingCycle are required', {
    tierId: !body.tierId ? ['Required'] : [],
    billingCycle: !body.billingCycle ? ['Required'] : [],
  });
}
```

### Database Query with Error Handling
```typescript
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('id', id)
  .single();

if (error) {
  logger.error('Database query failed', context, error);
  
  if (error.code === 'PGRST116') {
    throw new NotFoundError('Record not found');
  }
  
  throw new DatabaseError('Failed to fetch record');
}
```

### Stripe Operation with Error Handling
```typescript
try {
  const session = await stripe.checkout.sessions.create({...});
  return session;
} catch (error) {
  logger.error('Stripe operation failed', context, error);
  
  if (isStripeError(error)) {
    throw error; // Will be handled by handleStripeErrorResponse
  }
  
  throw new Error('Failed to create checkout session');
}
```

### Check for Existing Resource
```typescript
const { data: existing } = await supabase
  .from('subscriptions')
  .select('id, status')
  .eq('user_id', userId)
  .single();

if (existing && existing.status === 'active') {
  throw new ConflictError('Already subscribed to this plan');
}
```

## Logging Patterns

### Request/Response Logging
```typescript
// Start of request
const context = extractRequestContext(request);
logger.logRequest('POST', '/api/v1/endpoint', context);

// End of request (success)
logger.logResponse('POST', '/api/v1/endpoint', 200, duration, context);

// End of request (error)
logger.logResponse('POST', '/api/v1/endpoint', 500, duration, context);
```

### Debug Logging
```typescript
logger.debug('Fetching user subscription', { userId, tierId });
```

### Error Logging
```typescript
logger.error('Operation failed', context, error);
```

### Payment/Auth Events
```typescript
logger.logAuth('login', userId, context);
logger.logPayment('checkout_session_created', userId, amount, context);
```

## React Error Boundary

### Basic Usage
```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### With HOC
```tsx
import { withErrorBoundary } from '@/components/error-boundary';

export default withErrorBoundary(YourComponent);
```

## Response Formats

### Success Response
```typescript
return successResponse({
  data: yourData,
  message: 'Operation successful'
}, 200);
```

### Error Response (Manual)
```typescript
return errorResponse('Error message', 400, 'ERROR_CODE');
```

### Error Response (Automatic)
```typescript
return handleErrorResponse(error); // Automatically formats based on error type
```

### Validation Error Response
```typescript
return validationErrorResponse(zodError);
```

## Common Validation Patterns

### Required Fields
```typescript
if (!field) {
  throw new ValidationError('Field is required');
}
```

### Enum Validation
```typescript
const validValues = ['option1', 'option2'];
if (!validValues.includes(value)) {
  throw new ValidationError(`Value must be one of: ${validValues.join(', ')}`);
}
```

### Format Validation
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new ValidationError('Invalid email format');
}
```

## Testing Checklist

- [ ] Test with missing authentication
- [ ] Test with invalid input
- [ ] Test with missing required fields
- [ ] Test database errors (not found, etc.)
- [ ] Test Stripe errors (if applicable)
- [ ] Test edge cases (already exists, etc.)
- [ ] Verify error logging
- [ ] Check response format
- [ ] Ensure no sensitive data exposed

## Common Mistakes to Avoid

### ❌ Don't expose internal errors
```typescript
// Bad
return errorResponse(error.stack, 500);

// Good
logger.error('Internal error', context, error);
return errorResponse('Operation failed', 500);
```

### ❌ Don't use generic errors
```typescript
// Bad
throw new Error('Unauthorized');

// Good
throw new AuthenticationError('You must be logged in');
```

### ❌ Don't forget logging context
```typescript
// Bad
console.log('Error:', error);

// Good
logger.error('Operation failed', { userId, operation }, error);
```

### ❌ Don't catch and swallow errors
```typescript
// Bad
try {
  await operation();
} catch (e) {
  // Silent failure
}

// Good
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', context, error);
  throw error; // Or handle appropriately
}
```

### ❌ Don't return 200 for errors
```typescript
// Bad
return successResponse({ error: 'Something failed' }, 200);

// Good
throw new Error('Something failed'); // Or use specific error class
```

## Environment-Specific Behavior

### Development
- Pretty console logs with emojis
- Detailed error messages
- Stack traces visible
- Error details in UI

### Production
- JSON structured logs
- Generic error messages to users
- No stack traces exposed
- Detailed logs server-side only

## Useful Commands

### View logs in real-time
```bash
# Development
npm run dev | grep ERROR

# Check for specific error types
npm run dev | grep "Stripe error"
```

### Test error endpoints
```bash
# Missing auth
curl http://localhost:3000/api/v1/protected-route

# Invalid input
curl -X POST http://localhost:3000/api/v1/endpoint \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```

## Links

- **Full Documentation**: `AGENT_4_ERROR_HANDLING_COMPLETE.md`
- **Testing Guide**: `AGENT_4_ERROR_TESTING_GUIDE.md`
- **Error Utilities**: `src/lib/utils/errors.ts`
- **Logger**: `src/lib/utils/logger.ts`
- **Error Boundary**: `src/components/error-boundary.tsx`

---

**Keep this reference handy when implementing new features!** 🚀

