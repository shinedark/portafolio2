#!/usr/bin/env node

/**
 * Ultra-Aggressive Baseline Measurement
 * Measures bundle sizes before and after ultra-aggressive optimization across all chunks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findAllChunks() {
  const buildDir = path.join(__dirname, '../build/static/js');
  
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory not found. Run "npm run build" first.');
  }
  
  const files = fs.readdirSync(buildDir);
  
  // Find original chunks
  const originalChunks = files.filter(file => 
    file.endsWith('.js') && 
    !file.includes('enhanced-max-aggression') &&
    !file.includes('ultra-aggressive') &&
    !file.includes('stripped') &&
    !file.includes('production') &&
    !file.includes('aggressive') &&
    !file.includes('selective') &&
    !file.includes('ultra-deep') &&
    !file.includes('max-aggression')
  );

  // Find ultra-aggressive chunks
  const ultraChunks = files.filter(file => 
    file.includes('ultra-aggressive.js')
  );

  return { originalChunks, ultraChunks };
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

function analyzeUltraManifest() {
  const buildDir = path.join(__dirname, '../build');
  const manifestPath = path.join(buildDir, 'ultra-aggressive-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('⚠️  Ultra-aggressive manifest not found');
    return null;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const manifestSize = JSON.stringify(manifest).length;
    
    console.log('\n📊 Ultra-Aggressive Manifest Analysis:');
    console.log(`   Manifest size: ${formatSize(manifestSize)}`);
    console.log(`   Version: ${manifest.version}`);
    console.log(`   Timestamp: ${manifest.timestamp}`);
    
    if (manifest.stats) {
      console.log(`   Total optimizations: ${manifest.stats.totalOptimizations}`);
      console.log(`   Chunks processed: ${manifest.stats.chunkCount}`);
      console.log(`   Total original size: ${formatSize(manifest.stats.totalOriginalSize)}`);
      console.log(`   Total optimized size: ${formatSize(manifest.stats.totalOptimizedSize)}`);
    }
    
    if (manifest.optimizations && manifest.optimizations.categories) {
      console.log('\n🏷️  Identifier Categories:');
      for (const [category, identifiers] of Object.entries(manifest.optimizations.categories)) {
        const count = Object.keys(identifiers).length;
        console.log(`   ${category}: ${count} identifiers`);
      }
    }

    if (manifest.chunks) {
      console.log('\n📦 Per-Chunk Results:');
      for (const [chunkName, chunkData] of Object.entries(manifest.chunks)) {
        console.log(`   ${chunkName}:`);
        console.log(`     Original: ${formatSize(chunkData.originalSize)}`);
        console.log(`     Optimized: ${formatSize(chunkData.optimizedSize)}`);
        console.log(`     Reduction: ${chunkData.reduction.toFixed(2)}%`);
        console.log(`     Optimizations: ${chunkData.optimizations}`);
      }
    }
    
    return manifest;
  } catch (error) {
    console.error('❌ Error analyzing ultra-aggressive manifest:', error.message);
    return null;
  }
}

function runUltraAggressiveBaseline() {
  console.log('📊 Ultra-Aggressive Baseline Measurement');
  console.log('=' .repeat(70));
  
  try {
    // Check if build exists
    const { originalChunks, ultraChunks } = findAllChunks();
    
    console.log(`📦 Found ${originalChunks.length} original chunks:`);
    originalChunks.forEach(chunk => console.log(`   - ${chunk}`));
    
    // Calculate total original size
    const buildDir = path.join(__dirname, '../build/static/js');
    let totalOriginalSize = 0;
    
    for (const chunk of originalChunks) {
      const chunkPath = path.join(buildDir, chunk);
      totalOriginalSize += getFileSize(chunkPath);
    }
    
    console.log(`📏 Total original size: ${formatSize(totalOriginalSize)}`);
    
    // Check if ultra-aggressive optimization has been run
    let totalOptimizedSize = 0;
    
    if (ultraChunks.length === 0) {
      console.log('\n⚠️  Ultra-aggressive optimization not found. Running now...');
      
      try {
        execSync('npm run ultra-aggressive', { 
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
        
        // Re-scan for ultra chunks
        const { ultraChunks: newUltraChunks } = findAllChunks();
        
        for (const chunk of newUltraChunks) {
          const chunkPath = path.join(buildDir, chunk);
          totalOptimizedSize += getFileSize(chunkPath);
        }
        
        console.log(`\n✅ Ultra-aggressive optimization complete!`);
        console.log(`📦 Generated ${newUltraChunks.length} optimized chunks`);
        
      } catch (optimizationError) {
        console.error('❌ Ultra-aggressive optimization failed:', optimizationError.message);
        return;
      }
    } else {
      console.log(`\n🚀 Found ${ultraChunks.length} ultra-aggressive chunks:`);
      ultraChunks.forEach(chunk => console.log(`   - ${chunk}`));
      
      for (const chunk of ultraChunks) {
        const chunkPath = path.join(buildDir, chunk);
        totalOptimizedSize += getFileSize(chunkPath);
      }
    }
    
    console.log(`📏 Total optimized size: ${formatSize(totalOptimizedSize)}`);
    
    // Calculate and display results
    const { reduction, reductionPercent } = calculateReduction(totalOriginalSize, totalOptimizedSize);
    
    console.log('\n📊 Ultra-Aggressive Results:');
    console.log(`   Total original size: ${formatSize(totalOriginalSize)}`);
    console.log(`   Total optimized size: ${formatSize(totalOptimizedSize)}`);
    console.log(`   Total reduction: ${formatSize(reduction)} (${reductionPercent}%)`);
    
    // Analyze the manifest
    const manifest = analyzeUltraManifest();
    
    // Performance assessment
    console.log('\n🎯 Performance Assessment:');
    if (reductionPercent >= 25) {
      console.log('   🚀 INCREDIBLE: 25%+ reduction achieved across all chunks!');
    } else if (reductionPercent >= 20) {
      console.log('   🎯 EXCELLENT: 20%+ reduction achieved!');
    } else if (reductionPercent >= 15) {
      console.log('   ✅ GREAT: 15%+ reduction achieved!');
    } else if (reductionPercent >= 10) {
      console.log('   👍 GOOD: 10%+ reduction achieved!');
    } else if (reductionPercent >= 5) {
      console.log('   📈 MODERATE: 5%+ reduction achieved!');
    } else {
      console.log('   ⚠️  LOW: Less than 5% reduction');
    }
    
    // Comparison with other strippers
    console.log('\n🔄 Comparison with Other Strippers:');
    console.log('   Basic stripper: ~5-10% reduction (single chunk)');
    console.log('   Enhanced stripper: ~10-15% reduction (single chunk)');
    console.log('   Maximum aggression: ~14-17% reduction (single chunk)');
    console.log('   Enhanced max-aggression: ~5-10% reduction (single chunk, safe)');
    console.log('   Ultra-aggressive: Target 15%+ reduction (ALL chunks + React libs)');
    
    // Cross-chunk benefits
    console.log('\n🔗 Cross-Chunk Optimization Benefits:');
    console.log('   - Shared identifier mappings across chunks');
    console.log('   - Optimized React library code');
    console.log('   - Consistent variable names for better gzip compression');
    console.log('   - Reduced total bundle size (all chunks combined)');
    
    if (reductionPercent >= 15) {
      console.log('\n🎉 SUCCESS: Ultra-aggressive achieved excellent cross-chunk optimization!');
    } else if (reductionPercent >= 10) {
      console.log('\n👍 GOOD: Ultra-aggressive achieved solid cross-chunk optimization!');
    } else {
      console.log('\n💡 TIP: Consider adjusting ultra-aggressive parameters for better results');
    }
    
    // Deployment recommendation
    console.log('\n🚀 Deployment Recommendation:');
    if (reductionPercent >= 15) {
      console.log('   ✅ RECOMMENDED: Use ultra-aggressive optimization for production');
      console.log('   📦 Deploy all .ultra-aggressive.js files');
      console.log('   🔧 Update render-post-build.js to use ultra-aggressive');
    } else if (reductionPercent >= 10) {
      console.log('   ⚖️  CONSIDER: Ultra-aggressive provides good optimization');
      console.log('   🧪 Test thoroughly before production deployment');
    } else {
      console.log('   ⚠️  CAUTION: Consider using max-aggression instead');
      console.log('   📊 Ultra-aggressive may not provide sufficient benefit');
    }
    
  } catch (error) {
    console.error('❌ Ultra-aggressive baseline measurement failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Run "npm run build" first');
    console.log('   2. Ensure all dependencies are installed');
    console.log('   3. Check build directory exists');
    console.log('   4. Verify chunks are not already optimized');
  }
}

// Run the baseline measurement
if (require.main === module) {
  runUltraAggressiveBaseline();
}

module.exports = { runUltraAggressiveBaseline };
