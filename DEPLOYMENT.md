# Sri Chakra Eye Clinic - Production Deployment Guide

## 🚀 Quick Start

This website is optimized for production deployment on **Netlify** with automatic performance optimization.

### Prerequisites
- Node.js 20+
- npm or yarn
- GitHub account
- Netlify account (free tier supported)

---

## 📦 Local Setup

```bash
# Install dependencies
npm install

# Development mode (watch CSS changes)
npm run dev

# Production build
npm run build:prod

# Convert images to WebP
npm run convert:webp
```

---

## 🌐 Deployment to Netlify

### Method 1: Connect GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production optimizations ready"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select GitHub and choose your repository
   - Basic build settings will be auto-detected from `netlify.toml`
   - Click "Deploy site"

3. **Automatic Deployment**
   - Every push to `main` will trigger automatic build and deploy
   - Netlify will run: `npm run build:prod && npm run convert:webp`
   - Site will be live in ~1-2 minutes

### Method 2: Manual Upload

1. **Build locally**
   ```bash
   npm run build:prod
   npm run convert:webp
   ```

2. **Drag & drop to Netlify**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your project folder
   - Done!

---

## 🎯 What Gets Optimized

### Automatic (by Netlify)
- ✅ GZIP/Brotli compression
- ✅ CDN edge caching
- ✅ HTTPS with automatic certificate renewal
- ✅ Fast image delivery

### Manual (in your build)
- ✅ HTML minification (removes comments, unused whitespace)
- ✅ CSS minification (2,434 lines → ~1,500 lines)
- ✅ Asset versioning (cache busting with hash)
- ✅ WebP image conversion (60-70% size reduction)

---

## 📊 Performance Targets

| Metric | Target | Method |
|--------|--------|--------|
| Page Load | <2 seconds | Image optimization + CDN |
| Largest Contentful Paint | <2.5s | CSS/image optimization |
| Cumulative Layout Shift | <0.1 | Fixed dimensions + loading attributes |
| Image Size | 70-100MB | WebP + compression |

---

## 🔍 Monitoring & Testing

### Before Deployment
```bash
npm run build:prod  # Test minification
npm run convert:webp  # Test image conversion
```

### After Going Live
- Run Lighthouse audit via Chrome DevTools
- Check Core Web Vitals in Google Search Console
- Monitor performance in Netlify Analytics

### Lighthouse Target Scores
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 📁 File Structure for Production

```
repository/
├── pages/
│   ├── index.html
│   ├── about_sri_chakra_eye_clinic.html
│   ├── services_overview.html
│   └── images/
│       ├── *.webp (converted)
│       └── *.jpg, *.png (originals - fallback)
├── css/
│   ├── main.css (original)
│   └── main.HASH.min.css (minified version)
├── public/
│   ├── service-worker.js
│   ├── manifest.json
│   └── favicon.ico
├── scripts/
│   ├── build-prod.js
│   └── convert-webp.js
├── netlify.toml (deployment config)
└── package.json (build tools)
```

---

## 🛠️ Build Scripts Reference

### `npm run build:prod`
- Minifies all HTML files in-place
- Minifies CSS with hash versioning
- Updates HTML to reference versioned CSS
- Generates detailed minification report
- **Output**: Modified pages/ and css/

### `npm run convert:webp`
- Converts all JPEG/PNG to WebP
- Keeps originals as fallback
- Quality: 80 (optimized for web)
- **Output**: `pages/images/*.webp`

---

## 🌍 Environment Variables (Optional)

If you need analytics or error tracking:

```bash
# Create .env.local (not committed to Git)
VITE_GA_ID=your-google-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

---

## 📝 SEO Configuration

All SEO optimizations are pre-configured:
- ✅ robots.txt (blocks admin pages)
- ✅ sitemap.xml (3 public pages)
- ✅ Canonical tags
- ✅ Meta descriptions
- ✅ Open Graph tags
- ✅ Schema.org markup
- ✅ Twitter Card tags

---

## 🔐 Security Headers

Configured in `netlify.toml`:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

---

## 🚨 Troubleshooting

### Images not showing
- Ensure WebP conversion completed: `npm run convert:webp`
- Check file paths in HTML (relative paths)
- Verify images/ directory has both .webp and original formats

### Build fails
- Check Node version: `node --version` (need 20+)
- Clear cache: `rm -rf node_modules && npm install`
- Check logs: `npm run build:prod` (verbose output)

### Site is slow
- Check Netlify Analytics for which assets are large
- Run Lighthouse locally for bottleneck analysis
- Verify WebP images are being served

---

## 📞 Support

For Netlify help: [docs.netlify.com](https://docs.netlify.com)
For build issues: Check `netlify.toml` configuration

---

## ✅ Pre-Launch Checklist

- [ ] All dependencies installed: `npm install`
- [ ] Production build tested: `npm run build:prod`
- [ ] WebP conversion tested: `npm run convert:webp`
- [ ] Code committed and pushed to GitHub
- [ ] Netlify site created and connected
- [ ] Build successful on Netlify dashboard
- [ ] Lighthouse audit score 90+
- [ ] All pages load and display correctly
- [ ] Forms and interactive elements work
- [ ] Core Web Vitals in acceptable range

---

**Last Updated**: March 21, 2026
**Status**: Production Ready ✅
