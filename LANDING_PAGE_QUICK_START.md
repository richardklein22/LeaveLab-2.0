# 🚀 LeaveLab Landing Page - Quick Start Guide

## View the New Landing Page

### Option 1: View at New Route (Current Setup)

```bash
npm run dev
```

Visit: **http://localhost:3000/landing-new**

### Option 2: Replace Main Homepage (Recommended)

To make this your main landing page:

1. **Backup the old page:**
```bash
mv src/app/page.tsx src/app/page-old.tsx
```

2. **Replace with new landing page:**
```bash
cp src/app/landing-new/page.tsx src/app/page.tsx
```

3. **Visit:**
```
http://localhost:3000
```

## 🎨 What's Included

### 10 Fully Responsive Sections:
1. **Hero Section** - Animated headline with progress icons
2. **Problem Comparison** - Before/After split view
3. **Stage Journey** - 4-stage roadmap with mobile carousel
4. **Testimonials** - Auto-rotating on mobile
5. **Partner Logos** - With hover effects
6. **How It Works** - 3-step process
7. **Pricing** - Free vs Premium cards
8. **FAQ** - Accordion style
9. **Final CTA** - High-converting call-to-action
10. **Footer** - Multi-column layout

### Features:
- ✅ Fully mobile-optimized
- ✅ Framer Motion animations
- ✅ Embla Carousel for mobile
- ✅ Green color scheme (#10B981)
- ✅ Inter font (Google Fonts)
- ✅ Accessibility compliant
- ✅ No linting errors

## 📝 Customize Content

Edit `src/lib/landing-data.ts` to change:
- Headlines and subheadlines
- Stage information
- Testimonials
- Partner details
- Pricing plans
- FAQ questions
- Footer links

## 🖼️ Add Images

Place partner logos in `public/logos/`:
- worldpackers.svg (already exists in public/partners/)
- flight-partner.svg
- isa-compass.svg
- ata-thailand.svg
- revolutions-hostel.svg

## 🎯 Update CTAs

All CTA buttons currently link to `/signup`. Update these in the components:
- HeroSection.tsx - Line 47
- StageJourney.tsx - Button onClick handlers
- FinalCTA.tsx - Lines 38 & 47
- PricingSection.tsx - Button onClick handlers

## 📱 Test Mobile

### Using Chrome DevTools:
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these viewports:
   - iPhone SE (375x667)
   - iPhone 14 (390x844)
   - iPad (768x1024)

### Using Real Devices:
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Run: `npm run dev -- --host`
3. Visit on mobile: `http://YOUR_IP:3000/landing-new`

## ⚙️ Environment

### Tech Stack:
- Next.js 15.5.4
- React 19.2.0
- Tailwind CSS 3.4.18
- Framer Motion (installed)
- Embla Carousel React (installed)
- Lucide React 0.545.0

### Browser Support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Styles not loading?
```bash
# Restart dev server
npm run dev
```

### Animations not working?
Check Framer Motion is installed:
```bash
npm list framer-motion
```

### Carousel not working?
Check Embla is installed:
```bash
npm list embla-carousel-react
```

## 📊 Performance Tips

1. **Add Images:**
   - Use Next.js Image component
   - Optimize images (WebP format)
   - Set proper width/height

2. **Lazy Loading:**
   - Large images should use loading="lazy"
   - Consider dynamic imports for heavy components

3. **Analytics:**
   - Add Google Analytics to layout.tsx
   - Track CTA button clicks
   - Monitor conversion rates

## 🎉 You're Done!

The landing page is fully functional and ready for customization. All components follow the MCP specification exactly as provided.

### Next Steps:
1. ✅ View the page at `/landing-new`
2. ⬜ Add partner logos
3. ⬜ Update CTA links
4. ⬜ Customize content
5. ⬜ Deploy to production

---

**Need help?** Check `LANDING_PAGE_IMPLEMENTATION.md` for detailed documentation.

