#!/usr/bin/env node

/**
 * Render Post-Build Script
 * Runs bundle optimization after React build is complete
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Render Post-Build Script Starting...');

try {
  // Check if build directory exists
  const buildDir = path.join(__dirname, '../build');
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Build may have failed.');
    process.exit(1);
  }

  console.log('✅ Build directory found, running optimization...');

  // Run the ultra-aggressive stripper (optimizes ALL chunks including React libraries)
  console.log('🔄 Running ultra-aggressive stripper...');
  execSync('npm run ultra-aggressive', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('✅ Optimization complete!');
  console.log('🎉 Render deployment ready with optimized bundle!');

} catch (error) {
  console.error('❌ Post-build optimization failed:', error.message);
  console.log('⚠️  Continuing with original bundle...');
  console.log('✅ Render deployment ready (using original bundle)');
  process.exit(0); // Don't fail the build
}
