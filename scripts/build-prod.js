#!/usr/bin/env node

/**
 * Production Build Script
 * Minifies HTML, CSS, and JS for optimal performance
 * - Minifies all HTML files in pages/
 * - Minifies CSS in css/main.css
 * - Minifies inline JavaScript
 * - Adds asset versioning for cache busting
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const minify = require('html-minifier-terser').minify;
const CleanCSS = require('clean-css');
const terser = require('terser');

const PAGES_DIR = path.join(__dirname, '..', 'pages');
const CSS_FILE = path.join(__dirname, '..', 'css', 'main.css');
const OUTPUT_DIR = path.join(__dirname, '..', 'dist');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Utility to generate hash for asset versioning
function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

// Minify CSS
function minifyCSS() {
  console.log('📦 Minifying CSS...');
  if (!fs.existsSync(CSS_FILE)) {
    console.log('⚠️  CSS file not found, skipping CSS minification');
    return;
  }

  const css = fs.readFileSync(CSS_FILE, 'utf8');
  const output = new CleanCSS({
    compatibility: 'ie11',
    sourceMap: false,
    level: 2
  }).minify(css);

  if (output.errors.length > 0) {
    console.error('❌ CSS Minification errors:', output.errors);
    return;
  }

  const minified = output.styles;
  const hash = generateHash(minified);
  const minifiedPath = path.join(__dirname, '..', 'css', `main.${hash}.min.css`);

  fs.writeFileSync(minifiedPath, minified);
  console.log(`✅ CSS minified: ${minified.length} → ${output.stats.minifiedSize} bytes (${Math.round(100 * output.stats.minifiedSize / minified.length)}%)`);

  return hash;
}

// Minify HTML files
async function minifyHTML(cssHash) {
  console.log('📦 Minifying HTML...');

  const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));
  let totalOriginal = 0;
  let totalMinified = 0;

  for (const file of files) {
    const filePath = path.join(PAGES_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html.length;

    // Update CSS file reference with versioned filename if hash exists
    if (cssHash) {
      html = html.replace(/(<link[^>]*href=["']css\/main)\.css(["'])/g, `$1.${cssHash}.min.css$2`);
    }

    const minified = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: false,
      processConditionalComments: true,
      conservativeCollapse: false
    });

    fs.writeFileSync(filePath, minified);
    totalOriginal += original;
    totalMinified += minified.length;

    console.log(`  ✓ ${file}: ${original} → ${minified.length} bytes (-${Math.round(100 * (1 - minified.length / original))}%)`);
  }

  console.log(`✅ Total HTML: ${totalOriginal} → ${totalMinified} bytes (-${Math.round(100 * (1 - totalMinified / totalOriginal))}%)`);
}

// Main execution
async function build() {
  console.log('\n🚀 Starting production build...\n');

  try {
    const cssHash = minifyCSS();
    await minifyHTML(cssHash);

    console.log('\n✨ Production build completed successfully!\n');
    console.log('📊 Summary:');
    console.log('  • HTML files minified in: pages/');
    console.log('  • CSS minified with versioning: css/main.HASH.min.css');
    console.log('  • Ready for deployment to Netlify');

  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
