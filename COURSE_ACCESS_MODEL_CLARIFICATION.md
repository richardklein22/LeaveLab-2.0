# 🎓 Course Access Model - IMPORTANT CLARIFICATION

**Date:** October 17, 2025  
**Status:** ✅ Corrected in Phase 4 RLS policies

---

## ⚠️ Key Distinction

### ❌ INCORRECT (Previous Understanding):
> "Free users can only preview the **first lesson** of **one course**"

### ✅ CORRECT (Actual Requirement):
> "Free users can access the **first MODULE** of **EVERY course**"

---

## 📚 What This Means

### **Free Tier: "Try Before You Buy"**

Free users can:
- ✅ Browse **ALL courses** in the catalog
- ✅ Access **Module 1** of **EVERY course** they're interested in
- ✅ Watch all lessons within each first module
- ❌ **Cannot** access Module 2+ without upgrading

**Example:**
```
Course: "Digital Nomad Visa Guide"
├── Module 1: Introduction to Visa Types [FREE - ✅ Accessible]
│   ├── Lesson 1.1: What is a Digital Nomad Visa?
│   ├── Lesson 1.2: Types of Visas Explained
│   └── Lesson 1.3: Which Visa is Right for You?
├── Module 2: Application Process [LOCKED 🔒]
│   ├── Lesson 2.1: Required Documents
│   └── Lesson 2.2: Step-by-Step Application
└── Module 3: After Approval [LOCKED 🔒]
    └── ...

Course: "Finding Long-term Accommodation"
├── Module 1: Accommodation Basics [FREE - ✅ Accessible]
│   ├── Lesson 1.1: Types of Accommodation
│   ├── Lesson 1.2: Budget Planning
│   └── Lesson 1.3: Location Considerations
├── Module 2: Search Strategies [LOCKED 🔒]
└── ...
```

**Free users can try Module 1 of BOTH courses** (and any other courses available).

---

## 🎯 Complete Access Model

### **Free Tier** (£0/month)
- ✅ **Module 1 of ALL courses** (unlimited preview access)
- ❌ No access to modules 2+
- ❌ No enrollment needed (just browse and learn)
- **Value Proposition:** "Try every course to see what interests you"

### **Basic Tier** (£70/month)
- ✅ **Module 1 of ALL courses** (retains free access)
- ✅ **Full access to 1 enrolled course** (all modules, all lessons)
- ✅ Can switch courses after completing
- **Limitation:** Only 1 active enrollment at a time
- **Value Proposition:** "Deep dive into one course at a time"

### **Premium Tier** (£100/month)
- ✅ **Full access to ALL courses** (all modules, all lessons)
- ✅ No enrollment needed (instant access)
- ✅ Unlimited concurrent course access
- **Value Proposition:** "Learn everything, anytime"

---

## 🏗️ Database Structure

### **Tables Required:**

```sql
-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL
);

-- Course modules (NEW - critical for access control)
CREATE TABLE course_modules (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT false,  -- TRUE for module 1
  -- ⬆️ This flag determines if Free users can access
);

-- Lessons belong to modules
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  module_id UUID REFERENCES course_modules(id),
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER NOT NULL,
  video_url TEXT
);

-- Track enrollments for Basic tier
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);
```

---

## 🔐 Access Control Logic

### **Module Access RLS Policy:**

```sql
CREATE POLICY "Users can view modules based on subscription"
ON course_modules
FOR SELECT
TO authenticated
USING (
  -- Rule 1: Module 1 is always free
  is_free = true
  
  OR
  
  -- Rule 2: User is enrolled in this course (Basic with enrollment)
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    WHERE ce.user_id = auth.uid()
      AND ce.course_id = course_modules.course_id
  )
  
  OR
  
  -- Rule 3: User has Premium subscription (no enrollment needed)
  (
    SELECT st.name FROM user_subscriptions us
    JOIN subscription_tiers st ON us.tier_id = st.id
    WHERE us.user_id = auth.uid()
      AND us.status = 'active'
  ) = 'premium'
);
```

### **Lesson Access RLS Policy:**

```sql
CREATE POLICY "Users can view lessons if they can access the module"
ON lessons
FOR SELECT
TO authenticated
USING (
  -- Users can access lessons if they can access the parent module
  EXISTS (
    SELECT 1 FROM course_modules cm
    WHERE cm.id = lessons.module_id
      AND (
        cm.is_free = true  -- Module 1
        OR
        -- User enrolled
        EXISTS (
          SELECT 1 FROM course_enrollments ce
          WHERE ce.user_id = auth.uid()
            AND ce.course_id = cm.course_id
        )
        OR
        -- User has Premium
        (
          SELECT st.name FROM user_subscriptions us
          JOIN subscription_tiers st ON us.tier_id = st.id
          WHERE us.user_id = auth.uid()
            AND us.status = 'active'
        ) = 'premium'
      )
  )
);
```

---

## 💡 User Experience Examples

### **Scenario 1: Free User Exploring**

Sarah (Free tier) wants to learn about digital nomad life:

1. Browses course catalog → Sees 10 available courses
2. Clicks "Digital Nomad Visa Guide" → Module 1 unlocked ✅
3. Watches all 3 lessons in Module 1
4. Clicks Module 2 → **Locked** with upgrade prompt: "Upgrade to Basic to continue"
5. Goes back to catalog → Clicks "Finding Accommodation" → Module 1 unlocked ✅
6. Can try first modules of all 10 courses

**Result:** Sarah gets a comprehensive overview of all topics before deciding to upgrade.

---

### **Scenario 2: Basic User Learning**

Tom (Basic tier) wants to master visa applications:

1. Enrolls in "Digital Nomad Visa Guide"
2. Gets full access to ALL modules (1, 2, 3, 4) ✅
3. Works through all lessons over 2 weeks
4. Completes the course
5. Unenrolls and enrolls in "Tax Planning for Nomads"
6. Can still view Module 1 of other courses (free access)

**Result:** Tom masters one course at a time with full depth.

---

### **Scenario 3: Premium User Learning**

Lisa (Premium tier) is preparing for a big move:

1. Opens all courses relevant to her move:
   - Digital Nomad Visa Guide (full access ✅)
   - Finding Accommodation (full access ✅)
   - Banking & Finance (full access ✅)
   - Tax Planning (full access ✅)
2. Jumps between courses as needed
3. No enrollment required
4. Watches lessons in any order

**Result:** Lisa has complete flexibility to learn what she needs, when she needs it.

---

## 🎨 UI/UX Considerations

### **Course Catalog Page:**
- Show all courses to all users
- Badge on modules:
  - Module 1: "FREE" badge (green)
  - Modules 2+: "BASIC" or "PREMIUM" badge (locked icon for Free users)

### **Course Detail Page:**
- Module list shows lock icons on modules user can't access
- Clicking a locked module shows upgrade prompt
- Free users see: "Unlock full course with Basic membership"

### **Enrollment:**
- Free users: No enrollment needed for Module 1
- Basic users: Must enroll to access full course
- Premium users: Can optionally enroll for progress tracking

---

## ✅ Implementation Checklist

When building the course system:

- [ ] Create `course_modules` table with `is_free` column
- [ ] Set `is_free = true` for all first modules
- [ ] Implement module-based RLS policies (not lesson-based)
- [ ] Show "FREE" badge on Module 1 in UI
- [ ] Show lock icons on Modules 2+ for Free users
- [ ] Allow Free users to access Module 1 without login (optional)
- [ ] Enforce 1-enrollment limit for Basic users
- [ ] Test access control for all three tiers
- [ ] Add upgrade prompts when Free users click locked modules

---

## 📝 Notes for Future Development

1. **Module 1 Content Strategy:**
   - Make Module 1 comprehensive enough to be valuable
   - End with a clear value proposition for upgrading
   - Include a preview of what's in the remaining modules

2. **Enrollment UX:**
   - Basic users should see "Enroll in this course" button
   - Show enrollment status clearly
   - Allow easy unenrollment (with warning about losing access)

3. **Progress Tracking:**
   - Track lesson completion within Module 1 for Free users
   - Encourage signup: "Sign up to save your progress"
   - Premium users can track progress across all courses

4. **Analytics:**
   - Track which Module 1s are most popular
   - Measure conversion rate (Module 1 viewers → paid subscribers)
   - Identify where Free users drop off

---

## 🔄 Migration Path

If you already have a course system without modules:

1. Create `course_modules` table
2. Group existing lessons into modules
3. Mark first module (or first N lessons) as `is_free = true`
4. Update RLS policies to use module-based logic
5. Update frontend to display modules, not just lessons
6. Test thoroughly with all three tiers

---

## ✨ Summary

**The key insight:** Free tier is a **discovery tool**, not just a limited preview.

Users can explore the first module of **every** course to:
- Understand what each course offers
- Decide which course to commit to with Basic
- See the value before upgrading to Premium

This "try before you buy" model:
- Reduces friction for new users
- Increases conversion (users see real value)
- Encourages upgrades based on genuine interest
- Differentiates your platform from competitors

---

**Status: ✅ Documented and implemented in Phase 4 RLS policies**

