const { SemanticMinifier } = require('../packages/semantic-minifier-core/dist');
const fs = require('fs');
const path = require('path');

/**
 * Production Build Script with Semantic Minification
 * 
 * This script applies semantic minification to the production build
 * and generates the optimization manifest for deployment.
 */

console.log('🚀 Starting production build with semantic minification...');

// Production configuration
const productionConfig = {
  identifierOptimization: {
    enabled: true,
    maxLength: 3,
    preserveExports: true,
    preserveImports: true,
    preserveReactComponents: true,
    preserveHookNames: true
  },
  stringOptimization: {
    enabled: true,
    minLength: 10,
    hoistThreshold: 3
  },
  numberOptimization: {
    enabled: true,
    minValue: 1000,
    hoistThreshold: 2
  },
  safety: {
    maxOptimizationPercentage: 25,
    preserveCriticalPatterns: [
      'constructor', 'prototype', 'super', 'this', 'render'
    ]
  }
};

// Create minifier instance
const minifier = new SemanticMinifier(productionConfig);

// Process build directory
const buildDir = path.join(__dirname, 'build');
const staticJsDir = path.join(buildDir, 'static/js');

if (!fs.existsSync(staticJsDir)) {
  console.error('❌ Build directory not found. Run npm run build first.');
  process.exit(1);
}

console.log('📁 Processing build files...');

// Find all JavaScript files
const jsFiles = fs.readdirSync(staticJsDir).filter(file => file.endsWith('.js'));
let totalOriginalSize = 0;
let totalOptimizedSize = 0;
let totalOptimizations = 0;

jsFiles.forEach(file => {
  const filePath = path.join(staticJsDir, file);
  const originalCode = fs.readFileSync(filePath, 'utf-8');
  const originalSize = originalCode.length;
  
  try {
    // Apply semantic minification
    const result = minifier.minifySource(originalCode, file, {
      filename: file,
      isModule: true,
      hasJSX: true,
      hasTypeScript: false
    });
    
    // Write optimized code
    const optimizedPath = filePath.replace('.js', '.semantic-optimized.js');
    fs.writeFileSync(optimizedPath, result.optimizedCode);
    
    // Update statistics
    totalOriginalSize += originalSize;
    totalOptimizedSize += result.optimizedCode.length;
    totalOptimizations += result.stats.optimizations;
    
    console.log(`✅ ${file}: ${(originalSize / 1024).toFixed(2)} KB → ${(result.optimizedCode.length / 1024).toFixed(2)} KB (${result.stats.reduction.toFixed(2)}% reduction)`);
    
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

// Calculate overall results
const totalReduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100;

console.log('\n📊 PRODUCTION BUILD RESULTS:');
console.log('============================');
console.log(`📁 Files processed: ${jsFiles.length}`);
console.log(`📏 Total original size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
console.log(`📏 Total optimized size: ${(totalOptimizedSize / 1024).toFixed(2)} KB`);
console.log(`📉 Total reduction: ${totalReduction.toFixed(2)}%`);
console.log(`🔧 Total optimizations: ${totalOptimizations}`);

// Save production manifest
const manifest = minifier.getManifest();
const manifestPath = path.join(__dirname, 'production-optimization-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\n💾 Production manifest saved to: ${manifestPath}`);
console.log('🚀 Production build with semantic minification completed!');
console.log('\n📋 Next steps:');
console.log('1. Deploy the optimized .semantic-optimized.js files');
console.log('2. Use the production manifest for error translation');
console.log('3. Monitor performance improvements in production');
