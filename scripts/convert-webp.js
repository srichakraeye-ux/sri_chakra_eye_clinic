#!/usr/bin/env node

/**
 * WebP Conversion Script
 * Batch converts all JPEG/PNG images to WebP format for optimal performance
 * - Converts images in pages/images/ directory
 * - Preserves original images as fallback
 * - Reduces file size by 60-70%
 * - Generates ImageMagick/Sharp compatible output
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'pages', 'images');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  console.log('⚠️  Images directory not found:', IMAGES_DIR);
  process.exit(1);
}

async function convertToWebP() {
  console.log('\n🎨 Converting images to WebP format...\n');

  const files = fs.readdirSync(IMAGES_DIR);
  const imageFiles = files.filter(f =>
    SUPPORTED_FORMATS.includes(path.extname(f).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.log('ℹ️  No images to convert');
    return;
  }

  let successCount = 0;
  let totalOriginal = 0;
  let totalWebP = 0;

  console.log(`📦 Found ${imageFiles.length} images to convert\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(IMAGES_DIR, `${path.basename(file, path.extname(file))}.webp`);

    try {
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;

      // Convert to WebP with quality optimization
      const info = await sharp(inputPath)
        .webp({ quality: 80, alphaQuality: 100 })
        .toFile(outputPath);

      const webpSize = info.size;
      const savings = Math.round(100 * (1 - webpSize / originalSize));

      totalOriginal += originalSize;
      totalWebP += webpSize;
      successCount++;

      console.log(`  ✓ ${file}`);
      console.log(`    ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(webpSize / 1024 / 1024).toFixed(2)} MB (-${savings}%)\n`);

    } catch (error) {
      console.error(`  ✗ Failed to convert ${file}:`, error.message);
    }
  }

  console.log(`\n✅ Conversion completed: ${successCount}/${imageFiles.length} images converted`);
  console.log(`\n📊 Summary:`);
  console.log(`  • Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  • WebP size: ${(totalWebP / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  • Total savings: ${Math.round(100 * (1 - totalWebP / totalOriginal))}%\n`);

  if (totalOriginal > 0 && totalWebP > 0) {
    const savings = Math.round(100 * (totalOriginal - totalWebP) / 1024 / 1024);
    console.log(`  💾 Space saved: ~${savings} MB\n`);
  }

  console.log('ℹ️  Update your HTML to use WebP with fallback:\n');
  console.log('  <picture>');
  console.log('    <source srcset="image.webp" type="image/webp">');
  console.log('    <img src="image.jpg" alt="Description">');
  console.log('  </picture>\n');
}

// Run conversion
convertToWebP().catch(error => {
  console.error('\n❌ Conversion failed:', error.message);
  process.exit(1);
});
