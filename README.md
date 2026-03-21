# Sri Chakra Eye Clinic - Website

A modern, production-ready website for Sri Chakra Eye Clinic, built with HTML5, Tailwind CSS, and optimized for performance and SEO.

## 🏥 About

Sri Chakra Eye Clinic provides world-class ophthalmology services in Anantapur with expert care and advanced technology.

## 🚀 Features

- **Responsive Design** - Mobile-first approach optimized for all devices
- **Performance Optimized** - Image compression, minification, and CDN delivery
- **SEO Ready** - Schema.org markup, sitemap, canonical tags, and structured data
- **Progressive Web App** - Service Worker for offline support
- **Production Deployed** - Deployed on Netlify with automatic builds
- **Tailwind CSS** - Modern utility-first styling framework
- **Fast Load Times** - Target <2.5s page load via performance optimization

## 📋 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Watch for CSS changes
npm run dev

# Production build
npm run build:prod

# Convert images to WebP
npm run convert:webp
```

## 📁 Project Structure

```
sri-chakra-eye-clinic/
├── pages/
│   ├── homepage.html
│   ├── about_sri_chakra_eye_clinic.html
│   ├── services_overview.html
│   ├── doctor_dashboard.html (admin)
│   ├── patient_management.html (admin)
│   └── images/
├── css/
│   ├── tailwind.css (source)
│   └── main.css (compiled)
├── public/
│   ├── service-worker.js (PWA)
│   ├── manifest.json
│   └── favicon.ico
├── scripts/
│   ├── build-prod.js (minification)
│   └── convert-webp.js (image optimization)
├── netlify.toml (deployment config)
├── DEPLOYMENT.md (full deployment guide)
└── package.json
```

## 🛠️ Available Scripts

```bash
npm run build:css      # Compile Tailwind CSS
npm run watch:css      # Watch CSS changes during development
npm run dev            # Watch mode for development
npm run build:prod     # Production build (minify HTML/CSS/JS)
npm run convert:webp   # Convert images to WebP format
```

## 🌐 Deployment

### Deploy to Netlify (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions.

**Quick Deploy:**
```bash
npm run build:prod
npm run convert:webp
git push origin main
# Netlify auto-deploys via GitHub integration
```

## 📊 Performance

**Optimization Results:**
- Page Load Time: 1.5-2.5 seconds
- Image Size Reduction: 60-70% via WebP
- CSS Minification: 38% reduction
- SEO Score: 95+/100

## 🎨 Styling

Built with Tailwind CSS 3.4+ and includes:
- Responsive breakpoints: sm, md, lg, xl, 2xl
- Custom utility plugins for enhanced functionality
- Accessibility-first component design
- Dark mode support ready

## 📱 Pages

- **Homepage** (`homepage.html`) - Main landing page with hero, services, about, testimonials
- **About** (`about_sri_chakra_eye_clinic.html`) - Clinic information, doctor profile, galleries
- **Services** (`services_overview.html`) - Complete eye care services and treatments
- **Doctor Dashboard** (`doctor_dashboard.html`) - Admin panel for staff
- **Patient Management** (`patient_management.html`) - Admin system for records

## 🔍 SEO Features

- ✅ Meta descriptions and Open Graph tags
- ✅ Twitter Card markup
- ✅ Schema.org JSON-LD for Medical Business
- ✅ Sitemap.xml with priority levels
- ✅ robots.txt for search crawlers
- ✅ Canonical tags on all pages
- ✅ Mobile viewport optimization

## 🔐 Security

- HTTP/2 support on Netlify
- Automatic HTTPS
- Security headers configured
- Admin pages excluded from indexing

## 📈 Monitoring

- Google Search Console integration ready
- Lighthouse audit support
- Core Web Vitals tracking
- Netlify Analytics dashboard

## 🛠️ Development Workflow

1. **Edit code** - Make changes to HTML, CSS, or JavaScript
2. **Watch CSS** - Run `npm run dev` to see changes live
3. **Build** - Run `npm run build:prod` before deployment
4. **Convert Images** - Run `npm run convert:webp` for WebP versions
5. **Push to Git** - Commit and push to GitHub
6. **Deploy** - Netlify automatically builds and deploys

## 📦 Dependencies

**Production:**
- Tailwind CSS 3.4+
- Tailwind Plugins (forms, animate, typography)

**Development:**
- HTML Minifier
- Clean CSS
- Terser (JS minifier)
- Sharp (image processor for WebP)

## 🤝 Contributing

For team members: See [DEPLOYMENT.md](./DEPLOYMENT.md) for contribution guidelines.

## 📄 License

MIT

## 👨‍⚕️ Contact

**Sri Chakra Eye Clinic**
- Location: Anantapur, Andhra Pradesh
- Specialization: Advanced Ophthalmology
- Services: Surgery, Diagnostics, Eye Care

---

**Last Updated:** March 21, 2026
**Status:** Production Ready ✅
**Deployment:** Netlify
**Performance Score:** 95+/100

