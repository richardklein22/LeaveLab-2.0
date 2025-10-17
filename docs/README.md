# LeaveLab Documentation 📚

**Complete documentation for the LeaveLab digital nomad platform**

Welcome to the LeaveLab documentation hub. This directory contains comprehensive guides for users, developers, and operators of the LeaveLab platform.

---

## 📖 Documentation Index

### For Users

**[User Subscription Guide](./USER_SUBSCRIPTION_GUIDE.md)** 🎯
- Understanding subscription tiers (Free, Basic, Premium)
- Managing your subscription
- Billing and payment information
- Trial periods and cancellations
- Frequently asked questions

**Audience**: End users of LeaveLab  
**Topics**: Subscriptions, billing, account management, FAQs

---

### For Developers

**[Developer Guide](./DEVELOPER_GUIDE.md)** 🏗️
- Architecture overview
- Tech stack and dependencies
- Project structure
- Database schema and RLS policies
- Authentication and subscription systems
- API design patterns
- Frontend patterns and best practices
- Security guidelines
- Testing strategy
- Performance optimization

**Audience**: Developers building or maintaining LeaveLab  
**Topics**: Architecture, codebase, patterns, development workflow

---

**[API Reference](./API_REFERENCE.md)** 📡
- Complete API documentation
- Authentication endpoints
- Profile management endpoints
- Subscription endpoints
- Account management endpoints
- Premium content endpoints
- Request/response formats
- Error codes and handling
- Rate limiting

**Audience**: Developers integrating with the LeaveLab API  
**Topics**: API endpoints, authentication, request/response formats

---

**[Webhook Events](./WEBHOOK_EVENTS.md)** 🔔
- Stripe webhook integration
- n8n workflow automation
- Webhook security and verification
- Event types and payloads
- Testing webhooks locally
- Troubleshooting webhook issues

**Audience**: Developers implementing webhook handling  
**Topics**: Stripe webhooks, n8n integration, event handling

---

### For Operations

**[Deployment Guide](./DEPLOYMENT_GUIDE.md)** 🚀
- Production deployment checklist
- Vercel deployment setup
- Supabase configuration
- Stripe production setup
- Environment variables
- Database migrations
- Monitoring and logging
- CI/CD pipeline
- Rollback procedures
- Disaster recovery

**Audience**: DevOps, SysAdmins, Technical Leads  
**Topics**: Deployment, infrastructure, monitoring, operations

---

## 🎯 Quick Start by Role

### I'm a User
→ Start with [User Subscription Guide](./USER_SUBSCRIPTION_GUIDE.md)

**Learn how to**:
- Choose the right subscription tier
- Subscribe and manage payments
- Use trial periods
- Cancel or upgrade subscriptions
- Get support

---

### I'm a New Developer
→ Start with [Developer Guide](./DEVELOPER_GUIDE.md)

**Learn about**:
1. Architecture overview
2. Project structure
3. Local development setup
4. Key patterns and conventions
5. Testing approach

**Then explore**:
- [API Reference](./API_REFERENCE.md) for endpoint details
- [Webhook Events](./WEBHOOK_EVENTS.md) for webhook integration

---

### I'm Integrating with the API
→ Start with [API Reference](./API_REFERENCE.md)

**Find**:
- Authentication flow
- All available endpoints
- Request/response formats
- Error handling
- Rate limits

**Then check**:
- [Webhook Events](./WEBHOOK_EVENTS.md) if using webhooks

---

### I'm Deploying to Production
→ Start with [Deployment Guide](./DEPLOYMENT_GUIDE.md)

**Follow**:
1. Pre-deployment checklist
2. Vercel setup
3. Supabase configuration
4. Stripe production mode
5. Environment variables
6. Post-deployment verification

---

## 📋 Documentation Status

| Document | Status | Last Updated | Version |
|----------|--------|--------------|---------|
| User Subscription Guide | ✅ Complete | Oct 2025 | 1.0 |
| Developer Guide | ✅ Complete | Oct 2025 | 1.0 |
| API Reference | ✅ Complete | Oct 2025 | 1.0 |
| Webhook Events | ✅ Complete | Oct 2025 | 1.0 |
| Deployment Guide | ✅ Complete | Oct 2025 | 1.0 |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                     CLIENT LAYER                     │
│  Next.js 15 + React 19 + TypeScript + Tailwind     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                   MIDDLEWARE LAYER                   │
│  Authentication + Route Guards + Session Mgmt        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                   BACKEND SERVICES                   │
│  ┌─────────────┬─────────────┬──────────────────┐   │
│  │  Supabase   │   Stripe    │      n8n         │   │
│  │  - Auth     │  - Payments │  - Workflows     │   │
│  │  - Database │  - Webhooks │  - Emails        │   │
│  │  - Storage  │  - Portal   │  - Automation    │   │
│  └─────────────┴─────────────┴──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Key Technologies**:
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe (Checkout + Subscriptions + Webhooks)
- **Automation**: n8n (Email workflows + Notifications)
- **Hosting**: Vercel (Edge Network + Serverless Functions)

---

## 🔐 Security

All documentation follows security best practices:

- ✅ **Authentication**: Session-based auth with HTTP-only cookies
- ✅ **Authorization**: Row-Level Security (RLS) on all database tables
- ✅ **Validation**: Zod schemas for all inputs
- ✅ **Encryption**: HTTPS only, encrypted data at rest
- ✅ **Secrets**: Never commit secrets, use environment variables
- ✅ **Webhooks**: Signature verification for all webhooks
- ✅ **Rate Limiting**: Protection against abuse
- ✅ **GDPR Compliant**: Data export and deletion

---

## 📊 Features Covered

### Authentication & Authorization
- Email/password signup and login
- Google OAuth integration
- Email verification
- Password reset with PKCE
- Session management
- Brute force protection

### Profile Management
- User profiles (display name, bio, timezone)
- Avatar upload with drag-and-drop
- Profile API (CRUD operations)

### Subscription Management
- Three tiers: Free, Basic, Premium
- Stripe Checkout integration
- Monthly and annual billing
- 7-day trial for Premium
- Customer Portal for self-service
- Subscription webhooks
- n8n automation

### Account Settings
- Change password
- Session management (view/revoke)
- Connected OAuth providers
- Data export (GDPR Article 20)
- Account deletion (GDPR Article 17)

### Access Control
- Subscription-based content gating
- RLS policies for data protection
- Tier-based feature access

---

## 🧪 Testing

All features are tested:

- **Unit Tests**: 80%+ coverage on business logic
- **Integration Tests**: All API routes
- **E2E Tests**: Critical user journeys
- **Manual Testing**: Pre-deployment checklist

**Test Commands**:
```bash
npm run test              # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report
```

---

## 🚀 Deployment

**Production Stack**:
- **Frontend**: Vercel (Edge Network)
- **Database**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe (Production mode)
- **Automation**: n8n (Pre-deployed)

**Deployment Process**:
1. Push to `main` branch → Auto-deploy to Vercel
2. Database migrations → Manual via Supabase CLI
3. Environment variables → Set in Vercel dashboard
4. Domain → Custom domain with SSL

---

## 📞 Support

### For Users
- **Email**: support@leavelab.com
- **Response Time**: 24-48 hours (depending on tier)

### For Developers
- **GitHub Issues**: Report bugs and request features
- **Developer Email**: dev@leavelab.com
- **Documentation**: This directory

### For Contributors
- **Contributing Guide**: See `CONTRIBUTING.md` (if exists)
- **Code of Conduct**: See `CODE_OF_CONDUCT.md` (if exists)

---

## 🔄 Keeping Documentation Updated

### When to Update

Update documentation when:
- ✅ Adding new features
- ✅ Changing API endpoints
- ✅ Modifying subscription tiers or pricing
- ✅ Adding new webhook events
- ✅ Changing deployment procedures
- ✅ Updating dependencies (major versions)

### How to Update

1. Edit the relevant `.md` file
2. Update "Last Updated" date
3. Increment version if major changes
4. Test all code examples
5. Commit with clear message:
   ```bash
   git commit -m "docs: update API reference for new endpoint"
   ```

---

## 📚 Additional Resources

### External Documentation
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Vercel**: https://vercel.com/docs
- **n8n**: https://docs.n8n.io

### LeaveLab Resources
- **Main README**: `../README.md`
- **Specifications**: `../specs/`
- **Setup Guide**: `../QUICK_START_GUIDE.md`
- **Phase Summaries**: `../PHASE_*_COMPLETE.md`

---

## 🎉 Documentation Complete!

All five documentation areas are complete:

1. ✅ **User Subscription Guide** - For end users
2. ✅ **Developer Guide** - For developers
3. ✅ **API Reference** - For API integrators
4. ✅ **Webhook Events** - For webhook implementers
5. ✅ **Deployment Guide** - For operations teams

**Total Documentation**: ~15,000+ lines of comprehensive guides

---

## 📝 Version History

### Version 1.0 (October 2025)
- Initial documentation release
- Complete coverage of all features
- User, developer, and operations guides
- API reference and webhook documentation
- Deployment guide

---

**Need help?** Choose the guide that matches your role above, or contact support@leavelab.com.

**Happy Building!** 🚀

---

*Documentation maintained by the LeaveLab team*  
*Last Updated: October 2025*

