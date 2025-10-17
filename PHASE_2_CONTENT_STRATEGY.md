# LeaveLab Phase 2: Content & Presentation Strategy 🎨

**Date:** October 17, 2025  
**Purpose:** Strategic planning for content pages, branding, and user experience

---

## 🎯 Strategic Overview

### What We've Built (Phase 1):
✅ **Foundation Complete**
- Authentication (email + Google OAuth)
- Subscription system (Free, Basic, Premium)
- Payment processing (Stripe)
- Access control (RLS + middleware)
- Profile management
- API infrastructure

### What We Need to Build (Phase 2):
🎨 **Content & Presentation**
- Public landing page (marketing/conversion)
- Authenticated home/dashboard
- Income courses platform (catalog + course pages)
- Visa information system (gated by tier)
- Accommodation guides (gated by tier)
- Cohesive branding & design system

---

## 👤 User Journey Map

### 1. **Anonymous User Journey**
```
Visit leavelab.com
    ↓
[Landing Page] - See value proposition
    ↓
Browse content previews (limited)
    ↓
Hit paywall / upgrade prompt
    ↓
Sign up (email or Google)
    ↓
Start with Free tier
    ↓
Try first modules of courses
    ↓
See value → Upgrade to Basic/Premium
```

### 2. **Free Tier User Journey**
```
Login → Dashboard
    ↓
See personalized content
    ↓
Access first module of ALL courses ✅
    ↓
Hit paywall on module 2+
    ↓
See clear upgrade prompts
    ↓
Upgrade to Basic
```

### 3. **Basic Tier User Journey**
```
Login → Dashboard
    ↓
Enroll in 1 course (full access)
    ↓
Access short-term visa info ✅
    ↓
Access short-term accommodation info ✅
    ↓
See Premium features (long-term content)
    ↓
Upgrade to Premium (optional)
```

### 4. **Premium Tier User Journey**
```
Login → Dashboard
    ↓
Access ALL courses (unlimited)
    ↓
Access ALL visa information ✅
    ↓
Access ALL accommodation guides ✅
    ↓
One-on-one expert support ✅
    ↓
Full platform access
```

---

## 🎨 Branding Strategy

### Brand Identity: "LeaveLab"

**Concept:** A laboratory for aspiring digital nomads - experiment, learn, and launch your nomadic lifestyle.

### Brand Personality:
- **Professional** yet **approachable**
- **Knowledgeable** yet **not preachy**
- **Inspiring** yet **practical**
- **Modern** yet **trustworthy**

### Color Palette Suggestions:

#### Option 1: "Adventure Blue" (Recommended)
```
Primary:   #2563EB (Blue - trust, stability)
Secondary: #F59E0B (Amber - warmth, adventure)
Accent:    #10B981 (Green - success, go)
Neutral:   #64748B (Slate - professional)

Usage:
- Blue: Primary buttons, headers, trust elements
- Amber: CTAs, highlights, "start journey" actions
- Green: Success states, achievements, progress
- Slate: Body text, subtle elements
```

#### Option 2: "Global Purple"
```
Primary:   #7C3AED (Purple - creativity, premium)
Secondary: #EC4899 (Pink - energy, excitement)
Accent:    #06B6D4 (Cyan - travel, freedom)
Neutral:   #6B7280 (Gray - balance)
```

#### Option 3: "Earth Tones"
```
Primary:   #0891B2 (Teal - ocean, travel)
Secondary: #EA580C (Orange - sunset, adventure)
Accent:    #65A30D (Lime - growth, new starts)
Neutral:   #78716C (Stone - grounded, real)
```

**Recommendation:** Option 1 (Adventure Blue) - Professional, trustworthy, with adventurous accents.

### Typography System:

```css
/* Headings */
Font Family: 'Inter' or 'Plus Jakarta Sans'
H1: 3rem (48px), Bold (800)
H2: 2.25rem (36px), Bold (700)
H3: 1.5rem (24px), Semibold (600)

/* Body */
Font Family: 'Inter' or 'System UI'
Body: 1rem (16px), Regular (400)
Small: 0.875rem (14px), Regular (400)

/* Special */
Accent: 'Caveat' or 'Pacifico' (for handwritten feel)
Code: 'Fira Code' or 'JetBrains Mono'
```

### Logo Concept:

```
 _                          _          _     
| |                        | |        | |    
| |     ___  __ ___   _____| |    __ _| |__  
| |    / _ \/ _` \ \ / / _ \ |   / _` | '_ \ 
| |___|  __/ (_| |\ V /  __/ |__| (_| | |_) |
\_____/\___|\__,_| \_/ \___|_____\__,_|_.__/ 
```

Or simpler:
```
🌍 LeaveLab
```

**Icon:** Stylized globe with a location pin + arrow (departure/journey)

---

## 📄 Page Structure & Content Strategy

### 1. Landing Page (`/`)

**Purpose:** Convert visitors into users

**Hero Section:**
```
[Full-width hero with background image/video]

Headline: "Master Your Digital Nomad Journey"
Subheadline: "Learn visa strategies, find accommodation, 
              and build sustainable income from anywhere"

[CTA: Start Free] [CTA: View Courses]

Social Proof: "Join 10,000+ digital nomads worldwide"
```

**Key Sections:**
1. **Problem/Solution** - Why nomad life is hard, how we help
2. **Course Preview** - 3-4 featured courses with previews
3. **Visa & Accommodation** - Quick overview of resources
4. **Pricing** - Clear tier comparison
5. **Testimonials** - User success stories
6. **FAQ** - Common questions
7. **Final CTA** - Start your journey

**Conversion Points:**
- Hero CTA (2 buttons)
- After each major section
- Sticky header CTA
- Exit intent popup (optional)

---

### 2. Dashboard/Home (`/dashboard`)

**Purpose:** Personalized hub for logged-in users

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Welcome back, [Name]! [Tier Badge] [Logout]│
├─────────────────────────────────────────────┤
│                                             │
│ [Progress Widget] [Quick Actions]          │
│                                             │
├──────────────────┬──────────────────────────┤
│                  │                          │
│ Continue         │ Recommended              │
│ Learning         │ For You                  │
│                  │                          │
│ [Course Card]    │ [Content Cards]          │
│ [Course Card]    │ [Content Cards]          │
│                  │                          │
├──────────────────┴──────────────────────────┤
│                                             │
│ [Upgrade Prompt if Free/Basic]              │
│                                             │
└─────────────────────────────────────────────┘
```

**Widgets/Sections:**

1. **Welcome Header**
   - Personalized greeting
   - Current tier badge
   - Upgrade button (if applicable)

2. **Progress Overview** (for enrolled courses)
   - Course progress bars
   - Completion badges
   - Next lesson CTA

3. **Continue Learning**
   - Last accessed course
   - Next lesson preview
   - Resume button

4. **Recommended Content**
   - Based on user behavior
   - Popular courses
   - New releases

5. **Quick Actions**
   - Browse all courses
   - Explore visa guides
   - Find accommodation
   - Manage subscription

6. **Tier-Specific Sections**
   - Free: Prominent upgrade prompt
   - Basic: "Upgrade to unlock more"
   - Premium: "You have full access!"

---

### 3. Courses Page (`/courses`)

**Purpose:** Course catalog and discovery

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Income Courses                              │
│ Learn how to build sustainable income       │
│                                             │
│ [Search] [Filter: All | Beginner | Advanced]│
├─────────────────────────────────────────────┤
│                                             │
│ ┌────────┐ ┌────────┐ ┌────────┐          │
│ │Course 1│ │Course 2│ │Course 3│          │
│ │🆓 FREE │ │💼 BASIC│ │⭐ PREMIUM│         │
│ └────────┘ └────────┘ └────────┘          │
│                                             │
│ ┌────────┐ ┌────────┐ ┌────────┐          │
│ │Course 4│ │Course 5│ │Course 6│          │
│ └────────┘ └────────┘ └────────┘          │
└─────────────────────────────────────────────┘
```

**Course Card Design:**
```
┌────────────────────────────┐
│ [Thumbnail Image]          │
│                            │
│ 🆓 Module 1 Free           │
├────────────────────────────┤
│ Course Title               │
│ Brief description...       │
│                            │
│ ⏱️ 4 hours • 📚 12 lessons│
│ ⭐⭐⭐⭐⭐ (234 reviews)    │
│                            │
│ [View Course →]            │
└────────────────────────────┘
```

**Filters:**
- All courses
- By difficulty (Beginner, Intermediate, Advanced)
- By topic (Freelancing, E-commerce, SaaS, etc.)
- By duration (< 2 hours, 2-5 hours, 5+ hours)

---

### 4. Individual Course Page (`/courses/[slug]`)

**Purpose:** Course overview and module access

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [Hero Banner]                               │
│ Course Title                                │
│ Short description                           │
│ [Enroll Now] or [Continue Learning]         │
├─────────────────────────────────────────────┤
│ About This Course    │ Course Content       │
│                      │                      │
│ What You'll Learn:   │ ✅ Module 1 (Free)  │
│ • Point 1            │   📹 Lesson 1.1     │
│ • Point 2            │   📹 Lesson 1.2     │
│ • Point 3            │   📹 Lesson 1.3     │
│                      │                      │
│ Requirements:        │ 🔒 Module 2         │
│ • Requirement 1      │   (Upgrade to Basic)│
│                      │                      │
│ Who This Is For:     │ 🔒 Module 3         │
│ • Audience 1         │   (Upgrade to Basic)│
│ • Audience 2         │                      │
└──────────────────────┴──────────────────────┘
```

**Key Elements:**
- Course overview video/image
- Clear learning outcomes
- Module/lesson structure
- Instructor info (optional)
- Reviews/testimonials
- Enrollment CTA
- Free preview (Module 1)
- Locked content preview

---

### 5. Lesson Player (`/courses/[slug]/lessons/[lessonId]`)

**Purpose:** Video/content consumption

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [Video Player - Full Width]                 │
│                                             │
├─────────────────────────────────────────────┤
│ Lesson Title                    [Next →]   │
├──────────────────┬──────────────────────────┤
│                  │                          │
│ Content/         │ Course Sidebar           │
│ Transcript       │                          │
│                  │ ✅ Lesson 1.1           │
│ Notes section    │ ▶️ Lesson 1.2 (current) │
│                  │ 📝 Lesson 1.3           │
│ Resources        │                          │
│ Downloads        │ 🔒 Lesson 2.1           │
│                  │ 🔒 Lesson 2.2           │
└──────────────────┴──────────────────────────┘
```

---

### 6. Visa Information (`/visa-info`)

**Purpose:** Country-specific visa guides

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Visa Information Hub                        │
│ Everything you need to know about visas     │
│                                             │
│ [Search Country] [Filter: All | Short | Long]│
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │🇹🇭       │ │🇵🇹       │ │🇲🇽       │       │
│ │Thailand  │ │Portugal │ │Mexico   │       │
│ │30-60 days│ │D7 Visa  │ │180 days │       │
│ │💼 BASIC  │ │⭐ PREMIUM│ │💼 BASIC  │       │
│ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────┘
```

**Country Card:**
```
┌──────────────────────────┐
│ 🇹🇭 Thailand             │
│                          │
│ Short-term (30-60 days)  │
│ Visa on Arrival          │
│                          │
│ 💼 Basic Tier Required   │
│                          │
│ [View Details →]         │
└──────────────────────────┘
```

**Individual Visa Page (`/visa-info/[country]/[visa-type]`):**
- Requirements checklist
- Application process (step-by-step)
- Costs breakdown
- Processing time
- Tips and common mistakes
- Recent updates
- Related visas

**Content Gating:**
- Free: Can see countries, limited info
- Basic: Short-term visa details
- Premium: Long-term visas, work permits, residency

---

### 7. Accommodation (`/accommodation`)

**Purpose:** Finding housing as a digital nomad

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Accommodation Guides                        │
│ Find your perfect home abroad               │
│                                             │
│ [Search Location] [Type: All | Short | Long]│
├─────────────────────────────────────────────┤
│                                             │
│ Featured Cities                             │
│ ┌────────┐ ┌────────┐ ┌────────┐          │
│ │Bangkok │ │Lisbon  │ │Medellín│          │
│ │$400/mo │ │$800/mo │ │$500/mo │          │
│ └────────┘ └────────┘ └────────┘          │
│                                             │
│ Accommodation Types                         │
│ • Hotels & Hostels (💼 Basic)              │
│ • Airbnb & Short-term (💼 Basic)           │
│ • Long-term Rentals (⭐ Premium)            │
│ • Co-living Spaces (⭐ Premium)             │
└─────────────────────────────────────────────┘
```

**City Guide Page:**
- Neighborhood breakdown
- Average costs by area
- Best platforms for finding housing
- Landlord tips
- Lease negotiation advice
- Safety ratings
- Internet speed data
- Coworking spaces nearby

**Content Gating:**
- Free: Can see cities, basic info
- Basic: Short-term accommodation (< 3 months)
- Premium: Long-term rentals, buying property

---

## 🎨 Design System Components

### Component Library to Build:

1. **Hero Sections**
   - Full-width hero with CTA
   - Split hero (image + content)
   - Minimal hero (text-focused)

2. **Content Cards**
   - Course card
   - Country card (visa)
   - City card (accommodation)
   - Feature card
   - Testimonial card

3. **Navigation**
   - Main header (public vs authenticated)
   - Footer with links
   - Breadcrumbs
   - Course sidebar navigation

4. **CTAs & Prompts**
   - Upgrade prompts (tier-specific)
   - Enrollment CTAs
   - Newsletter signup
   - Social proof badges

5. **Content Sections**
   - Feature grid (3-col, 4-col)
   - Testimonial carousel
   - FAQ accordion
   - Pricing comparison (existing)
   - Stats/metrics section

6. **Media**
   - Video player component
   - Image galleries
   - Icon system
   - Illustrations/graphics

7. **Interactive**
   - Search bars
   - Filters/sorting
   - Progress indicators
   - Tooltips
   - Modals

---

## 📊 Content Priority Matrix

### Phase 2.1 - MVP Content (Weeks 1-2)
**Goal:** Core pages with sample content

**Must Have:**
- ✅ Landing page (full design)
- ✅ Dashboard (basic version)
- ✅ Courses page (3-5 sample courses)
- ✅ 1 complete course (4-5 modules)
- ✅ Visa info hub (10-15 countries)
- ✅ Accommodation hub (5-10 cities)

### Phase 2.2 - Content Expansion (Weeks 3-4)
**Goal:** Fill out the platform

**Should Have:**
- ✅ 10+ courses
- ✅ 30+ country visa guides
- ✅ 20+ city accommodation guides
- ✅ Blog/articles section
- ✅ Community features (basic)

### Phase 2.3 - Enhancement (Weeks 5-6)
**Goal:** Polish and premium features

**Nice to Have:**
- ✅ Advanced course features (quizzes, certificates)
- ✅ Live webinars
- ✅ Expert consultations (Premium)
- ✅ Community forum
- ✅ Resource library

---

## 🎯 Success Metrics

### Conversion Goals:
- **Landing → Signup:** 5-10%
- **Free → Basic:** 10-15%
- **Basic → Premium:** 20-25%
- **Course Completion:** 40-50%

### Engagement Goals:
- **Daily Active Users:** 30% of subscribers
- **Course Enrollment:** Avg 2-3 per user
- **Time on Platform:** 15-20 min/session
- **Return Visits:** 3-4x per week

---

## 📝 Content Creation Strategy

### Course Content:
1. **Income Streams** (Priority 1)
   - Freelancing fundamentals
   - Building a SaaS product
   - E-commerce for nomads
   - Consulting remotely
   - Content creation

2. **Technical Skills** (Priority 2)
   - Remote work tools
   - Time zone management
   - Client communication
   - Project management

3. **Lifestyle** (Priority 3)
   - Health insurance
   - Banking abroad
   - Taxes for nomads
   - Building routines

### Visa Content Structure:
```
Country → Visa Type → Guide
├── Overview
├── Requirements
├── Application Process
├── Costs
├── Timeline
├── Tips & Tricks
└── Recent Updates
```

### Accommodation Content Structure:
```
City → Neighborhood → Guide
├── Overview
├── Cost Breakdown
├── Finding Housing
├── What to Know
├── Safety & Amenities
└── Resources
```

---

## 🚀 Implementation Roadmap

### Week 1: Design & Branding
- [ ] Finalize color palette
- [ ] Create component library
- [ ] Design landing page
- [ ] Design dashboard
- [ ] Design course pages

### Week 2: Landing & Core Pages
- [ ] Build landing page
- [ ] Build improved dashboard
- [ ] Build courses catalog
- [ ] Build course detail page

### Week 3: Course Platform
- [ ] Build lesson player
- [ ] Create 3-5 sample courses
- [ ] Implement module/lesson navigation
- [ ] Test course enrollment flow

### Week 4: Visa & Accommodation
- [ ] Build visa info hub
- [ ] Build accommodation hub
- [ ] Create 10-15 country guides
- [ ] Create 5-10 city guides

### Week 5: Polish & Integration
- [ ] Integrate everything
- [ ] Add branding throughout
- [ ] Refine navigation
- [ ] Add animations/transitions

### Week 6: Content & Testing
- [ ] Add more courses
- [ ] Add more guides
- [ ] User testing
- [ ] Bug fixes

---

## 💡 Next Steps

1. **Review this strategy** - Approve direction and design choices
2. **Create Speckit guide** - Detailed technical specifications
3. **Prioritize features** - What to build first
4. **Design mockups** - Visual representations
5. **Start building** - Implementation phase

---

**Ready to create the Speckit guide?** Let me know if you want to adjust anything first!

