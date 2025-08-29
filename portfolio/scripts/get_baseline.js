// scripts/get_baseline.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const jsDir = path.join(buildDir, 'static/js');

// Find the main bundle file (it has a hash in the name)
function findMainBundle() {
  try {
    const jsFiles = fs.readdirSync(jsDir);
    return jsFiles.find(file => file.startsWith('main.') && file.endsWith('.js') && !file.includes('.map'));
  } catch (error) {
    return null;
  }
}

const mainBundleFile = findMainBundle();
const originalBundle = mainBundleFile ? path.join(jsDir, mainBundleFile) : '';
const strippedBundle = mainBundleFile ? path.join(jsDir, mainBundleFile.replace('.js', '.stripped.js')) : '';
const manifestFile = path.join(buildDir, 'bundle-manifest.json');

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

function analyzeBundle() {
  console.log('📊 Bundle Analysis Report');
  console.log('========================\n');
  
  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }
  
  // Check original bundle
  const originalSize = getFileSize(originalBundle);
  if (originalSize === 0) {
    console.log('❌ Original bundle not found. Run "npm run build" first.');
    return;
  }
  
  console.log(`📦 Original Bundle:`);
  console.log(`   File: ${path.relative(process.cwd(), originalBundle)}`);
  console.log(`   Size: ${formatBytes(originalSize)}`);
  console.log(`   Size (KB): ${(originalSize / 1024).toFixed(2)} KB\n`);
  
  // Check stripped bundle
  const strippedSize = getFileSize(strippedBundle);
  if (strippedSize === 0) {
    console.log('⚠️  Stripped bundle not found. Run "npm run postbuild" first.\n');
    console.log('💡 To generate the stripped bundle:');
    console.log('   1. npm run build');
    console.log('   2. npm run postbuild');
    return;
  }
  
  console.log(`🔧 Stripped Bundle:`);
  console.log(`   File: ${path.relative(process.cwd(), strippedBundle)}`);
  console.log(`   Size: ${formatBytes(strippedSize)}`);
  console.log(`   Size (KB): ${(strippedSize / 1024).toFixed(2)} KB\n`);
  
  // Calculate savings
  const sizeReduction = originalSize - strippedSize;
  const percentageReduction = ((sizeReduction / originalSize) * 100);
  
  console.log(`📈 Size Reduction:`);
  console.log(`   Absolute: ${formatBytes(sizeReduction)}`);
  console.log(`   Percentage: ${percentageReduction.toFixed(2)}%\n`);
  
  // Check manifest
  if (fs.existsSync(manifestFile)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
      const manifestSize = getFileSize(manifestFile);
      
      console.log(`📋 Bundle Manifest:`);
      console.log(`   File: ${path.relative(process.cwd(), manifestFile)}`);
      console.log(`   Size: ${formatBytes(manifestSize)}`);
      console.log(`   Mappings: ${Object.keys(manifest).length}`);
      
      if (Object.keys(manifest).length > 0) {
        console.log(`   Sample mappings:`);
        Object.entries(manifest).slice(0, 5).forEach(([minified, original]) => {
          console.log(`     ${minified} → ${original}`);
        });
        if (Object.keys(manifest).length > 5) {
          console.log(`     ... and ${Object.keys(manifest).length - 5} more`);
        }
      }
    } catch (error) {
      console.error('Error reading manifest:', error);
    }
  } else {
    console.log('❌ Bundle manifest not found.');
  }
  
  console.log('\n🎯 Recommendations:');
  if (percentageReduction > 10) {
    console.log('✅ Excellent size reduction achieved!');
  } else if (percentageReduction > 5) {
    console.log('👍 Good size reduction achieved.');
  } else if (percentageReduction > 0) {
    console.log('📉 Modest size reduction. Consider reviewing stripping patterns.');
  } else {
    console.log('⚠️  No size reduction. Check stripper configuration.');
  }
  
  console.log('\n💡 Next steps:');
  console.log('   1. Test the stripped bundle in a browser');
  console.log('   2. Use "npm run dev-server" for error translation');
  console.log('   3. Deploy build.stripped.js for production');
}

// Main execution
try {
  analyzeBundle();
} catch (error) {
  console.error('❌ Error during bundle analysis:', error);
  process.exit(1);
}
