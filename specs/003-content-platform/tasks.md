# Content Platform - Task Breakdown

**Spec Version:** 1.0.0  
**Date:** October 17, 2025  
**Total Estimated Time:** 8 weeks (320 hours)

---

## Task Organization

Tasks are organized into **8 phases** that can be worked on by multiple agents simultaneously where dependencies allow. Each task includes:
- **Priority:** P0 (critical), P1 (high), P2 (medium), P3 (low)
- **Estimated Time:** In hours
- **Dependencies:** What must be complete first
- **Agent Assignment:** Which agent type should handle it

---

## Phase 1: Database & Infrastructure Setup
**Duration:** Week 1 (40 hours)  
**Dependencies:** None  
**Can Start:** Immediately

### Task 1.1: Create Course Database Schema
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Database Agent  
**Dependencies:** None

**Subtasks:**
1. Create `courses` table with fields
2. Create `course_modules` table with `is_free` flag
3. Create `lessons` table with video URLs
4. Create `course_enrollments` table
5. Create `lesson_progress` table
6. Add indexes for performance
7. Create RLS policies for tier-based access
8. Test RLS policies with different tiers

**Files to Create:**
- `supabase/migrations/20251018000001_create_courses_tables.sql`

**Acceptance Criteria:**
- [ ] All tables created
- [ ] RLS policies enforce: Free = module 1 only, Basic = 1 enrollment, Premium = unlimited
- [ ] Indexes improve query performance by >50%
- [ ] Foreign keys prevent orphaned data

---

### Task 1.2: Create Visa Information Schema
**Priority:** P0  
**Time:** 6 hours  
**Agent:** Database Agent  
**Dependencies:** None

**Subtasks:**
1. Create `countries` table
2. Create `visa_info` table with tier requirements
3. Add JSONB fields for requirements/steps
4. Create indexes
5. Create RLS policies for tier-based access
6. Seed with 10 sample countries

**Files to Create:**
- `supabase/migrations/20251018000002_create_visa_tables.sql`
- `supabase/migrations/20251018000003_seed_visa_data.sql`

**Acceptance Criteria:**
- [ ] Tables support JSONB for flexible content
- [ ] RLS enforces: Free = list only, Basic = short-term, Premium = all
- [ ] Sample data includes UK, Spain, Thailand, Portugal, Mexico

---

### Task 1.3: Create Accommodation Schema
**Priority:** P0  
**Time:** 6 hours  
**Agent:** Database Agent  
**Dependencies:** Task 1.2 (uses countries table)

**Subtasks:**
1. Create `locations` table
2. Create `accommodation_options` table
3. Add fields for amenities (JSONB)
4. Create indexes
5. Create RLS policies
6. Seed with 5 sample locations

**Files to Create:**
- `supabase/migrations/20251018000004_create_accommodation_tables.sql`
- `supabase/migrations/20251018000005_seed_accommodation_data.sql`

**Acceptance Criteria:**
- [ ] Supports multiple accommodation types
- [ ] Affiliate links stored securely
- [ ] RLS enforces tier access
- [ ] Sample data for Lisbon, Barcelona, Chiang Mai, Bali, Medellín

---

### Task 1.4: Video Storage Setup
**Priority:** P1  
**Time:** 8 hours  
**Agent:** Infrastructure Agent  
**Dependencies:** None

**Subtasks:**
1. Set up Cloudflare Stream account (or Vimeo)
2. Configure video upload workflow
3. Create video encoding presets (480p, 720p, 1080p)
4. Set up CDN for thumbnails
5. Test video streaming on 3G connection
6. Document upload process

**Files to Create:**
- `docs/VIDEO_UPLOAD_GUIDE.md`
- `scripts/upload-video.ts`

**Acceptance Criteria:**
- [ ] Videos stream smoothly on 3G (adaptive bitrate)
- [ ] Thumbnails load <500ms
- [ ] Upload process documented
- [ ] Costs estimated at <$0.01/hour watched

---

### Task 1.5: RLS Testing Suite
**Priority:** P1  
**Time:** 12 hours  
**Agent:** Testing Agent  
**Dependencies:** Tasks 1.1, 1.2, 1.3

**Subtasks:**
1. Create test users (free, basic, premium)
2. Write RLS test cases for courses
3. Write RLS test cases for visa info
4. Write RLS test cases for accommodation
5. Automate RLS tests in CI/CD
6. Document test results

**Files to Create:**
- `tests/integration/rls/courses.test.ts`
- `tests/integration/rls/visa.test.ts`
- `tests/integration/rls/accommodation.test.ts`

**Acceptance Criteria:**
- [ ] 100% of RLS policies tested
- [ ] Tests run in CI/CD
- [ ] Edge cases covered (expired subscriptions, etc.)
- [ ] Documentation shows expected behavior

---

## Phase 2: Course API Development
**Duration:** Week 2-3 (80 hours)  
**Dependencies:** Phase 1  
**Can Start:** After Task 1.1

### Task 2.1: Course Catalog API
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 1.1

**Subtasks:**
1. Create `GET /api/v1/courses` endpoint
2. Add filtering (category, search)
3. Include user enrollment data
4. Calculate available enrollments based on tier
5. Add pagination
6. Cache responses (1 hour)
7. Write API tests
8. Document endpoint

**Files to Create:**
- `src/app/api/v1/courses/route.ts`
- `tests/integration/api/courses.test.ts`

**Acceptance Criteria:**
- [ ] Returns courses filtered by tier
- [ ] Includes enrollment status
- [ ] Responds in <200ms
- [ ] Pagination works correctly
- [ ] OpenAPI docs generated

---

### Task 2.2: Course Detail API
**Priority:** P0  
**Time:** 10 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 1.1

**Subtasks:**
1. Create `GET /api/v1/courses/[courseId]` endpoint
2. Include modules and lessons
3. Mark locked content based on tier
4. Calculate progress if enrolled
5. Add caching
6. Write tests
7. Document endpoint

**Files to Create:**
- `src/app/api/v1/courses/[courseId]/route.ts`

**Acceptance Criteria:**
- [ ] Returns full course structure
- [ ] Locks modules 2+ for free users
- [ ] Shows progress for enrolled users
- [ ] Responds in <200ms

---

### Task 2.3: Enrollment API
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 1.1

**Subtasks:**
1. Create `POST /api/v1/courses/[courseId]/enroll` endpoint
2. Check tier enrollment limits
3. Create enrollment record
4. Send n8n webhook notification
5. Return enrollment data
6. Handle errors (already enrolled, limit reached)
7. Write tests
8. Document endpoint

**Files to Create:**
- `src/app/api/v1/courses/[courseId]/enroll/route.ts`

**Acceptance Criteria:**
- [ ] Enforces enrollment limits by tier
- [ ] Prevents duplicate enrollments
- [ ] Sends n8n webhook
- [ ] Returns clear error messages

---

### Task 2.4: Lesson & Progress API
**Priority:** P0  
**Time:** 16 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 1.1

**Subtasks:**
1. Create `GET /api/v1/courses/[courseId]/lessons/[lessonId]` endpoint
2. Check access (enrollment + module unlock)
3. Return video URL (signed if needed)
4. Include prev/next lesson navigation
5. Create `POST /api/v1/lessons/[lessonId]/progress` endpoint
6. Update progress with optimistic locking
7. Recalculate course progress
8. Send completion webhook
9. Write tests
10. Document endpoints

**Files to Create:**
- `src/app/api/v1/courses/[courseId]/lessons/[lessonId]/route.ts`
- `src/app/api/v1/lessons/[lessonId]/progress/route.ts`

**Acceptance Criteria:**
- [ ] Returns lesson only if user has access
- [ ] Progress saves without race conditions
- [ ] Course progress updates correctly
- [ ] Completion triggers webhook

---

### Task 2.5: Course Search & Filtering
**Priority:** P1  
**Time:** 10 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 2.1

**Subtasks:**
1. Add full-text search on course titles/descriptions
2. Add category filtering
3. Add difficulty filtering
4. Add "enrolled" filter
5. Add "completed" filter
6. Optimize database queries
7. Write tests
8. Document filters

**Files to Modify:**
- `src/app/api/v1/courses/route.ts`

**Acceptance Criteria:**
- [ ] Search works across title + description
- [ ] Filters can be combined
- [ ] Still responds in <200ms
- [ ] Query plan shows index usage

---

### Task 2.6: Course Analytics API
**Priority:** P2  
**Time:** 10 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 2.4

**Subtasks:**
1. Create `GET /api/v1/courses/[courseId]/analytics` endpoint
2. Calculate enrollment count
3. Calculate completion rate
4. Calculate average time to complete
5. Calculate per-lesson drop-off rates
6. Cache heavily (1 day)
7. Write tests

**Files to Create:**
- `src/app/api/v1/courses/[courseId]/analytics/route.ts`

**Acceptance Criteria:**
- [ ] Returns useful analytics
- [ ] Only accessible by admins
- [ ] Cached for performance
- [ ] Helps identify problem lessons

---

### Task 2.7: Certificate Generation API
**Priority:** P2  
**Time:** 10 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 2.4

**Subtasks:**
1. Create `POST /api/v1/courses/[courseId]/certificate` endpoint
2. Check 100% completion
3. Generate PDF certificate with user name
4. Store in Supabase Storage
5. Return download URL
6. Send completion webhook
7. Write tests

**Files to Create:**
- `src/app/api/v1/courses/[courseId]/certificate/route.ts`
- `lib/certificate-generator.ts`

**Acceptance Criteria:**
- [ ] Only generates if 100% complete
- [ ] PDF looks professional
- [ ] Includes course name, user name, date
- [ ] Stored securely

---

## Phase 3: Visa & Accommodation APIs
**Duration:** Week 3 (40 hours)  
**Dependencies:** Phase 1 (Tasks 1.2, 1.3)  
**Can Start:** After Phase 1

### Task 3.1: Visa Information API
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 1.2

**Subtasks:**
1. Create `GET /api/v1/visa-info/countries` endpoint
2. Add region filtering
3. Add search by country name
4. Create `GET /api/v1/visa-info/[countryCode]` endpoint
5. Filter visa types by user tier
6. Add caching (1 day)
7. Write tests
8. Document endpoints

**Files to Create:**
- `src/app/api/v1/visa-info/countries/route.ts`
- `src/app/api/v1/visa-info/[countryCode]/route.ts`

**Acceptance Criteria:**
- [ ] Free users see country list only
- [ ] Basic users see short-term visa details
- [ ] Premium users see all visa details
- [ ] Responds in <200ms

---

### Task 3.2: Accommodation API
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Backend API Agent  
**Dependencies:** Task 1.3

**Subtasks:**
1. Create `GET /api/v1/accommodation/locations` endpoint
2. Add country filtering
3. Add search by city name
4. Create `GET /api/v1/accommodation/[locationId]` endpoint
5. Filter options by user tier
6. Track affiliate clicks
7. Write tests
8. Document endpoints

**Files to Create:**
- `src/app/api/v1/accommodation/locations/route.ts`
- `src/app/api/v1/accommodation/[locationId]/route.ts`

**Acceptance Criteria:**
- [ ] Free users see location list only
- [ ] Basic users see short-term options
- [ ] Premium users see all options
- [ ] Affiliate clicks tracked

---

### Task 3.3: Content Management API
**Priority:** P1  
**Time:** 16 hours  
**Agent:** Backend API Agent  
**Dependencies:** Tasks 3.1, 3.2

**Subtasks:**
1. Create admin endpoints for course CRUD
2. Create admin endpoints for visa info CRUD
3. Create admin endpoints for accommodation CRUD
4. Add image upload for thumbnails
5. Add validation
6. Require admin role
7. Write tests
8. Document admin API

**Files to Create:**
- `src/app/api/v1/admin/courses/route.ts`
- `src/app/api/v1/admin/visa-info/route.ts`
- `src/app/api/v1/admin/accommodation/route.ts`

**Acceptance Criteria:**
- [ ] Only admins can access
- [ ] Full CRUD operations
- [ ] Input validation prevents bad data
- [ ] Documented for content team

---

## Phase 4: Course Frontend Components
**Duration:** Week 4-5 (80 hours)  
**Dependencies:** Phase 2  
**Can Start:** After Task 2.1

### Task 4.1: Course Card Component
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 2.1

**Subtasks:**
1. Create `CourseCard.tsx` component
2. Use global design system (.glass, brand colors)
3. Show course thumbnail, title, description
4. Show progress ring if enrolled
5. Show tier badge (Free preview, Basic, Premium)
6. Add 3D card hover effect
7. Add magnetic button effect
8. Make responsive (mobile-first)
9. Write Storybook stories
10. Write component tests

**Files to Create:**
- `src/features/courses/components/CourseCard.tsx`
- `src/features/courses/components/CourseCard.stories.tsx`
- `tests/unit/components/CourseCard.test.tsx`

**Acceptance Criteria:**
- [ ] Uses `.glass`, `.card-3d`, `.magnetic-button`
- [ ] Uses `brand-red` for CTAs
- [ ] Shows correct tier badge
- [ ] Progress ring accurate
- [ ] Mobile-friendly tap targets

---

### Task 4.2: Course Grid & Filtering
**Priority:** P0  
**Time:** 10 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 4.1

**Subtasks:**
1. Create `CourseGrid.tsx` component
2. Create `CourseFilters.tsx` component (glassmorphic)
3. Implement category filter
4. Implement search
5. Implement "My Courses" filter
6. Add loading skeleton states
7. Add empty states
8. Make responsive grid (3 col → 2 → 1)
9. Write tests

**Files to Create:**
- `src/features/courses/components/CourseGrid.tsx`
- `src/features/courses/components/CourseFilters.tsx`

**Acceptance Criteria:**
- [ ] Filters work without page reload
- [ ] Loading states smooth
- [ ] Empty state helpful
- [ ] Grid responsive

---

### Task 4.3: Module Accordion Component
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 2.2

**Subtasks:**
1. Create `ModuleAccordion.tsx` component
2. Show module title, lesson count, duration
3. Expand/collapse modules
4. Show lock icons on inaccessible modules
5. Show checkmarks on completed lessons
6. Show current lesson indicator
7. Add smooth animations
8. Make keyboard accessible
9. Write tests

**Files to Create:**
- `src/features/courses/components/ModuleAccordion.tsx`

**Acceptance Criteria:**
- [ ] Uses global glass styling
- [ ] Lock icons clear
- [ ] Animations smooth (60fps)
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

### Task 4.4: Video Player Component
**Priority:** P0  
**Time:** 16 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 2.4

**Subtasks:**
1. Create `VideoPlayer.tsx` component
2. Integrate with Cloudflare Stream / Vimeo
3. Add custom controls (dark theme)
4. Add play/pause, seek, volume controls
5. Add playback speed selector
6. Add quality selector
7. Add fullscreen toggle
8. Track watch time every 30s
9. Mark complete at 90% watched
10. Add keyboard shortcuts (space = play/pause, etc.)
11. Make mobile-friendly
12. Write tests

**Files to Create:**
- `src/features/courses/components/VideoPlayer.tsx`
- `src/features/courses/hooks/useVideoProgress.ts`

**Acceptance Criteria:**
- [ ] Streams smoothly on 3G
- [ ] Controls intuitive
- [ ] Progress saves automatically
- [ ] Completes at 90% watched
- [ ] Keyboard shortcuts work
- [ ] Mobile controls thumb-friendly

---

### Task 4.5: Progress Tracking Components
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 2.4

**Subtasks:**
1. Create `ProgressRing.tsx` component
2. Create `ProgressBar.tsx` component
3. Add smooth animations
4. Support different sizes (sm, md, lg)
5. Show percentage text
6. Use brand-red color
7. Write tests

**Files to Create:**
- `src/features/courses/components/ProgressRing.tsx`
- `src/features/courses/components/ProgressBar.tsx`

**Acceptance Criteria:**
- [ ] Rings animate smoothly
- [ ] Brand colors used
- [ ] Multiple sizes supported
- [ ] Accessible (ARIA labels)

---

### Task 4.6: Enrollment Button Component
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 2.3

**Subtasks:**
1. Create `EnrollButton.tsx` component
2. Show different states (Enroll, Continue, Locked)
3. Handle enrollment API call
4. Show loading state
5. Show success/error messages
6. Redirect to lesson on success
7. Use magnetic-button effect
8. Write tests

**Files to Create:**
- `src/features/courses/components/EnrollButton.tsx`
- `src/features/courses/hooks/useEnrollment.ts`

**Acceptance Criteria:**
- [ ] States clear and intuitive
- [ ] Loading state shows spinner
- [ ] Success redirects to first lesson
- [ ] Errors show helpful messages
- [ ] Uses brand-red button styling

---

### Task 4.7: Course Access Gate
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 2.2

**Subtasks:**
1. Create `CourseAccessGate.tsx` component
2. Show glassmorphic overlay on locked content
3. Show tier requirement badge
4. Show "Upgrade" CTA
5. List locked features
6. Add blur effect on locked content
7. Make dismissible (but content still locked)
8. Write tests

**Files to Create:**
- `src/features/courses/components/CourseAccessGate.tsx`

**Acceptance Criteria:**
- [ ] Uses glass-red overlay
- [ ] Clear tier requirement
- [ ] Upgrade CTA prominent (brand-red)
- [ ] Blur effect subtle but clear
- [ ] Mobile-friendly

---

### Task 4.8: Lesson Notes Component
**Priority:** P2  
**Time:** 10 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 2.4

**Subtasks:**
1. Create `LessonNotes.tsx` component
2. Add markdown editor
3. Auto-save every 10 seconds
4. Show save indicator
5. Make collapsible
6. Dark theme styling
7. Write tests

**Files to Create:**
- `src/features/courses/components/LessonNotes.tsx`

**Acceptance Criteria:**
- [ ] Auto-saves without user action
- [ ] Save indicator clear
- [ ] Markdown preview works
- [ ] Dark theme consistent

---

## Phase 5: Visa & Accommodation Frontend
**Duration:** Week 5 (40 hours)  
**Dependencies:** Phase 3  
**Can Start:** After Task 3.1

### Task 5.1: Country Card Component
**Priority:** P0  
**Time:** 6 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 3.1

**Subtasks:**
1. Create `CountryCard.tsx` component
2. Show flag emoji
3. Show country name
4. Show visa type count
5. Show lock icon if no access
6. Use .glass and .card-3d
7. Write tests

**Files to Create:**
- `src/features/visa/components/CountryCard.tsx`

**Acceptance Criteria:**
- [ ] Flag displays correctly
- [ ] Lock icon clear
- [ ] 3D hover effect
- [ ] Mobile tap-friendly

---

### Task 5.2: Visa Type Card Component
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 3.1

**Subtasks:**
1. Create `VisaTypeCard.tsx` component
2. Show visa type, duration, cost
3. Show difficulty badge
4. Show lock overlay if no access
5. Expandable for full details
6. Use glass styling
7. Write tests

**Files to Create:**
- `src/features/visa/components/VisaTypeCard.tsx`

**Acceptance Criteria:**
- [ ] Difficulty badges color-coded
- [ ] Lock overlay glassmorphic
- [ ] Expansion smooth
- [ ] Details readable

---

### Task 5.3: Requirements Checklist Component
**Priority:** P0  
**Time:** 6 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 3.1

**Subtasks:**
1. Create `RequirementsChecklist.tsx` component
2. Show checkbox list
3. Allow users to check off items
4. Save state to localStorage
5. Add print functionality
6. Use brand colors
7. Write tests

**Files to Create:**
- `src/features/visa/components/RequirementsChecklist.tsx`

**Acceptance Criteria:**
- [ ] Checkboxes work smoothly
- [ ] State persists in localStorage
- [ ] Print view clean
- [ ] Mobile-friendly

---

### Task 5.4: Process Timeline Component
**Priority:** P1  
**Time:** 8 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 3.1

**Subtasks:**
1. Create `ProcessTimeline.tsx` component
2. Show step-by-step visual timeline
3. Use vertical line with dots
4. Add icons for each step
5. Make expandable
6. Use brand-red for active steps
7. Write tests

**Files to Create:**
- `src/features/visa/components/ProcessTimeline.tsx`

**Acceptance Criteria:**
- [ ] Timeline visually clear
- [ ] Steps numbered
- [ ] Icons helpful
- [ ] Mobile-friendly

---

### Task 5.5: Location Card Component
**Priority:** P0  
**Time:** 6 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 3.2

**Subtasks:**
1. Create `LocationCard.tsx` component
2. Show location image
3. Show city, country
4. Show option count
5. Show lock icon if no access
6. Use .glass and .card-3d
7. Write tests

**Files to Create:**
- `src/features/accommodation/components/LocationCard.tsx`

**Acceptance Criteria:**
- [ ] Image loads lazy
- [ ] 3D hover effect
- [ ] Lock icon clear
- [ ] Tap-friendly

---

### Task 5.6: Accommodation Table Component
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 3.2

**Subtasks:**
1. Create `AccommodationTable.tsx` component
2. Show comparison table (type, price, duration)
3. Add sorting by price
4. Show lock rows if no access
5. Add affiliate link buttons
6. Use glass table styling
7. Make responsive (cards on mobile)
8. Write tests

**Files to Create:**
- `src/features/accommodation/components/AccommodationTable.tsx`

**Acceptance Criteria:**
- [ ] Table sortable
- [ ] Lock rows glassmorphic
- [ ] Affiliate buttons tracked
- [ ] Mobile cards readable

---

### Task 5.7: Price Comparison Component
**Priority:** P1  
**Time:** 6 hours  
**Agent:** Frontend Component Agent  
**Dependencies:** Task 3.2

**Subtasks:**
1. Create `PriceComparison.tsx` component
2. Show bar chart comparing prices
3. Convert to user's currency
4. Highlight best value
5. Use brand colors
6. Make interactive
7. Write tests

**Files to Create:**
- `src/features/accommodation/components/PriceComparison.tsx`

**Acceptance Criteria:**
- [ ] Chart clear and intuitive
- [ ] Currency conversion accurate
- [ ] Best value highlighted (brand-red)
- [ ] Responsive

---

## Phase 6: Page Integration
**Duration:** Week 6 (40 hours)  
**Dependencies:** Phases 4, 5  
**Can Start:** After Phase 4

### Task 6.1: Course Catalog Page
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Full-Stack Page Agent  
**Dependencies:** Task 4.2

**Subtasks:**
1. Create `/courses/page.tsx`
2. Integrate CourseGrid and CourseFilters
3. Add SEO metadata
4. Add hero section (glassmorphic)
5. Add category tabs
6. Use server components where possible
7. Add OpenGraph images
8. Test on mobile
9. Test on desktop
10. Check Lighthouse score (>90)

**Files to Create:**
- `src/app/courses/page.tsx`

**Acceptance Criteria:**
- [ ] Bold headline: "Master Income-Generating Skills"
- [ ] Filters work smoothly
- [ ] Grid responsive
- [ ] LCP < 2.0s
- [ ] Global design system applied

---

### Task 6.2: Course Detail Page
**Priority:** P0  
**Time:** 10 hours  
**Agent:** Full-Stack Page Agent  
**Dependencies:** Tasks 4.3, 4.6

**Subtasks:**
1. Create `/courses/[courseId]/page.tsx`
2. Add hero with video preview
3. Integrate ModuleAccordion
4. Add stats cards (students, rating, duration)
5. Add testimonials section
6. Add EnrollButton
7. Show CourseAccessGate for locked modules
8. Add SEO metadata
9. Add structured data (Course schema)
10. Test access control
11. Check Lighthouse score

**Files to Create:**
- `src/app/courses/[courseId]/page.tsx`

**Acceptance Criteria:**
- [ ] Hero section impressive
- [ ] Modules expandable
- [ ] Access control works
- [ ] SEO optimized
- [ ] LCP < 2.5s

---

### Task 6.3: Lesson Player Page
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Full-Stack Page Agent  
**Dependencies:** Task 4.4

**Subtasks:**
1. Create `/courses/[courseId]/lessons/[lessonId]/page.tsx`
2. Integrate VideoPlayer
3. Add lesson navigation sidebar
4. Add LessonNotes component
5. Add next/prev buttons
6. Add progress indicator
7. Handle access control
8. Auto-redirect if no access
9. Add keyboard shortcuts (← prev, → next)
10. Test on mobile
11. Check performance

**Files to Create:**
- `src/app/courses/[courseId]/lessons/[lessonId]/page.tsx`

**Acceptance Criteria:**
- [ ] Video plays smoothly
- [ ] Progress saves automatically
- [ ] Navigation intuitive
- [ ] Keyboard shortcuts work
- [ ] Mobile-friendly

---

### Task 6.4: Visa Hub Page
**Priority:** P0  
**Time:** 6 hours  
**Agent:** Full-Stack Page Agent  
**Dependencies:** Task 5.1

**Subtasks:**
1. Create `/visa-info/page.tsx`
2. Add hero section
3. Add search bar (glassmorphic)
4. Integrate CountryGrid
5. Add region filter tabs
6. Add SEO metadata
7. Add structured data
8. Test mobile
9. Check Lighthouse

**Files to Create:**
- `src/app/visa-info/page.tsx`

**Acceptance Criteria:**
- [ ] Bold headline: "Navigate Visa Requirements"
- [ ] Search works smoothly
- [ ] Region filters work
- [ ] LCP < 2.0s
- [ ] Global design system

---

### Task 6.5: Visa Detail Page
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Full-Stack Page Agent  
**Dependencies:** Tasks 5.2, 5.3, 5.4

**Subtasks:**
1. Create `/visa-info/[countryCode]/page.tsx`
2. Add hero with flag/image
3. Integrate VisaTypeCard
4. Integrate RequirementsChecklist
5. Integrate ProcessTimeline
6. Show access gates for locked content
7. Add SEO metadata
8. Test tier access
9. Check Lighthouse

**Files to Create:**
- `src/app/visa-info/[countryCode]/page.tsx`

**Acceptance Criteria:**
- [ ] Hero impressive
- [ ] Visa types clear
- [ ] Access control works
- [ ] SEO optimized
- [ ] Mobile-friendly

---

### Task 6.6: Accommodation Hub Page
**Priority:** P0  
**Time:** 6 hours  
**Agent:** Full-Stack Page Agent  
**Dependencies:** Task 5.5

**Subtasks:**
1. Create `/accommodation/page.tsx`
2. Add hero section
3. Add search bar (glassmorphic)
4. Integrate LocationGrid
5. Add type filter tabs
6. Add SEO metadata
7. Test mobile
8. Check Lighthouse

**Files to Create:**
- `src/app/accommodation/page.tsx`

**Acceptance Criteria:**
- [ ] Bold headline: "Find Your Perfect Base"
- [ ] Search works
- [ ] Filters work
- [ ] LCP < 2.0s
- [ ] Global design system

---

### Task 6.7: Accommodation Detail Page
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Full-Stack Page Agent  
**Dependencies:** Tasks 5.6, 5.7

**Subtasks:**
1. Create `/accommodation/[locationId]/page.tsx`
2. Add hero with location image
3. Integrate AccommodationTable
4. Integrate PriceComparison
5. Add map integration (optional)
6. Show access gates for locked options
7. Track affiliate clicks
8. Add SEO metadata
9. Test tier access
10. Check Lighthouse

**Files to Create:**
- `src/app/accommodation/[locationId]/page.tsx`

**Acceptance Criteria:**
- [ ] Hero impressive
- [ ] Table responsive
- [ ] Price comparison helpful
- [ ] Affiliate tracking works
- [ ] Access control works

---

## Phase 7: Content Population & Testing
**Duration:** Week 7 (40 hours)  
**Dependencies:** Phase 6  
**Can Start:** After Phase 6

### Task 7.1: Upload Course Content
**Priority:** P0  
**Time:** 16 hours  
**Agent:** Content Agent  
**Dependencies:** Task 6.2

**Subtasks:**
1. Create 3 courses (Digital Marketing, AI Agencies, Amazon FBA)
2. Create 3-5 modules per course
3. Create 5-8 lessons per module
4. Upload videos to Cloudflare Stream
5. Write lesson descriptions
6. Create thumbnails
7. Add quizzes (optional)
8. Test all videos play correctly
9. Verify module 1 is free for all courses

**Courses to Create:**
- Digital Marketing 101 (10 hours)
- AI Agency Fundamentals (12 hours)
- Amazon FBA Mastery (15 hours)

**Acceptance Criteria:**
- [ ] All videos uploaded and streaming
- [ ] Module 1 marked as free
- [ ] Descriptions professional
- [ ] Thumbnails consistent style
- [ ] Total content > 35 hours

---

### Task 7.2: Add Visa Information
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Content Agent  
**Dependencies:** Task 6.5

**Subtasks:**
1. Research 20 popular nomad countries
2. Add short-term visa info (all countries)
3. Add long-term visa info (all countries)
4. Add requirements checklists
5. Add process steps
6. Add costs
7. Link to official sources
8. Mark tier requirements correctly
9. Review for accuracy

**Countries to Add:**
- Europe: UK, Spain, Portugal, France, Germany, Italy
- Asia: Thailand, Vietnam, Indonesia, Japan, South Korea
- Americas: Mexico, Colombia, Brazil, Argentina, USA
- Other: Australia, New Zealand, UAE

**Acceptance Criteria:**
- [ ] 20 countries documented
- [ ] Short-term info = Basic tier
- [ ] Long-term info = Premium tier
- [ ] Requirements accurate
- [ ] Links work

---

### Task 7.3: Add Accommodation Data
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Content Agent  
**Dependencies:** Task 6.7

**Subtasks:**
1. Add 15 popular nomad cities
2. Add 5-10 accommodation options per city
3. Include hotels, hostels, apartments, co-living
4. Add nightly, weekly, monthly prices
5. Add amenities (WiFi, coworking, etc.)
6. Add affiliate links (Booking.com, Airbnb)
7. Mark tier requirements
8. Review for accuracy

**Cities to Add:**
- Europe: Lisbon, Barcelona, Prague, Budapest, Berlin
- Asia: Chiang Mai, Bali, Bangkok, Ho Chi Minh, Tokyo
- Americas: Medellín, Mexico City, Buenos Aires
- Other: Cape Town, Dubai

**Acceptance Criteria:**
- [ ] 15 cities documented
- [ ] 100+ accommodation options
- [ ] Short-term = Basic tier
- [ ] Long-term = Premium tier
- [ ] Affiliate links tracked

---

## Phase 8: Polish & Launch Prep
**Duration:** Week 8 (40 hours)  
**Dependencies:** Phase 7  
**Can Start:** After Phase 7

### Task 8.1: E2E Testing Suite
**Priority:** P0  
**Time:** 16 hours  
**Agent:** Testing Agent  
**Dependencies:** All previous tasks

**Subtasks:**
1. Write E2E test: Course enrollment flow
2. Write E2E test: Video watching flow
3. Write E2E test: Progress tracking
4. Write E2E test: Certificate generation
5. Write E2E test: Visa info access control
6. Write E2E test: Accommodation access control
7. Write E2E test: Upgrade prompts
8. Run tests on Chrome, Firefox, Safari
9. Run tests on mobile devices
10. Fix any bugs found

**Files to Create:**
- `tests/e2e/courses/enrollment.spec.ts`
- `tests/e2e/courses/video-watching.spec.ts`
- `tests/e2e/courses/progress.spec.ts`
- `tests/e2e/visa/access-control.spec.ts`
- `tests/e2e/accommodation/access-control.spec.ts`

**Acceptance Criteria:**
- [ ] All critical flows tested
- [ ] Tests pass on all browsers
- [ ] Mobile tests pass
- [ ] No blocking bugs

---

### Task 8.2: Performance Optimization
**Priority:** P0  
**Time:** 12 hours  
**Agent:** Performance Agent  
**Dependencies:** Phase 6

**Subtasks:**
1. Optimize images (WebP, lazy loading)
2. Add route-level code splitting
3. Optimize database queries
4. Add database indexes
5. Enable response caching
6. Optimize video streaming
7. Run Lighthouse audits
8. Fix performance issues
9. Achieve >90 scores on all pages

**Files to Modify:**
- Various (optimization across codebase)

**Acceptance Criteria:**
- [ ] All pages LCP < 2.5s
- [ ] All pages FID < 100ms
- [ ] All pages CLS < 0.1
- [ ] Lighthouse scores >90

---

### Task 8.3: Mobile Responsiveness Audit
**Priority:** P0  
**Time:** 8 hours  
**Agent:** Frontend QA Agent  
**Dependencies:** Phase 6

**Subtasks:**
1. Test all pages on iPhone SE
2. Test all pages on iPhone 14 Pro
3. Test all pages on Android (Pixel)
4. Test all pages on tablet
5. Fix any layout issues
6. Verify tap targets >44px
7. Test on slow 3G
8. Verify videos stream smoothly

**Acceptance Criteria:**
- [ ] All pages work on small screens (320px+)
- [ ] Tap targets adequate
- [ ] No horizontal scroll
- [ ] Videos stream on 3G

---

### Task 8.4: Documentation
**Priority:** P1  
**Time:** 4 hours  
**Agent:** Documentation Agent  
**Dependencies:** All previous tasks

**Subtasks:**
1. Update API_REFERENCE.md
2. Create CONTENT_MANAGEMENT_GUIDE.md
3. Create VIDEO_UPLOAD_GUIDE.md
4. Update README.md
5. Create USER_GUIDE.md

**Files to Create/Update:**
- `docs/CONTENT_MANAGEMENT_GUIDE.md`
- `docs/VIDEO_UPLOAD_GUIDE.md`
- `docs/USER_GUIDE.md`
- `docs/API_REFERENCE.md` (update)

**Acceptance Criteria:**
- [ ] Content team can add courses
- [ ] Video upload process documented
- [ ] API endpoints documented
- [ ] User guide helpful

---

## Summary

### Total Time Estimate
- **Phase 1:** 40 hours (1 week)
- **Phase 2:** 80 hours (2 weeks)
- **Phase 3:** 40 hours (1 week)
- **Phase 4:** 80 hours (2 weeks)
- **Phase 5:** 40 hours (1 week)
- **Phase 6:** 40 hours (1 week)
- **Phase 7:** 40 hours (1 week)
- **Phase 8:** 40 hours (1 week)

**Total:** 400 hours (10 weeks with single developer, 8 weeks with parallel work)

### Critical Path
```
Phase 1 → Phase 2 → Phase 4 → Phase 6 → Phase 7 → Phase 8
         ↘ Phase 3 → Phase 5 ↗
```

### Agent Types Needed
1. **Database Agent** - Schema design, RLS policies
2. **Backend API Agent** - REST endpoints, business logic
3. **Frontend Component Agent** - React components
4. **Full-Stack Page Agent** - Complete pages
5. **Testing Agent** - E2E, integration, RLS tests
6. **Performance Agent** - Optimization
7. **Content Agent** - Course/visa/accommodation content
8. **Documentation Agent** - Guides and references

### Priority Distribution
- **P0 (Critical):** 25 tasks - Must complete for launch
- **P1 (High):** 8 tasks - Important but not blocking
- **P2 (Medium):** 4 tasks - Nice to have
- **P3 (Low):** 0 tasks

---

**Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Status:** Ready for Implementation  
**Next Steps:** See `quickstart.md` for development setup
