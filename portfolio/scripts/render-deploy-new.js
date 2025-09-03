#!/usr/bin/env node

/**
 * Enhanced Render Deployment Script
 * Uses the new computer-optimized build system for maximum performance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Enhanced Render Deployment Script Starting...');
console.log('================================================\n');

try {
  // Check if build directory exists
  const buildDir = path.join(__dirname, '../build/static/js');
  
  if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build directory not found. Running build first...');
    execSync('npm run build', { stdio: 'inherit' });
  }

  const files = fs.readdirSync(buildDir);
  
  // Find computer-optimized chunks (best performance - 29.35% reduction)
  const computerOptimizedChunks = files.filter(file => 
    file.includes('computer-optimized.js')
  );
  
  // Find max-aggression chunks (human-readable fallback - 6.23% reduction)
  const maxAggressionChunks = files.filter(file => 
    file.includes('max-aggression.js') && !file.includes('backup')
  );
  
  // Find original chunks
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
    !file.includes('backup') &&
    !file.includes('.map') &&
    !file.includes('LICENSE')
  );

  if (originalChunks.length === 0) {
    console.log('⚠️  Original chunks not found. Skipping optimization.');
    console.log('✅ Render deployment ready');
    process.exit(0);
  }

  // Determine which optimization to use
  let optimizedChunks = [];
  let optimizationType = '';
  let expectedReduction = '';

  if (computerOptimizedChunks.length > 0) {
    optimizedChunks = computerOptimizedChunks;
    optimizationType = 'computer-optimized';
    expectedReduction = '29.35%';
    console.log('🔥 Using computer-optimized bundles (best performance)');
  } else if (maxAggressionChunks.length > 0) {
    optimizedChunks = maxAggressionChunks;
    optimizationType = 'max-aggression';
    expectedReduction = '6.23%';
    console.log('📊 Using max-aggression bundles (human-readable)');
  } else {
    console.log('⚠️  No optimized chunks found. Running computer optimization...');
    
    try {
      // Run computer optimization automatically
      execSync('npm run optimize:computer', { stdio: 'inherit' });
      
      // Re-scan for optimized files
      const newFiles = fs.readdirSync(buildDir);
      optimizedChunks = newFiles.filter(file => file.includes('computer-optimized.js'));
      optimizationType = 'computer-optimized';
      expectedReduction = '29.35%';
      
      if (optimizedChunks.length === 0) {
        console.log('⚠️  Auto-optimization failed. Using original bundle.');
        console.log('✅ Render deployment ready (using original bundle)');
        process.exit(0);
      }
      
      console.log('✅ Computer optimization completed successfully!');
    } catch (error) {
      console.log('⚠️  Auto-optimization failed. Using original bundle.');
      console.log('✅ Render deployment ready (using original bundle)');
      process.exit(0);
    }
  }

  console.log(`\n📊 Deployment Summary:`);
  console.log(`   Original chunks: ${originalChunks.length}`);
  console.log(`   Optimized chunks: ${optimizedChunks.length} (${optimizationType})`);
  console.log(`   Expected reduction: ${expectedReduction}`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let replacedChunks = 0;

  // Replace each original chunk with its optimized version
  for (const originalChunk of originalChunks) {
    // Find corresponding optimized chunk
    const baseChunkName = originalChunk.replace('.js', '');
    const optimizedChunk = optimizedChunks.find(opt => 
      opt.includes(baseChunkName + '.' + optimizationType + '.js')
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

    // Create backup of original
    const backupPath = originalPath + '.render-backup';
    fs.copyFileSync(originalPath, backupPath);

    // Replace original with optimized
    console.log(`🔄 Replacing ${originalChunk} with ${optimizationType} version...`);
    console.log(`   Size: ${(originalSize / 1024).toFixed(2)} KB → ${(optimizedSize / 1024).toFixed(2)} KB`);
    
    fs.copyFileSync(optimizedPath, originalPath);
    replacedChunks++;
  }

  const totalReduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100;

  console.log('\n🎉 Render Deployment Optimization Complete!');
  console.log('=============================================');
  console.log(`📦 Original total size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`🔥 Optimized total size: ${(totalOptimizedSize / 1024).toFixed(2)} KB`);
  console.log(`📉 Total reduction: ${(totalReduction).toFixed(2)}% (${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(2)} KB saved)`);
  console.log(`🔧 Chunks replaced: ${replacedChunks}`);
  console.log(`🎯 Optimization type: ${optimizationType}`);
  
  // Copy manifest files to build root for debugging
  const manifestSources = [
    '../build/computer-optimization-manifest.json',
    '../build/max-aggression-manifest.json'
  ];
  
  for (const manifestSrc of manifestSources) {
    const manifestPath = path.join(__dirname, manifestSrc);
    if (fs.existsSync(manifestPath)) {
      const manifestDest = path.join(__dirname, '../build/', path.basename(manifestSrc));
      fs.copyFileSync(manifestPath, manifestDest);
      console.log(`📊 Manifest copied: ${path.basename(manifestSrc)}`);
    }
  }

  console.log('\n🚀 Ready for Render deployment!');
  console.log('💡 Optimized bundles are now deployed');
  console.log('🔄 Backup files available for rollback if needed');
  console.log(`🐛 Debug support: ${optimizationType === 'computer-optimized' ? 'Full error translation available' : 'Standard debugging'}`);
  
} catch (error) {
  console.error('❌ Render deployment script failed:', error.message);
  process.exit(1);
}
