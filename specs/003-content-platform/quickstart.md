# Content Platform - Quick Start Guide

**Version:** 1.0.0  
**Estimated Setup Time:** 2 hours  
**Prerequisites:** Phases 1 & 2 (Auth + Subscriptions) Complete

---

## Overview

This guide will help you start building the Content Platform features (courses, visa info, accommodation) following the **global design system** (dark theme + red branding).

---

## Quick Links

- **Full Spec:** `spec.md`
- **Task Breakdown:** `tasks.md`
- **Constitution:** `../.specify/memory/constitution.md` (Principle VII)
- **Design System:** `../../DARK_THEME_COMPLETE_GUIDE.md`

---

## Prerequisites

### 1. Environment Setup
```bash
# Already installed from Phase 1
- Node.js 18+
- npm/pnpm
- Supabase CLI
- Git
```

### 2. Running Services
```bash
# Start Supabase locally
supabase start

# Start Next.js dev server
npm run dev
```

### 3. Design System Knowledge
Review these files before starting:
- `.specify/memory/constitution.md` - Principle VII
- `src/app/globals.css` - Available animations
- `tailwind.config.js` - Brand colors

---

## Phase-by-Phase Quick Start

### Phase 1: Database Setup (Week 1)

#### Day 1-2: Course Tables

```bash
# Create migration file
npx supabase migration new create_courses_tables
```

**Copy this schema:**
```sql
-- courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  preview_video_url TEXT,
  instructor_id UUID REFERENCES public.profiles(id),
  difficulty TEXT,
  duration_hours INT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- course_modules table
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

-- lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INT,
  order_index INT NOT NULL,
  content JSONB,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- course_enrollments table
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

-- lesson_progress table
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

-- Indexes
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX idx_lessons_module ON public.lessons(module_id);
CREATE INDEX idx_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);

-- RLS Policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Courses: Everyone can view published courses
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = true);

-- Modules: Access based on tier and enrollment
CREATE POLICY "Users can view modules based on subscription"
  ON public.course_modules FOR SELECT
  TO authenticated
  USING (
    -- Module 1 is always free
    is_free = true
    OR
    -- User is enrolled in this course (Basic or Premium with enrollment)
    EXISTS (
      SELECT 1 FROM public.course_enrollments ce
      WHERE ce.user_id = auth.uid()
        AND ce.course_id = course_modules.course_id
    )
  );

-- Lessons: Access based on module access
CREATE POLICY "Users can view lessons based on module access"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.course_modules cm
      WHERE cm.id = lessons.module_id
        AND (
          cm.is_free = true
          OR
          EXISTS (
            SELECT 1 FROM public.course_enrollments ce
            WHERE ce.user_id = auth.uid()
              AND ce.course_id = lessons.course_id
          )
        )
    )
  );

-- Enrollments: Users can view their own
CREATE POLICY "Users can view their own enrollments"
  ON public.course_enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Enrollments: Users can create with tier check (enforced in API)
CREATE POLICY "Users can enroll in courses"
  ON public.course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Progress: Users can manage their own progress
CREATE POLICY "Users can manage their own progress"
  ON public.lesson_progress FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

**Apply migration:**
```bash
supabase db push
```

#### Day 3-4: Visa & Accommodation Tables

```bash
# Create migration
npx supabase migration new create_visa_accommodation_tables
```

**Apply similar patterns for visa and accommodation tables** (see `spec.md` for full schema).

---

### Phase 2: Course API (Week 2-3)

#### Quick Setup

1. **Create API directory:**
```bash
mkdir -p src/app/api/v1/courses
```

2. **Create course catalog endpoint:**
```typescript
// src/app/api/v1/courses/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Get query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Query courses
    let query = supabase
      .from('courses')
      .select('*')
      .eq('is_published', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: courses, error } = await query;

    if (error) throw error;

    // Get user enrollments if logged in
    let enrollments = [];
    if (user) {
      const { data: enrollmentData } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('user_id', user.id);
      
      enrollments = enrollmentData?.map(e => e.course_id) || [];
    }

    // Get user's tier and calculate available enrollments
    let availableEnrollments = 0;
    if (user) {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_tiers(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      const tierName = subscription?.subscription_tiers?.name || 'free';
      const enrollmentCount = enrollments.length;

      if (tierName === 'basic') {
        availableEnrollments = Math.max(0, 1 - enrollmentCount);
      } else if (tierName === 'premium') {
        availableEnrollments = -1; // Unlimited
      }
    }

    return successResponse({
      courses,
      userEnrollments: enrollments,
      availableEnrollments,
    });

  } catch (error) {
    console.error('[GET /api/v1/courses] Error:', error);
    return errorResponse('Failed to fetch courses', 500);
  }
}
```

3. **Test the endpoint:**
```bash
curl http://localhost:3001/api/v1/courses
```

---

### Phase 4: Course Components (Week 4-5)

#### Quick Component Creation

1. **Create features directory:**
```bash
mkdir -p src/features/courses/{components,hooks,lib,types}
```

2. **Create CourseCard component:**
```typescript
// src/features/courses/components/CourseCard.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Book, Clock } from 'lucide-react';
import { ProgressRing } from './ProgressRing';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail_url: string;
    duration_hours: number;
    difficulty: string;
  };
  isEnrolled: boolean;
  progress?: number;
  hasAccess: boolean;
}

export function CourseCard({ course, isEnrolled, progress, hasAccess }: CourseCardProps) {
  return (
    <Card className="glass border-white/10 overflow-hidden card-3d transition-all duration-300 group">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
      
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnail_url} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Progress Ring (if enrolled) */}
        {isEnrolled && progress !== undefined && (
          <div className="absolute top-4 right-4">
            <ProgressRing progress={progress} size="sm" />
          </div>
        )}
        
        {/* Difficulty Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge className="glass-red text-brand-red-200 border-brand-red/30">
            {course.difficulty}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-bold text-white line-clamp-2">
          {course.title}
        </CardTitle>
        <CardDescription className="text-gray-400 line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration_hours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Book className="w-4 h-4" />
            <span>15 lessons</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/courses/${course.slug}`}>
          <Button 
            className={
              isEnrolled
                ? "w-full glass border-white/20 text-white hover:glass-red magnetic-button"
                : "w-full bg-brand-red hover:bg-brand-red-600 text-white magnetic-button font-bold"
            }
          >
            {isEnrolled ? 'Continue Learning' : 'View Course'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
```

**Key Design System Elements:**
- ✅ `.glass` - Frosted glass effect
- ✅ `.card-3d` - 3D tilt on hover
- ✅ `.magnetic-button` - Scale animation
- ✅ `brand-red` - Primary action color
- ✅ `text-white` / `text-gray-400` - Text hierarchy
- ✅ No custom colors/sizes outside system

---

### Phase 6: Pages (Week 6)

#### Quick Page Creation

1. **Create course catalog page:**
```bash
mkdir -p src/app/courses
```

```typescript
// src/app/courses/page.tsx
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { CourseGrid } from '@/features/courses/components/CourseGrid';
import { CourseFilters } from '@/features/courses/components/CourseFilters';

export const metadata: Metadata = {
  title: 'Courses | LeaveLab',
  description: 'Master income-generating skills for your digital nomad journey',
};

export default function CoursesPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <Badge className="glass-red text-brand-red-200 border-brand-red/30 px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" />
            Premium Courses
          </Badge>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black">
            Master
            <br />
            <span className="bg-gradient-to-r from-brand-red via-brand-red-400 to-brand-red-600 bg-clip-text text-transparent">
              Income-Generating
            </span>
            <br />
            Skills
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Learn digital marketing, AI agencies, and Amazon FBA from experts.
            Start with module 1 free, upgrade for full access.
          </p>
        </div>

        {/* Filters */}
        <CourseFilters />

        {/* Course Grid */}
        <CourseGrid />
      </div>
    </div>
  );
}
```

**Design System Applied:**
- ✅ Bold headlines (text-8xl font-black)
- ✅ Gradient text effects
- ✅ Glass badges
- ✅ Brand colors throughout
- ✅ Consistent spacing

---

## Design System Quick Reference

### Colors to Use
```typescript
// Backgrounds
'bg-brand-dark-950'      // Page backgrounds
'bg-brand-dark-900'      // Card backgrounds

// Primary Actions
'bg-brand-red'           // Buttons, CTAs
'hover:bg-brand-red-600' // Hover states
'text-brand-red'         // Links

// Text
'text-white'             // Headlines
'text-gray-300'          // Body
'text-gray-400'          // Secondary
'text-gray-500'          // Muted

// Glass Effects
'glass'                  // Frosted glass
'glass-red'              // Red tint glass
'border-white/10'        // Subtle borders
```

### Typography
```typescript
// Headlines
'text-8xl font-black'                  // Hero
'text-6xl font-black'                  // Page titles
'text-4xl font-bold'                   // Section titles
'text-2xl font-bold'                   // Card titles

// Gradients
'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
```

### Effects
```typescript
'card-3d'              // 3D tilt on hover
'magnetic-button'      // Scale on hover
'animate-glow'         // Red glow pulse
'animate-pulse-scale'  // Pulse animation
'animate-fadeIn'       // Fade in
```

### Buttons
```typescript
// Primary
'bg-brand-red hover:bg-brand-red-600 text-white magnetic-button h-12 font-bold'

// Secondary
'glass border-white/20 text-white hover:glass-red magnetic-button'

// Outline
'glass border-brand-red/50 text-brand-red hover:bg-brand-red/10'
```

### Cards
```typescript
// Base card
'glass border-white/10 overflow-hidden'

// With 3D effect
'glass border-white/10 overflow-hidden card-3d'

// With overlay
<Card className="glass border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
  <div className="relative z-10">
    {/* Content */}
  </div>
</Card>
```

---

## Testing Quick Start

### Unit Tests
```typescript
// tests/unit/components/CourseCard.test.tsx
import { render, screen } from '@testing-library/react';
import { CourseCard } from '@/features/courses/components/CourseCard';

describe('CourseCard', () => {
  it('shows progress ring for enrolled courses', () => {
    render(
      <CourseCard
        course={mockCourse}
        isEnrolled={true}
        progress={50}
        hasAccess={true}
      />
    );
    
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
```

### E2E Tests
```typescript
// tests/e2e/courses/enrollment.spec.ts
import { test, expect } from '@playwright/test';

test('basic user can enroll in course', async ({ page }) => {
  await page.goto('/login');
  await login(page, 'basic@test.com', 'password');
  
  await page.goto('/courses');
  await page.click('[data-course-id="course-1"] button');
  
  await expect(page).toHaveURL(/\/courses\/.*\/lessons\/.*/);
  await expect(page.locator('video')).toBeVisible();
});
```

---

## Common Patterns

### Fetching Data with SWR
```typescript
// src/features/courses/hooks/useCourses.ts
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useCourses(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  
  const { data, error, isLoading } = useSWR(
    `/api/v1/courses?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  return {
    courses: data?.courses || [],
    enrollments: data?.userEnrollments || [],
    availableEnrollments: data?.availableEnrollments || 0,
    isLoading,
    error,
  };
}
```

### Access Control Helper
```typescript
// src/features/courses/lib/course-access.ts
export function canEnrollInCourse(
  tierName: string,
  enrollmentCount: number
): boolean {
  if (tierName === 'premium') return true;
  if (tierName === 'basic') return enrollmentCount < 1;
  return false;
}

export function hasModuleAccess(
  moduleIsFree: boolean,
  isEnrolled: boolean
): boolean {
  return moduleIsFree || isEnrolled;
}
```

---

## Common Issues & Solutions

### Issue: Pricing badges cut off
**Solution:** Add `pt-6` to parent container, remove `overflow-hidden` from card.

### Issue: Custom colors not in design system
**Solution:** Use `brand-*` colors from `tailwind.config.js` only.

### Issue: Video not streaming smoothly
**Solution:** Enable adaptive bitrate in Cloudflare Stream settings.

### Issue: RLS policy blocking access
**Solution:** Check Supabase logs, verify tier and enrollment in database.

### Issue: Progress not saving
**Solution:** Verify `lesson_progress` table has correct RLS policy for INSERT/UPDATE.

---

## Next Steps

1. **Start with Phase 1** - Database setup
2. **Test RLS policies** - Ensure tier access works
3. **Build Course API** - Start with catalog endpoint
4. **Create components** - Follow design system strictly
5. **Integrate pages** - Use global styling
6. **Add content** - Upload videos, write descriptions
7. **Test thoroughly** - E2E tests for critical flows
8. **Launch!** 🚀

---

## Getting Help

### Resources
- **Full Spec:** `spec.md` - Complete technical details
- **Tasks:** `tasks.md` - Detailed task breakdown
- **Constitution:** `../.specify/memory/constitution.md` - Principle VII
- **Design Guide:** `../../DARK_THEME_COMPLETE_GUIDE.md`

### Support
- Review constitution before starting any task
- Follow design system strictly (no custom styles)
- Test tier access thoroughly
- Ask questions early, iterate quickly

---

**Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Status:** Ready to Use  
**Estimated Time to First Working Feature:** 2-3 days
