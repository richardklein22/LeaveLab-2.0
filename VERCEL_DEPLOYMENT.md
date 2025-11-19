# 🚀 Vercel Deployment Guide - LeaveLab Landing Page

## ✅ Code Status
- **Branch**: landing-page
- **Commit**: 4d50af6
- **Status**: Pushed to GitHub
- **Files**: 21 files changed, 3016+ lines added

---

## 🎯 Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Go to Vercel
Visit: **https://vercel.com/dashboard**

### Step 2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository: **richardklein22/LeaveLab-2.0**
3. Select the **landing-page** branch

### Step 3: Configure Project
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
```

### Step 4: Environment Variables (if needed)
**For this landing page, NO environment variables are required!** ✅

The landing page is standalone with no backend dependencies.

### Step 5: Deploy
Click **"Deploy"** and wait ~2-3 minutes.

Your landing page will be live at:
```
https://your-project-name.vercel.app
```

---

## 🎯 Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From your project root
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account/team
- **Link to existing project?** No (or Yes if exists)
- **What's your project's name?** leavelab
- **In which directory is your code located?** ./
- **Want to override settings?** No

### Step 4: Done!
Your site will be deployed and you'll get a URL like:
```
https://leavelab-xxx.vercel.app
```

---

## 📝 Post-Deployment Checklist

### Immediate Actions:
- [ ] Visit the deployed URL
- [ ] Test on mobile device
- [ ] Check all sections load properly
- [ ] Verify animations work
- [ ] Test carousel swipe functionality
- [ ] Confirm all buttons are clickable

### Optional Configuration:
- [ ] Set up custom domain in Vercel settings
- [ ] Configure redirects if needed
- [ ] Add Google Analytics (if desired)
- [ ] Set up Vercel Analytics

---

## 🔧 Vercel Configuration

### Automatic Settings (Next.js)
Vercel automatically detects:
- ✅ Framework: Next.js 15.5.4
- ✅ Build command: `npm run build`
- ✅ Output directory: `.next`
- ✅ Install command: `npm install`
- ✅ Node version: Latest LTS

### No Configuration Needed!
The landing page has:
- ✅ No environment variables required
- ✅ No API routes (standalone)
- ✅ No backend dependencies
- ✅ No database connections

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain:
1. Go to Project Settings in Vercel
2. Click "Domains"
3. Add your domain (e.g., leavelab.com)
4. Follow DNS instructions:
   - **A Record**: Point to Vercel's IP
   - **CNAME**: Point to vercel-dns.com

### DNS Configuration:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Free):
1. Go to Project Settings
2. Click "Analytics"
3. Enable Vercel Analytics
4. Get insights on:
   - Page views
   - Unique visitors
   - Top pages
   - Geographic data

### Speed Insights (Free):
1. Enable Speed Insights
2. Monitor:
   - Core Web Vitals
   - Load times
   - Performance scores

---

## 🔄 Continuous Deployment

### Automatic Deployments:
Every push to `landing-page` branch will:
1. Trigger automatic deployment
2. Run build process
3. Deploy to production
4. Update live URL

### Branch Previews:
- Production: `landing-page` branch
- Preview: Other branches get preview URLs

---

## 🚨 Troubleshooting

### Build Fails?
```bash
# Test locally first
npm run build

# Check for errors
npm run lint
```

### Deployment Fails?
- Check Vercel build logs
- Verify all dependencies in package.json
- Ensure no environment variables are missing

### 404 Errors?
- The landing page is at: `/landing-new`
- To make it the homepage, see instructions below

---

## 🏠 Make Landing Page the Homepage

### Option A: In Vercel (Rewrites)
Add to `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/landing-new"
    }
  ]
}
```

### Option B: In Code (Recommended)
Replace the main page:
```bash
# Backup old page
mv src/app/page.tsx src/app/page-old.tsx

# Use new landing page
cp src/app/landing-new/page.tsx src/app/page.tsx

# Commit and push
git add .
git commit -m "Make new landing page the homepage"
git push origin landing-page
```

Vercel will automatically redeploy!

---

## 📱 Test Your Deployment

### Desktop Testing:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Mobile Testing:
1. Open on your phone: `https://your-url.vercel.app/landing-new`
2. Test carousel swipe
3. Test testimonial auto-rotation
4. Check touch interactions

### Performance Testing:
Run Lighthouse audit:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Target: 90+ scores

---

## 🎉 You're Live!

Your landing page is now deployed with:
- ✅ 10 responsive sections
- ✅ Mobile-optimized carousels
- ✅ Framer Motion animations
- ✅ Auto-rotating testimonials
- ✅ Green color theme
- ✅ Inter font loaded
- ✅ Zero backend dependencies

### Share Your Link:
```
Production URL: https://your-project.vercel.app/landing-new
Custom Domain: https://leavelab.com/landing-new
```

---

## 📞 Need Help?

### Vercel Support:
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://vercel-status.com

### Repository:
- GitHub: https://github.com/richardklein22/LeaveLab-2.0
- Branch: landing-page
- Commit: 4d50af6

---

## 🔥 Next Steps

After deployment:
1. [ ] Test all functionality
2. [ ] Set up custom domain
3. [ ] Enable analytics
4. [ ] Add partner logos
5. [ ] Update CTA links
6. [ ] Configure redirects
7. [ ] Set up monitoring
8. [ ] Share with team!

---

**Deployment Status**: ✅ Ready to Deploy
**Branch**: landing-page (pushed to GitHub)
**Next Action**: Visit Vercel Dashboard or run `vercel --prod`

