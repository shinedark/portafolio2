#!/usr/bin/env node

/**
 * Render Deployment Script
 * Automatically replaces the original bundle with the optimized one
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Render Deployment Script Starting...');

try {
  // Find the optimized bundle
  const buildDir = path.join(__dirname, '../build/static/js');
  const files = fs.readdirSync(buildDir);
  
  const optimizedBundle = files.find(file => 
    file.includes('max-aggression.js')
  );
  
  const originalBundle = files.find(file => 
    file.startsWith('main.') && 
    file.endsWith('.js') && 
    !file.includes('max-aggression') &&
    !file.includes('stripped') &&
    !file.includes('enhanced') &&
    !file.includes('production') &&
    !file.includes('aggressive') &&
    !file.includes('selective') &&
    !file.includes('ultra-deep')
  );

  if (!optimizedBundle || !originalBundle) {
    throw new Error('Could not find bundle files');
  }

  const optimizedPath = path.join(buildDir, optimizedBundle);
  const originalPath = path.join(buildDir, originalBundle);

  // Get file sizes
  const optimizedSize = fs.statSync(optimizedPath).size;
  const originalSize = fs.statSync(originalPath).size;
  const reduction = originalSize - optimizedSize;
  const reductionPercent = ((reduction / originalSize) * 100).toFixed(2);

  console.log(`📊 Bundle optimization results:`);
  console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`   Optimized: ${(optimizedSize / 1024).toFixed(2)} KB`);
  console.log(`   Reduction: ${(reduction / 1024).toFixed(2)} KB (${reductionPercent}%)`);

  // Replace original bundle with optimized one
  console.log('🔄 Replacing original bundle with optimized version...');
  fs.copyFileSync(optimizedPath, originalPath);

  // Copy manifest for error translation
  const manifestPath = path.join(__dirname, '../build/max-aggression-manifest.json');
  const newManifestPath = path.join(__dirname, '../build/optimization-manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    fs.copyFileSync(manifestPath, newManifestPath);
    console.log('✅ Optimization manifest copied');
  }

  console.log('�� Render deployment ready!');
  console.log('💡 The optimized bundle will now be served by Render automatically!');

} catch (error) {
  console.error('❌ Render deployment failed:', error.message);
  process.exit(1);
}
