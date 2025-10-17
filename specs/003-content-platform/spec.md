# Content Platform - Technical Specification

**Version:** 1.0.0  
**Date:** October 17, 2025  
**Status:** Ready for Implementation  
**Design System:** Dark Theme + Red Branding (Global System)

---

## Executive Summary

Build the core content delivery platform for LeaveLab, including income-generating courses, visa information resources, and accommodation guides. All pages will use the **global design system** (dark theme, red branding, glassmorphism, bold typography) established in Phase 1.

---

## Table of Contents

1. [Vision & Goals](#vision--goals)
2. [Design System Compliance](#design-system-compliance)
3. [Feature Breakdown](#feature-breakdown)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Access Control](#access-control)
8. [User Flows](#user-flows)
9. [Technical Architecture](#technical-architecture)
10. [Testing Strategy](#testing-strategy)
11. [Performance Requirements](#performance-requirements)
12. [SEO Requirements](#seo-requirements)

---

## Vision & Goals

### Primary Goals
1. **Deliver premium course content** - Digital marketing, AI agencies, Amazon FBA
2. **Provide visa resources** - Country-specific visa information with tier-based access
3. **Offer accommodation guides** - Short-term and long-term options by location
4. **Drive conversions** - Clear upgrade paths from free to paid tiers
5. **Maintain consistency** - Use global design system throughout

### Success Metrics
- **Course Enrollment:** 60% of Basic users enroll in at least 1 course
- **Course Completion:** 40% completion rate for enrolled courses
- **Resource Usage:** 80% of users access visa/accommodation info
- **Upgrade Rate:** 25% of free users upgrade to Basic within 30 days
- **Page Load Speed:** <2.5s LCP, <100ms FID
- **Mobile Usage:** 70% of traffic from mobile devices

---

## Design System Compliance

### Constitution Principle VII
> ALL components MUST use the global design system. Individual component styling is PROHIBITED.

### Global Design System
```typescript
// Colors
brand-dark-950      // Page backgrounds
brand-dark-900      // Card backgrounds
brand-red           // Primary actions, CTAs
brand-red-600       // Hover states
brand-accent        // Secondary actions (purple)
brand-accent-pink   // Tertiary actions (pink)

// Glass Effects
.glass              // Frosted glass (white tint)
.glass-red          // Frosted glass (red tint)

// Typography
text-8xl font-black         // Hero headlines
text-6xl font-black         // Page titles
text-4xl font-bold          // Section titles
text-2xl font-bold          // Card titles
text-base                   // Body text

// Effects
.magnetic-button            // Scale on hover
.card-3d                    // 3D tilt effect
.animate-glow               // Red glow pulse
.animate-pulse-scale        // Pulse scaling
.animate-fadeIn             // Fade in animation
```

### Typography Guidelines
- **Headlines:** Always use gradient text effects
- **Body:** White/gray text on dark backgrounds
- **Links:** `text-brand-red hover:text-brand-red-400`
- **Buttons:** `bg-brand-red hover:bg-brand-red-600 magnetic-button`

### Card Guidelines
- **Base:** `glass border-white/10 overflow-hidden`
- **Overlay:** `absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none`
- **Content:** `relative z-10`

---

## Feature Breakdown

### 1. Course Platform

#### Course Catalog Page
**Route:** `/courses`

**Features:**
- Grid of course cards (3 columns desktop, 1 mobile)
- Filter by category (Digital Marketing, AI Agencies, Amazon FBA)
- Search functionality
- Progress indicators for enrolled courses
- "Coming Soon" badges for future courses
- Tier badges (Free preview, Basic, Premium)

**Design:**
- Bold headline: "Master Income-Generating Skills"
- Glassmorphic filter bar
- 3D card effects with hover animations
- Red glow on enrolled courses
- Progress rings showing completion %

**Access Control:**
- Free: First module preview only
- Basic: 1 full course enrollment
- Premium: Unlimited enrollments

---

#### Course Detail Page
**Route:** `/courses/[courseId]`

**Features:**
- Course overview with video preview
- Module/lesson structure (expandable accordion)
- Instructor bio
- Student testimonials
- Requirements & outcomes
- Enroll/Continue button (tier-gated)
- Progress tracker (if enrolled)
- Certificate download (on completion)

**Design:**
- Hero section with video player (glassmorphic overlay)
- Stats cards (students, rating, duration)
- Module accordion with lock icons
- Red CTA button ("Enroll Now" / "Continue Learning")
- Premium badge for locked content

**Module Structure:**
```typescript
Course
├── Module 1 (Free - Always accessible)
│   ├── Lesson 1: Introduction
│   ├── Lesson 2: Getting Started
│   └── Quiz 1
├── Module 2 (Basic+ required)
│   ├── Lesson 3: Core Concepts
│   └── Quiz 2
└── Module 3+ (Basic+ required)
```

---

#### Lesson Player Page
**Route:** `/courses/[courseId]/lessons/[lessonId]`

**Features:**
- Video player with controls (play, pause, speed, fullscreen)
- Lesson navigation (prev/next)
- Progress tracking (auto-save)
- Notes section (collapsible)
- Resources download (PDFs, templates)
- Quiz/assessment (end of module)
- Discussion forum link (Discord)

**Design:**
- Full-width video player (dark theme)
- Glassmorphic sidebar (lesson list)
- Floating progress indicator
- Red highlights on current lesson
- Magnetic "Next Lesson" button

**Video Player:**
- HTML5 video with custom controls
- Cloudflare Stream / Vimeo integration
- Captions support (EN-GB)
- Quality selector (480p, 720p, 1080p)
- Playback speed (0.5x - 2x)
- Picture-in-picture mode

---

### 2. Visa Information Hub

#### Visa Hub Page
**Route:** `/visa-info`

**Features:**
- Country search/filter
- Popular destinations grid
- Visa type badges (Tourist, Digital Nomad, Work, Student)
- Duration indicators (Short-term, Long-term)
- Difficulty ratings (Easy, Moderate, Complex)
- Recent updates indicator

**Design:**
- Bold headline: "Navigate Visa Requirements with Confidence"
- Glassmorphic search bar
- Country cards with flags
- Color-coded difficulty badges
- 3D hover effects

**Access Tiers:**
- Free: Country list only (no details)
- Basic: Short-term visa info (< 90 days)
- Premium: All visa info (short + long-term)

---

#### Visa Detail Page
**Route:** `/visa-info/[countryCode]`

**Features:**
- Visa types available
- Requirements checklist
- Application process (step-by-step)
- Processing times
- Costs breakdown
- Embassy contact info
- Recent policy changes
- User tips (from community)
- External resources (official gov links)

**Design:**
- Hero with country flag/image
- Requirements cards (glassmorphic)
- Timeline visualization
- Cost table (glassmorphic)
- Red "Upgrade to View All" prompts

**Content Structure:**
```markdown
## Visa Types
- Tourist Visa (30/60/90 days)
- Digital Nomad Visa (6-12 months) [Premium]
- Work Visa (1-5 years) [Premium]

## Requirements
- Valid passport (6+ months)
- Proof of funds ($X,XXX)
- Return ticket
- Accommodation booking
- Travel insurance [Premium: full details]

## Application Process
1. Gather documents
2. Submit online application
3. Pay fees ($XXX)
4. Attend interview (if required) [Premium]
5. Wait 2-4 weeks [Premium: expedited options]
```

---

### 3. Accommodation Guide

#### Accommodation Hub Page
**Route:** `/accommodation`

**Features:**
- Location search/filter
- Accommodation types (Hotels, Hostels, Apartments, Co-living)
- Price range filters
- Duration filters (Nightly, Weekly, Monthly)
- Ratings & reviews
- Map integration
- Booking links (affiliate)

**Design:**
- Bold headline: "Find Your Perfect Base"
- Glassmorphic filter sidebar
- Location cards with images
- Price badges (green = budget, red = premium)
- 3D card effects

**Access Tiers:**
- Free: Accommodation types only (no details)
- Basic: Short-term options (< 1 month)
- Premium: All options (short + long-term)

---

#### Accommodation Detail Page
**Route:** `/accommodation/[locationId]`

**Features:**
- Location overview
- Accommodation options (cards)
- Price comparison table
- Neighborhood guide
- Safety ratings
- Nomad-friendly features (WiFi, coworking, etc.)
- Transportation info
- Cost of living data
- User reviews

**Design:**
- Hero with location image
- Stats cards (avg rent, WiFi speed, safety)
- Comparison table (glassmorphic)
- Map with pins
- Red affiliate buttons

**Content Structure:**
```markdown
## Accommodation Types

### Hotels
- Budget: $30-50/night
- Mid-range: $60-100/night
- Luxury: $120+/night

### Apartments [Premium]
- Studio: $400-600/month
- 1-bedroom: $600-900/month
- Shared: $300-500/month

### Co-living [Premium]
- All-inclusive: $800-1200/month
- Amenities: WiFi, cleaning, events
```

---

## Database Schema

### Courses

```sql
-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'digital_marketing', 'ai_agencies', 'amazon_fba'
  thumbnail_url TEXT,
  preview_video_url TEXT,
  instructor_id UUID REFERENCES public.profiles(id),
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  duration_hours INT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules table
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL,
  is_free BOOLEAN DEFAULT false, -- Module 1 is always free
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INT,
  order_index INT NOT NULL,
  content JSONB, -- Markdown, resources, quiz data
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress_percentage INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Lesson progress
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INT DEFAULT 0,
  notes TEXT,
  UNIQUE(user_id, lesson_id)
);

-- Create indexes
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX idx_lessons_module ON public.lessons(module_id);
CREATE INDEX idx_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
```

### Visa Information

```sql
-- Countries table
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- 'GB', 'ES', 'TH'
  name TEXT NOT NULL,
  flag_emoji TEXT,
  region TEXT, -- 'europe', 'asia', 'americas', 'africa', 'oceania'
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visa information table
CREATE TABLE public.visa_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  visa_type TEXT NOT NULL, -- 'tourist', 'digital_nomad', 'work', 'student'
  duration TEXT NOT NULL, -- 'short_term' (<90 days), 'long_term' (90+ days)
  title TEXT NOT NULL,
  requirements JSONB, -- Array of requirements
  process_steps JSONB, -- Array of steps
  processing_time TEXT, -- '2-4 weeks'
  cost_usd INT,
  difficulty TEXT, -- 'easy', 'moderate', 'complex'
  notes TEXT,
  official_link TEXT,
  tier_required TEXT NOT NULL, -- 'free', 'basic', 'premium'
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_countries_region ON public.countries(region);
CREATE INDEX idx_visa_info_country ON public.visa_info(country_id);
CREATE INDEX idx_visa_info_tier ON public.visa_info(tier_required);
```

### Accommodation

```sql
-- Locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID REFERENCES public.countries(id),
  city TEXT NOT NULL,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone TEXT,
  currency TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accommodation options
CREATE TABLE public.accommodation_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'hotel', 'hostel', 'apartment', 'coliving'
  duration TEXT NOT NULL, -- 'nightly', 'weekly', 'monthly'
  title TEXT NOT NULL,
  description TEXT,
  price_usd INT NOT NULL,
  currency TEXT,
  amenities JSONB, -- ['wifi', 'coworking', 'kitchen', 'gym']
  booking_link TEXT, -- Affiliate link
  safety_rating INT, -- 1-5
  wifi_speed_mbps INT,
  tier_required TEXT NOT NULL, -- 'free', 'basic', 'premium'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_locations_country ON public.locations(country_id);
CREATE INDEX idx_accommodation_location ON public.accommodation_options(location_id);
CREATE INDEX idx_accommodation_type ON public.accommodation_options(type);
CREATE INDEX idx_accommodation_tier ON public.accommodation_options(tier_required);
```

---

## API Endpoints

### Course Endpoints

```typescript
// Get all courses (filtered by user's tier)
GET /api/v1/courses
Query: ?category=digital_marketing&search=seo
Response: {
  courses: Course[],
  userEnrollments: string[], // course IDs
  availableCourses: number // based on tier
}

// Get single course
GET /api/v1/courses/[courseId]
Response: {
  course: Course,
  modules: Module[],
  isEnrolled: boolean,
  canEnroll: boolean,
  progress: number
}

// Enroll in course
POST /api/v1/courses/[courseId]/enroll
Response: {
  enrollment: Enrollment,
  message: string
}

// Get lesson
GET /api/v1/courses/[courseId]/lessons/[lessonId]
Response: {
  lesson: Lesson,
  hasAccess: boolean,
  nextLesson: Lesson | null,
  prevLesson: Lesson | null
}

// Update lesson progress
POST /api/v1/lessons/[lessonId]/progress
Body: {
  completed: boolean,
  timeSpentSeconds: number,
  notes?: string
}
Response: {
  progress: LessonProgress,
  courseProgress: number
}
```

### Visa Information Endpoints

```typescript
// Get all countries
GET /api/v1/visa-info/countries
Query: ?region=europe&search=spain
Response: {
  countries: Country[],
  accessibleCountries: number // based on tier
}

// Get country visa info
GET /api/v1/visa-info/[countryCode]
Response: {
  country: Country,
  visaInfo: VisaInfo[], // filtered by user's tier
  hasFullAccess: boolean
}
```

### Accommodation Endpoints

```typescript
// Get all locations
GET /api/v1/accommodation/locations
Query: ?country=ES&search=barcelona
Response: {
  locations: Location[],
  accessibleLocations: number
}

// Get location accommodation options
GET /api/v1/accommodation/[locationId]
Response: {
  location: Location,
  options: AccommodationOption[], // filtered by tier
  hasFullAccess: boolean
}
```

---

## Frontend Components

### Course Components

```typescript
// CourseCard.tsx
interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  progress?: number;
  hasAccess: boolean;
}

// CourseGrid.tsx
interface CourseGridProps {
  courses: Course[];
  enrollments: string[];
  onEnroll: (courseId: string) => void;
}

// ModuleAccordion.tsx
interface ModuleAccordionProps {
  modules: Module[];
  currentLessonId?: string;
  hasAccess: (moduleId: string) => boolean;
  onLessonClick: (lessonId: string) => void;
}

// VideoPlayer.tsx
interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  onProgress: (seconds: number) => void;
  onComplete: () => void;
}

// ProgressRing.tsx
interface ProgressRingProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

### Visa Components

```typescript
// CountryCard.tsx
interface CountryCardProps {
  country: Country;
  hasAccess: boolean;
  visaCount: number;
}

// VisaTypeCard.tsx
interface VisaTypeCardProps {
  visaInfo: VisaInfo;
  hasAccess: boolean;
}

// RequirementsChecklist.tsx
interface RequirementsChecklistProps {
  requirements: string[];
  canCheck: boolean;
}
```

### Accommodation Components

```typescript
// LocationCard.tsx
interface LocationCardProps {
  location: Location;
  hasAccess: boolean;
  optionCount: number;
}

// AccommodationTable.tsx
interface AccommodationTableProps {
  options: AccommodationOption[];
  hasAccess: boolean;
}

// PriceComparison.tsx
interface PriceComparisonProps {
  options: AccommodationOption[];
  currency: string;
}
```

---

## Access Control

### Course Access Matrix

| Tier | Module 1 (Free) | Modules 2+ | Enrollments | Download Resources |
|------|----------------|------------|-------------|-------------------|
| Free | ✅ View Only | ❌ Locked | 0 | ❌ |
| Basic | ✅ Full Access | ✅ Full Access | 1 active | ✅ |
| Premium | ✅ Full Access | ✅ Full Access | Unlimited | ✅ |

### Visa Info Access Matrix

| Tier | Country List | Short-term Visa | Long-term Visa | Policy Updates |
|------|-------------|----------------|----------------|----------------|
| Free | ✅ View | ❌ Locked | ❌ Locked | ❌ |
| Basic | ✅ View | ✅ Full Details | ❌ Locked | ✅ |
| Premium | ✅ View | ✅ Full Details | ✅ Full Details | ✅ |

### Accommodation Access Matrix

| Tier | Location List | Short-term Options | Long-term Options | Affiliate Links |
|------|--------------|-------------------|------------------|-----------------|
| Free | ✅ View | ❌ Locked | ❌ Locked | ❌ |
| Basic | ✅ View | ✅ Full Details | ❌ Locked | ✅ (commission) |
| Premium | ✅ View | ✅ Full Details | ✅ Full Details | ✅ (commission) |

---

## User Flows

### Course Enrollment Flow

```
1. User lands on /courses
2. Views course catalog (filtered by tier)
3. Clicks course card
4. Views course details
   - Module 1 always accessible
   - Other modules show lock icon if no access
5. If free user + interested:
   a. Sees "Upgrade to Enroll" prompt
   b. Clicks → Redirects to /pricing
6. If Basic/Premium user:
   a. Clicks "Enroll Now"
   b. POST /api/v1/courses/[id]/enroll
   c. Redirects to first lesson
7. User watches lesson
   - Video tracks progress
   - Auto-saves every 30 seconds
   - Marks complete on 90% watched
8. User completes all lessons
   - Gets congratulations modal
   - Downloads certificate
   - Prompted to enroll in next course (if slots available)
```

### Visa Information Flow

```
1. User lands on /visa-info
2. Searches for country (e.g., "Thailand")
3. Clicks country card
4. Views visa types
   - Tourist visa (short-term) = visible if Basic+
   - Digital Nomad visa (long-term) = visible if Premium
5. If locked content:
   a. Sees glassmorphic "Premium Required" overlay
   b. Clicks "Upgrade" → /pricing
6. If accessible:
   a. Reads requirements
   b. Follows step-by-step process
   c. Downloads checklist (PDF)
   d. Clicks official embassy link
```

### Accommodation Search Flow

```
1. User lands on /accommodation
2. Filters by:
   - Country/City
   - Type (hotel, apartment, etc.)
   - Price range
   - Duration
3. Views location cards
4. Clicks location
5. Views accommodation options
   - Nightly/weekly = visible if Basic+
   - Monthly = visible if Premium
6. If locked:
   a. Sees "Upgrade for Long-term Options"
   b. Clicks → /pricing
7. If accessible:
   a. Compares prices in table
   b. Reads reviews
   c. Clicks affiliate booking link
   d. Gets redirected to Booking.com/Airbnb (with tracking)
```

---

## Technical Architecture

### Frontend Structure

```
src/
├── app/
│   ├── courses/
│   │   ├── page.tsx (catalog)
│   │   ├── [courseId]/
│   │   │   ├── page.tsx (detail)
│   │   │   └── lessons/
│   │   │       └── [lessonId]/
│   │   │           └── page.tsx (player)
│   ├── visa-info/
│   │   ├── page.tsx (hub)
│   │   └── [countryCode]/
│   │       └── page.tsx (detail)
│   └── accommodation/
│       ├── page.tsx (hub)
│       └── [locationId]/
│           └── page.tsx (detail)
│
├── features/
│   ├── courses/
│   │   ├── components/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseGrid.tsx
│   │   │   ├── ModuleAccordion.tsx
│   │   │   ├── LessonList.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   └── EnrollButton.tsx
│   │   ├── hooks/
│   │   │   ├── useCourses.ts
│   │   │   ├── useCourseDetail.ts
│   │   │   ├── useEnrollment.ts
│   │   │   └── useLessonProgress.ts
│   │   ├── lib/
│   │   │   ├── course-access.ts
│   │   │   └── progress-calculations.ts
│   │   └── types/
│   │       └── course.ts
│   │
│   ├── visa/
│   │   ├── components/
│   │   │   ├── CountryCard.tsx
│   │   │   ├── CountryGrid.tsx
│   │   │   ├── VisaTypeCard.tsx
│   │   │   ├── RequirementsChecklist.tsx
│   │   │   └── ProcessTimeline.tsx
│   │   ├── hooks/
│   │   │   ├── useCountries.ts
│   │   │   └── useVisaInfo.ts
│   │   ├── lib/
│   │   │   └── visa-access.ts
│   │   └── types/
│   │       └── visa.ts
│   │
│   └── accommodation/
│       ├── components/
│       │   ├── LocationCard.tsx
│       │   ├── LocationGrid.tsx
│       │   ├── AccommodationCard.tsx
│       │   ├── AccommodationTable.tsx
│       │   └── PriceComparison.tsx
│       ├── hooks/
│       │   ├── useLocations.ts
│       │   └── useAccommodation.ts
│       ├── lib/
│       │   └── accommodation-access.ts
│       └── types/
│           └── accommodation.ts
```

### State Management

```typescript
// Course state with SWR
const { data: courses, mutate } = useSWR('/api/v1/courses', fetcher);

// Enrollment state
const { data: enrollment } = useSWR(
  courseId ? `/api/v1/courses/${courseId}/enrollment` : null,
  fetcher
);

// Lesson progress (optimistic updates)
const updateProgress = async (lessonId: string, data: ProgressUpdate) => {
  mutate(
    `/api/v1/lessons/${lessonId}/progress`,
    optimisticUpdate(data),
    false
  );
  
  await fetch(`/api/v1/lessons/${lessonId}/progress`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  mutate(`/api/v1/lessons/${lessonId}/progress`);
};
```

### Video Streaming

```typescript
// Video player with Cloudflare Stream
interface VideoPlayerConfig {
  videoUrl: string; // Cloudflare Stream URL
  thumbnail: string;
  autoplay: boolean;
  startTime?: number; // Resume from last position
  onProgress: (time: number) => void;
  onComplete: () => void;
}

// Track progress every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      onProgress(currentTime);
    }
  }, 30000);
  
  return () => clearInterval(interval);
}, []);

// Mark complete at 90% watched
useEffect(() => {
  if (progress >= 0.9 && !completed) {
    onComplete();
    setCompleted(true);
  }
}, [progress]);
```

---

## Testing Strategy

### Unit Tests

```typescript
// Course access logic
describe('useCourseAccess', () => {
  it('allows free users to view module 1 only', () => {
    const { hasModuleAccess } = useCourseAccess('free', courseId);
    expect(hasModuleAccess(module1Id)).toBe(true);
    expect(hasModuleAccess(module2Id)).toBe(false);
  });
  
  it('allows basic users to enroll in 1 course', () => {
    const { canEnroll } = useCourseAccess('basic', courseId);
    expect(canEnroll(enrollmentCount: 0)).toBe(true);
    expect(canEnroll(enrollmentCount: 1)).toBe(false);
  });
});

// Progress calculations
describe('calculateCourseProgress', () => {
  it('calculates progress correctly', () => {
    const progress = calculateCourseProgress(
      completedLessons: 5,
      totalLessons: 10
    );
    expect(progress).toBe(50);
  });
});
```

### Integration Tests

```typescript
// Course enrollment flow
describe('Course Enrollment API', () => {
  it('enrolls user in course', async () => {
    const response = await fetch('/api/v1/courses/course-123/enroll', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.enrollment.courseId).toBe('course-123');
  });
  
  it('prevents enrolling beyond tier limit', async () => {
    // Basic user already enrolled in 1 course
    const response = await fetch('/api/v1/courses/course-456/enroll', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(response.status).toBe(403);
  });
});
```

### E2E Tests (Playwright)

```typescript
// Course viewing flow
test('free user can view module 1', async ({ page }) => {
  await page.goto('/login');
  await login(page, 'free@test.com', 'password');
  
  await page.goto('/courses/digital-marketing-101');
  await page.click('[data-testid="module-1-lesson-1"]');
  
  await expect(page.locator('video')).toBeVisible();
  await page.waitForTimeout(5000); // Watch 5 seconds
  
  // Try to access module 2
  await page.click('[data-testid="module-2"]');
  await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible();
});

// Enrollment flow
test('basic user can enroll in course', async ({ page }) => {
  await page.goto('/login');
  await login(page, 'basic@test.com', 'password');
  
  await page.goto('/courses/ai-agencies-101');
  await page.click('[data-testid="enroll-button"]');
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  await expect(page).toHaveURL(/\/courses\/ai-agencies-101\/lessons\/.*/);
});
```

---

## Performance Requirements

### Page Load Metrics

| Page | LCP Target | FID Target | CLS Target |
|------|-----------|-----------|-----------|
| Course Catalog | < 2.0s | < 100ms | < 0.1 |
| Course Detail | < 2.5s | < 100ms | < 0.1 |
| Lesson Player | < 2.0s | < 50ms | < 0.05 |
| Visa Hub | < 2.0s | < 100ms | < 0.1 |
| Accommodation Hub | < 2.0s | < 100ms | < 0.1 |

### Optimization Strategies

```typescript
// Image optimization
<Image
  src="/course-thumbnail.jpg"
  alt="Course thumbnail"
  width={400}
  height={225}
  loading="lazy"
  placeholder="blur"
/>

// Code splitting
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <VideoPlayerSkeleton />,
  ssr: false,
});

// API caching
export const revalidate = 3600; // 1 hour for course catalog

// Database query optimization
const courses = await db
  .select()
  .from(courses)
  .where(eq(courses.isPublished, true))
  .limit(20)
  .offset(page * 20);
```

---

## SEO Requirements

### Meta Tags

```typescript
// Course detail page
export async function generateMetadata({ params }): Promise<Metadata> {
  const course = await getCourse(params.courseId);
  
  return {
    title: `${course.title} | LeaveLab Courses`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.thumbnail],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
      images: [course.thumbnail],
    },
  };
}
```

### Structured Data

```typescript
// Course schema
const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.title,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'LeaveLab',
    sameAs: 'https://leavelab.com',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: `PT${course.durationHours}H`,
  },
};

// Country schema
const countrySchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAction',
  name: `Visa Information for ${country.name}`,
  description: `Comprehensive visa requirements and application process for ${country.name}`,
};
```

---

## Migration Strategy

### Phase 1: Database Setup (Week 1)
1. Create course tables
2. Create visa tables
3. Create accommodation tables
4. Set up RLS policies
5. Create indexes

### Phase 2: API Development (Week 2-3)
1. Course CRUD endpoints
2. Enrollment endpoints
3. Progress tracking endpoints
4. Visa info endpoints
5. Accommodation endpoints

### Phase 3: Frontend Components (Week 4-5)
1. Course components
2. Visa components
3. Accommodation components
4. Shared components (access gates, upgrade prompts)

### Phase 4: Pages Integration (Week 6)
1. Course catalog page
2. Course detail page
3. Lesson player page
4. Visa hub page
5. Accommodation hub page

### Phase 5: Content Population (Week 7)
1. Upload course content
2. Add visa information
3. Add accommodation data
4. Test access control

### Phase 6: Testing & Polish (Week 8)
1. E2E tests
2. Performance optimization
3. SEO implementation
4. Bug fixes

---

## Success Criteria

### Technical
- ✅ All API endpoints return < 200ms
- ✅ All pages load < 2.5s LCP
- ✅ 100% Lighthouse scores (Performance, Accessibility, SEO)
- ✅ Zero TypeScript errors
- ✅ 90%+ test coverage
- ✅ RLS policies enforce tier access correctly

### Business
- ✅ 60% of Basic users enroll in courses
- ✅ 40% course completion rate
- ✅ 25% free → Basic upgrade rate
- ✅ 80% users access visa/accommodation info
- ✅ 10% click-through on affiliate links

### User Experience
- ✅ Video playback smooth on 3G
- ✅ Progress saves automatically
- ✅ Access control clear and intuitive
- ✅ Mobile experience excellent
- ✅ Design system applied consistently

---

## Appendix

### Design System Checklist

Every component must use:
- ✅ `brand-*` colors from Tailwind config
- ✅ `.glass` or `.glass-red` for cards
- ✅ Typography scale (text-8xl to text-base)
- ✅ Font weights (font-black, font-bold)
- ✅ Animations (animate-glow, magnetic-button, card-3d)
- ✅ No custom colors/sizes outside system

### British English Dictionary

- Colour (not color)
- Organise (not organize)
- Favourite (not favorite)
- Centre (not center)
- Programme (not program - unless software)
- Enrol (not enroll)

### Accessibility Requirements

- ✅ All videos have captions
- ✅ Keyboard navigation works throughout
- ✅ Screen reader compatible
- ✅ Color contrast ratios meet WCAG AA
- ✅ Focus indicators visible
- ✅ Alt text on all images

---

**Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Status:** Ready for Implementation  
**Next Steps:** See `tasks.md` for detailed breakdown
