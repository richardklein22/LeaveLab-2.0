# Environment Variables to Add

**File**: `.env.local`

Copy and paste these variables into your `.env.local` file:

```bash
# Supabase Configuration (should already exist)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51P6tSY2NPhvfjGt3eN13KGxBNykkT8VqnEdkKk9L3enjaoQfZlfPu6Ifq07mJohidACNOzGE4yjDe2LYERc3lIaF00tB8yB9vj
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51P6tSY2NPhvfjGt3rI7mn1mxfGEfN8jRjX7Zxg4tONAGfF2IRyBDCtjlqivyAmd34GNZy8Ip2mGtkiy2esAVk3NQ00T0Xl6Rnu
STRIPE_WEBHOOK_SECRET=whsec_144baa602d8d09825e3338f1d3b53c498b94fa1cf351f705c64ee4fe0880f0dd

# n8n Webhook Configuration
N8N_WEBHOOK_URL=https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33
```

---

## ⚠️ IMPORTANT: Action Required

1. **Open** `.env.local` in your editor (create it if it doesn't exist)
2. **Copy** the variables above
3. **Paste** them into `.env.local`
4. **Save** the file
5. **Restart** your Next.js dev server (`npm run dev`)

---

## Your Webhook Secret

```
whsec_144baa602d8d09825e3338f1d3b53c498b94fa1cf351f705c64ee4fe0880f0dd
```

This secret is used to verify that webhook events are genuinely from Stripe.

---

**After adding these variables, you can delete this file.**

