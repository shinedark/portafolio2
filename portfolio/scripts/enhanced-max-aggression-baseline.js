#!/usr/bin/env node

/**
 * Enhanced Maximum Aggression Baseline Measurement
 * Measures bundle sizes before and after enhanced optimization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findMainBundle() {
  const buildDir = path.join(__dirname, '../build/static/js');
  
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory not found. Run "npm run build" first.');
  }
  
  const files = fs.readdirSync(buildDir);
  
  // Find the original main bundle (exclude all optimized versions)
  const mainBundle = files.find(file => 
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

  if (!mainBundle) {
    throw new Error('Main bundle not found in build directory');
  }

  return mainBundle;
}

function findEnhancedBundle() {
  const buildDir = path.join(__dirname, '../build/static/js');
  const files = fs.readdirSync(buildDir);
  
  const enhancedBundle = files.find(file => 
    file.includes('enhanced-max-aggression.js')
  );

  if (!enhancedBundle) {
    throw new Error('Enhanced max-aggression bundle not found. Run "npm run enhanced-max-aggression" first.');
  }

  return enhancedBundle;
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${bytes} bytes`;
  }
}

function calculateReduction(originalSize, optimizedSize) {
  const reduction = originalSize - optimizedSize;
  const reductionPercent = ((reduction / originalSize) * 100).toFixed(2);
  return { reduction, reductionPercent };
}

function analyzeManifest() {
  const buildDir = path.join(__dirname, '../build');
  const manifestPath = path.join(buildDir, 'enhanced-max-aggression-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('⚠️  Enhanced max-aggression manifest not found');
    return null;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const manifestSize = JSON.stringify(manifest).length;
    
    console.log('\n📊 Manifest Analysis:');
    console.log(`   Manifest size: ${formatSize(manifestSize)}`);
    console.log(`   Version: ${manifest.version}`);
    console.log(`   Timestamp: ${manifest.timestamp}`);
    
    if (manifest.stats) {
      console.log(`   Total optimizations: ${manifest.stats.totalOptimizations}`);
      console.log(`   Identifier count: ${manifest.stats.identifierCount}`);
      console.log(`   String count: ${manifest.stats.stringCount}`);
      console.log(`   Number count: ${manifest.stats.numberCount}`);
    }
    
    if (manifest.optimizations && manifest.optimizations.categories) {
      console.log('\n🏷️  Identifier Categories:');
      for (const [category, identifiers] of Object.entries(manifest.optimizations.categories)) {
        const count = Object.keys(identifiers).length;
        console.log(`   ${category}: ${count} identifiers`);
      }
    }
    
    return manifest;
  } catch (error) {
    console.error('❌ Error analyzing manifest:', error.message);
    return null;
  }
}

function runEnhancedMaxAggressionBaseline() {
  console.log('📊 Enhanced Maximum Aggression Baseline Measurement');
  console.log('=' .repeat(60));
  
  try {
    // Check if build exists
    const mainBundle = findMainBundle();
    const mainBundlePath = path.join(__dirname, '../build/static/js', mainBundle);
    
    console.log(`📦 Original bundle: ${mainBundle}`);
    const originalSize = getFileSize(mainBundlePath);
    console.log(`📏 Original size: ${formatSize(originalSize)}`);
    
    // Check if enhanced optimization has been run
    let enhancedBundle = null;
    let optimizedSize = null;
    
    try {
      enhancedBundle = findEnhancedBundle();
      const enhancedBundlePath = path.join(__dirname, '../build/static/js', enhancedBundle);
      optimizedSize = getFileSize(enhancedBundlePath);
      
      console.log(`\n🚀 Enhanced bundle: ${enhancedBundle}`);
      console.log(`📏 Optimized size: ${formatSize(optimizedSize)}`);
      
    } catch (error) {
      console.log('\n⚠️  Enhanced optimization not found. Running now...');
      
      try {
        execSync('npm run enhanced-max-aggression', { 
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
        
        // Try to find the bundle again
        enhancedBundle = findEnhancedBundle();
        const enhancedBundlePath = path.join(__dirname, '../build/static/js', enhancedBundle);
        optimizedSize = getFileSize(enhancedBundlePath);
        
        console.log(`\n✅ Enhanced optimization complete!`);
        console.log(`📦 Enhanced bundle: ${enhancedBundle}`);
        console.log(`📏 Optimized size: ${formatSize(optimizedSize)}`);
        
      } catch (optimizationError) {
        console.error('❌ Enhanced optimization failed:', optimizationError.message);
        return;
      }
    }
    
    // Calculate and display results
    const { reduction, reductionPercent } = calculateReduction(originalSize, optimizedSize);
    
    console.log('\n📊 Results:');
    console.log(`   Original size: ${formatSize(originalSize)}`);
    console.log(`   Optimized size: ${formatSize(optimizedSize)}`);
    console.log(`   Reduction: ${formatSize(reduction)} (${reductionPercent}%)`);
    
    // Analyze the manifest
    const manifest = analyzeManifest();
    
    // Performance assessment
    console.log('\n🎯 Performance Assessment:');
    if (reductionPercent >= 20) {
      console.log('   🚀 EXCELLENT: 20%+ reduction achieved!');
    } else if (reductionPercent >= 15) {
      console.log('   ✅ GREAT: 15%+ reduction achieved!');
    } else if (reductionPercent >= 10) {
      console.log('   👍 GOOD: 10%+ reduction achieved!');
    } else if (reductionPercent >= 5) {
      console.log('   📈 MODERATE: 5%+ reduction achieved!');
    } else {
      console.log('   ⚠️  LOW: Less than 5% reduction');
    }
    
    // Comparison with previous strippers
    console.log('\n🔄 Comparison with Previous Strippers:');
    console.log('   Basic stripper: ~5-10% reduction');
    console.log('   Enhanced stripper: ~10-15% reduction');
    console.log('   Maximum aggression: ~14-17% reduction');
    console.log('   Enhanced max-aggression: Target 20%+ reduction');
    
    if (reductionPercent >= 20) {
      console.log('\n🎉 SUCCESS: Enhanced max-aggression achieved target reduction!');
    } else {
      console.log('\n💡 TIP: Consider adjusting optimization parameters for better results');
    }
    
  } catch (error) {
    console.error('❌ Enhanced baseline measurement failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Run "npm run build" first');
    console.log('   2. Ensure all dependencies are installed');
    console.log('   3. Check build directory exists');
  }
}

// Run the baseline measurement
if (require.main === module) {
  runEnhancedMaxAggressionBaseline();
}

module.exports = { runEnhancedMaxAggressionBaseline };
