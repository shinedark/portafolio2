// scripts/enhanced-baseline.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const jsDir = path.join(buildDir, 'static/js');

// Find the main bundle file (it has a hash in the name)
function findMainBundle() {
  try {
    const jsFiles = fs.readdirSync(jsDir);
    return jsFiles.find(file => file.startsWith('main.') && file.endsWith('.js') && !file.includes('.map') && !file.includes('.enhanced') && !file.includes('.stripped'));
  } catch (error) {
    return null;
  }
}

const mainBundleFile = findMainBundle();
const originalBundle = mainBundleFile ? path.join(jsDir, mainBundleFile) : '';
const strippedBundle = mainBundleFile ? path.join(jsDir, mainBundleFile.replace('.js', '.stripped.js')) : '';
const enhancedBundle = mainBundleFile ? path.join(jsDir, mainBundleFile.replace('.js', '.enhanced.js')) : '';

// The original bundle is the one without any extensions
const actualOriginalBundle = mainBundleFile ? path.join(jsDir, mainBundleFile) : '';


const manifestFile = path.join(buildDir, 'bundle-manifest.json');
const enhancedManifestFile = path.join(buildDir, 'enhanced-bundle-manifest.json');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileSize(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return stats.size;
    }
    return 0;
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error);
    return 0;
  }
}

function analyzeManifest(manifestPath, manifestType) {
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const manifestSize = getFileSize(manifestPath);
    
    if (manifestType === 'enhanced') {
      return {
        size: manifestSize,
        identifiers: Object.keys(manifest.identifiers || {}).length,
        strings: Object.keys(manifest.strings || {}).length,
        numbers: Object.keys(manifest.numbers || {}).length,
        properties: Object.keys(manifest.properties || {}).length,
        imports: Object.keys(manifest.imports || {}).length,
        jsxElements: Object.keys(manifest.jsxElements || {}).length,
        statistics: manifest.statistics || {},
        sampleMappings: {
          identifiers: Object.entries(manifest.identifiers || {}).slice(0, 3),
          strings: Object.entries(manifest.strings || {}).slice(0, 3),
          numbers: Object.entries(manifest.numbers || {}).slice(0, 3)
        }
      };
    } else {
      return {
        size: manifestSize,
        mappings: Object.keys(manifest).length,
        sampleMappings: Object.entries(manifest).slice(0, 5)
      };
    }
  } catch (error) {
    console.error(`Error reading ${manifestType} manifest:`, error);
    return null;
  }
}

function analyzeBundle() {
  console.log('🚀 Enhanced Bundle Analysis Report');
  console.log('==================================\n');
  
  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }
  
  // Check original bundle
  const originalSize = getFileSize(actualOriginalBundle);
  if (originalSize === 0) {
    console.log('❌ Original bundle not found. Run "npm run build" first.');
    return;
  }
  
  console.log(`📦 Original Bundle:`);
  console.log(`   File: ${path.relative(process.cwd(), actualOriginalBundle)}`);
  console.log(`   Size: ${formatBytes(originalSize)}`);
  console.log(`   Size (KB): ${(originalSize / 1024).toFixed(2)} KB\n`);
  
  // Check stripped bundle
  const strippedSize = getFileSize(strippedBundle);
  let strippedReduction = 0;
  let strippedPercentage = 0;
  
  if (strippedSize > 0) {
    strippedReduction = originalSize - strippedSize;
    strippedPercentage = ((strippedReduction / originalSize) * 100);
    
    console.log(`🔧 Basic Stripped Bundle:`);
    console.log(`   File: ${path.relative(process.cwd(), strippedBundle)}`);
    console.log(`   Size: ${formatBytes(strippedSize)}`);
    console.log(`   Size (KB): ${(strippedSize / 1024).toFixed(2)} KB`);
    console.log(`   Reduction: ${formatBytes(strippedReduction)} (${strippedPercentage.toFixed(2)}%)\n`);
  } else {
    console.log('⚠️  Basic stripped bundle not found. Run "npm run postbuild" first.\n');
  }
  
  // Check enhanced bundle
  const enhancedSize = getFileSize(enhancedBundle);
  let enhancedReduction = 0;
  let enhancedPercentage = 0;
  
  if (enhancedSize > 0) {
    enhancedReduction = originalSize - enhancedSize;
    enhancedPercentage = ((enhancedReduction / originalSize) * 100);
    
    console.log(`🚀 Enhanced Optimized Bundle:`);
    console.log(`   File: ${path.relative(process.cwd(), enhancedBundle)}`);
    console.log(`   Size: ${formatBytes(enhancedSize)}`);
    console.log(`   Size (KB): ${(enhancedSize / 1024).toFixed(2)} KB`);
    console.log(`   Reduction: ${formatBytes(enhancedReduction)} (${enhancedPercentage.toFixed(2)}%)\n`);
  } else {
    console.log('⚠️  Enhanced bundle not found. Run "npm run enhanced" first.\n');
  }
  
  // Compare optimizations
  if (strippedSize > 0 && enhancedSize > 0) {
    const enhancedVsStripped = strippedSize - enhancedSize;
    const enhancedVsStrippedPercentage = ((enhancedVsStripped / strippedSize) * 100);
    
    console.log(`📊 Optimization Comparison:`);
    console.log(`   Basic vs Original: ${strippedPercentage.toFixed(2)}% reduction`);
    console.log(`   Enhanced vs Original: ${enhancedPercentage.toFixed(2)}% reduction`);
    console.log(`   Enhanced vs Basic: +${enhancedVsStrippedPercentage.toFixed(2)}% additional reduction`);
    console.log(`   Total additional savings: ${formatBytes(enhancedVsStripped)}\n`);
  }
  
  // Analyze manifests
  console.log(`📋 Manifest Analysis:`);
  
  const basicManifest = analyzeManifest(manifestFile, 'basic');
  if (basicManifest) {
    console.log(`   Basic Manifest:`);
    console.log(`     Size: ${formatBytes(basicManifest.size)}`);
    console.log(`     Mappings: ${basicManifest.mappings}`);
    if (basicManifest.sampleMappings.length > 0) {
      console.log(`     Sample: ${basicManifest.sampleMappings.map(([k, v]) => `${k} → ${v}`).join(', ')}`);
    }
  }
  
  const enhancedManifest = analyzeManifest(enhancedManifestFile, 'enhanced');
  if (enhancedManifest) {
    console.log(`   Enhanced Manifest:`);
    console.log(`     Size: ${formatBytes(enhancedManifest.size)}`);
    console.log(`     Total Optimizations: ${enhancedManifest.identifiers + enhancedManifest.strings + enhancedManifest.numbers + enhancedManifest.properties + enhancedManifest.imports + enhancedManifest.jsxElements}`);
    console.log(`     Breakdown:`);
    console.log(`       🏷️  Identifiers: ${enhancedManifest.identifiers}`);
    console.log(`       📝 Strings: ${enhancedManifest.strings}`);
    console.log(`       🔢 Numbers: ${enhancedManifest.numbers}`);
    console.log(`       🏗️  Properties: ${enhancedManifest.properties}`);
    console.log(`       📤 Imports/Exports: ${enhancedManifest.imports}`);
    console.log(`       ⚛️  JSX Elements: ${enhancedManifest.jsxElements}`);
    
    if (enhancedManifest.statistics.percentageReduction) {
      console.log(`     Statistics: ${enhancedManifest.statistics.percentageReduction.toFixed(2)}% reduction achieved`);
    }
  }
  
  console.log('\n🎯 Recommendations:');
  if (enhancedPercentage > 15) {
    console.log('✅ Exceptional optimization achieved! Enhanced stripper is very effective.');
  } else if (enhancedPercentage > 10) {
    console.log('👍 Great optimization achieved! Enhanced stripper provides significant benefits.');
  } else if (enhancedPercentage > 5) {
    console.log('📈 Good optimization achieved. Enhanced stripper adds value.');
  } else if (enhancedPercentage > 0) {
    console.log('📉 Modest optimization. Consider reviewing optimization patterns.');
  } else {
    console.log('⚠️  No optimization achieved. Check stripper configuration.');
  }
  
  console.log('\n💡 Next steps:');
  console.log('   1. Test the enhanced bundle in a browser');
  console.log('   2. Use "npm run enhanced-dev-server" for error translation');
  console.log('   3. Deploy enhanced bundle for production');
  console.log('   4. Consider implementing tree-shaking and dead code elimination');
}

// Main execution
try {
  analyzeBundle();
} catch (error) {
  console.error('❌ Error during enhanced bundle analysis:', error);
  process.exit(1);
}
