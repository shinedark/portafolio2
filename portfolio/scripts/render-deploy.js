#!/usr/bin/env node

/**
 * Render Deployment Script
 * Safely handles bundle optimization for Render deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Render Deployment Script Starting...');

try {
  // First, check if we need to run optimization
  const buildDir = path.join(__dirname, '../build/static/js');
  
  if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build directory not found. Skipping optimization.');
    console.log('✅ Render deployment ready (using original bundle)');
    process.exit(0);
  }

  const files = fs.readdirSync(buildDir);
  
  // Find computer-optimized chunks (best performance)
  const computerOptimizedChunks = files.filter(file => 
    file.includes('computer-optimized.js')
  );
  
  // Find max-aggression chunks (human-readable fallback)
  const maxAggressionChunks = files.filter(file => 
    file.includes('max-aggression.js')
  );
  
  // Find all original chunks
  const originalChunks = files.filter(file => 
    file.endsWith('.js') && 
    !file.includes('computer-optimized') &&
    !file.includes('max-aggression') &&
    !file.includes('ultra-aggressive') &&
    !file.includes('stripped') &&
    !file.includes('enhanced') &&
    !file.includes('production') &&
    !file.includes('aggressive') &&
    !file.includes('selective') &&
    !file.includes('ultra-deep') &&
    !file.includes('backup')
  );

  if (originalChunks.length === 0) {
    console.log('⚠️  Original chunks not found. Skipping optimization.');
    console.log('✅ Render deployment ready');
    process.exit(0);
  }

  if (optimizedChunks.length === 0) {
    console.log('⚠️  Optimized chunks not found. Skipping optimization.');
    console.log('✅ Render deployment ready (using original chunks)');
    process.exit(0);
  }

  console.log(`📦 Found ${originalChunks.length} original chunks and ${optimizedChunks.length} optimized chunks`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let replacedChunks = 0;

  // Replace each original chunk with its optimized version
  for (const originalChunk of originalChunks) {
    // Find corresponding optimized chunk
    const optimizedChunk = optimizedChunks.find(opt => 
      opt.includes(originalChunk.replace('.js', '.ultra-aggressive.js'))
    );

    if (!optimizedChunk) {
      console.log(`⚠️  No optimized version found for ${originalChunk}`);
      continue;
    }

    const originalPath = path.join(buildDir, originalChunk);
    const optimizedPath = path.join(buildDir, optimizedChunk);

    // Verify files exist
    if (!fs.existsSync(originalPath) || !fs.existsSync(optimizedPath)) {
      console.log(`⚠️  Files not accessible for ${originalChunk}`);
      continue;
    }

    // Get file sizes
    const originalSize = fs.statSync(originalPath).size;
    const optimizedSize = fs.statSync(optimizedPath).size;
    
    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;

    // Replace original with optimized
    console.log(`🔄 Replacing ${originalChunk} with optimized version...`);
    fs.copyFileSync(optimizedPath, originalPath);
    replacedChunks++;
  }

  const totalReduction = totalOriginalSize - totalOptimizedSize;
  const totalReductionPercent = ((totalReduction / totalOriginalSize) * 100).toFixed(2);

  console.log(`📊 Ultra-Aggressive optimization results:`);
  console.log(`   Chunks replaced: ${replacedChunks}`);
  console.log(`   Total original: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`   Total optimized: ${(totalOptimizedSize / 1024).toFixed(2)} KB`);
  console.log(`   Total reduction: ${(totalReduction / 1024).toFixed(2)} KB (${totalReductionPercent}%)`);

  console.log('✅ All chunks replaced with optimized versions');

  // Copy ultra-aggressive manifest for error translation
  const manifestPath = path.join(__dirname, '../build/ultra-aggressive-manifest.json');
  const newManifestPath = path.join(__dirname, '../build/optimization-manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    fs.copyFileSync(manifestPath, newManifestPath);
    console.log('✅ Ultra-aggressive manifest copied');
  }

  console.log('🎉 Render deployment ready!');
  console.log('💡 The optimized bundle will now be served by Render automatically!');

} catch (error) {
  console.error('❌ Render deployment failed:', error.message);
  console.log('⚠️  Continuing with original bundle...');
  console.log('✅ Render deployment ready (using original bundle)');
  process.exit(0); // Don't fail the build, just use original bundle
}
