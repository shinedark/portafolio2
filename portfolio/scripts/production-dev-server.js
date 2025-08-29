// scripts/production-dev-server.js
// PRODUCTION-READY: Safe error translation server for production bundles
// This server handles production-optimized stack traces with safety checks

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3003;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// CORS middleware for production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

let productionManifest = {};
let basicManifest = {};

// Function to load manifests safely
function loadManifests() {
  try {
    const productionManifestPath = path.join(__dirname, '../build/production-manifest.json');
    const basicManifestPath = path.join(__dirname, '../build/bundle-manifest.json');
    
    if (fs.existsSync(productionManifestPath)) {
      productionManifest = JSON.parse(fs.readFileSync(productionManifestPath, 'utf-8'));
      const optCount = Object.keys(productionManifest.optimizations?.identifiers || {}).length;
      console.log(`✅ Production manifest loaded with ${optCount} safe optimizations`);
      
      // Validate manifest integrity
      if (!productionManifest.validation?.passed) {
        console.warn('⚠️  Production manifest validation failed - use with caution');
      }
    } else {
      console.log('⚠️  Production manifest not found. Run production stripper first.');
    }
    
    if (fs.existsSync(basicManifestPath)) {
      basicManifest = JSON.parse(fs.readFileSync(basicManifestPath, 'utf-8'));
      console.log(`✅ Basic manifest loaded with ${Object.keys(basicManifest).length} mappings`);
    } else {
      console.log('⚠️  Basic manifest not found. Run basic stripper first.');
    }
  } catch (error) {
    console.error('Error loading manifests:', error);
  }
}

// Load manifests on startup
loadManifests();

// Production-safe error translation endpoint
app.post('/translate-error', (req, res) => {
  try {
    const { stack, useProduction = true } = req.body;
    
    if (!stack) {
      return res.status(400).json({ error: 'Stack trace is required' });
    }
    
    let translatedStack = stack;
    let translations = [];
    let manifestUsed = useProduction ? 'production' : 'basic';
    let safetyLevel = 'safe';
    
    if (useProduction && productionManifest.optimizations?.identifiers) {
      // Use production manifest for translation
      const manifest = productionManifest.optimizations.identifiers;
      
      Object.keys(manifest).forEach((minified) => {
        const original = manifest[minified].original;
        const context = manifest[minified].context;
        
        // Only translate if it's a safe optimization
        if (context !== 'import' && context !== 'export') {
          const regex = new RegExp(`\\b${minified}\\b`, 'g');
          if (regex.test(translatedStack)) {
            translatedStack = translatedStack.replace(regex, original);
            translations.push({ 
              minified, 
              original, 
              context,
              type: 'production-safe'
            });
          }
        }
      });
      
      // Check if validation passed
      if (productionManifest.validation?.passed) {
        safetyLevel = 'validated';
      } else {
        safetyLevel = 'unvalidated';
      }
      
    } else if (basicManifest && Object.keys(basicManifest).length > 0) {
      // Fallback to basic manifest
      Object.keys(basicManifest).forEach((minified) => {
        const original = basicManifest[minified];
        const regex = new RegExp(`\\b${minified}\\b`, 'g');
        if (regex.test(translatedStack)) {
          translatedStack = translatedStack.replace(regex, original);
          translations.push({ 
            minified, 
            original, 
            context: 'basic',
            type: 'basic'
          });
        }
      });
      safetyLevel = 'basic';
    }
    
    res.json({ 
      originalStack: stack,
      translatedStack,
      translations,
      manifestUsed,
      safetyLevel,
      productionManifestSize: Object.keys(productionManifest.optimizations?.identifiers || {}).length,
      basicManifestSize: Object.keys(basicManifest).length,
      validationStatus: productionManifest.validation?.passed || false
    });
    
  } catch (error) {
    console.error('Error translating stack trace:', error);
    res.status(500).json({ error: 'Failed to translate stack trace' });
  }
});

// Endpoint to reload manifests
app.post('/reload-manifests', (req, res) => {
  loadManifests();
  res.json({ 
    message: 'Manifests reloaded',
    productionManifestSize: Object.keys(productionManifest.optimizations?.identifiers || {}).length,
    basicManifestSize: Object.keys(basicManifest).length,
    productionValidation: productionManifest.validation?.passed || false
  });
});

// Production manifest info endpoint
app.get('/production-info', (req, res) => {
  if (!productionManifest.optimizations) {
    return res.status(404).json({ error: 'Production manifest not found' });
  }
  
  const stats = productionManifest.statistics || {};
  const validation = productionManifest.validation || {};
  
  res.json({
    version: productionManifest.version,
    timestamp: productionManifest.timestamp,
    validation: {
      passed: validation.passed,
      issues: validation.issues,
      reduction: validation.reduction
    },
    statistics: {
      originalSize: stats.originalSize,
      optimizedSize: stats.optimizedSize,
      totalReduction: stats.totalReduction,
      percentageReduction: stats.percentageReduction,
      totalOptimizations: stats.totalOptimizations
    },
    optimizations: {
      total: Object.keys(productionManifest.optimizations.identifiers).length,
      byContext: Object.values(productionManifest.optimizations.identifiers).reduce((acc, opt) => {
        acc[opt.context] = (acc[opt.context] || 0) + 1;
        return acc;
      }, {}),
      sample: Object.entries(productionManifest.optimizations.identifiers).slice(0, 10)
    },
    config: {
      maxOptimizationPercentage: productionManifest.config?.maxOptimizationPercentage,
      protectedIdentifiers: productionManifest.config?.protectedIdentifiers?.length
    }
  });
});

// Bundle comparison endpoint
app.get('/bundle-comparison', (req, res) => {
  try {
    const buildDir = path.join(__dirname, '../build');
    const jsDir = path.join(buildDir, 'static/js');
    
    const jsFiles = fs.readdirSync(jsDir);
    const mainBundleFile = jsFiles.find(file => 
      file.startsWith('main.') && 
      file.endsWith('.js') && 
      !file.includes('.map') && 
      !file.includes('.stripped') && 
      !file.includes('.enhanced')
    );
    
    if (!mainBundleFile) {
      return res.status(404).json({ error: 'No main bundle found' });
    }
    
    const originalBundle = path.join(jsDir, mainBundleFile);
    const strippedBundle = path.join(jsDir, mainBundleFile.replace('.js', '.stripped.js'));
    const productionBundle = path.join(jsDir, mainBundleFile.replace('.js', '.production.js'));
    
    const originalSize = fs.existsSync(originalBundle) ? fs.statSync(originalBundle).size : 0;
    const strippedSize = fs.existsSync(strippedBundle) ? fs.statSync(strippedBundle).size : 0;
    const productionSize = fs.existsSync(productionBundle) ? fs.statSync(productionBundle).size : 0;
    
    res.json({
      bundles: {
        original: { size: originalSize, file: mainBundleFile, status: 'source' },
        stripped: { size: strippedSize, file: mainBundleFile.replace('.js', '.stripped.js'), status: 'basic-optimized' },
        production: { size: productionSize, file: mainBundleFile.replace('.js', '.production.js'), status: 'production-ready' }
      },
      reductions: {
        basic: originalSize > 0 ? ((originalSize - strippedSize) / originalSize * 100) : 0,
        production: originalSize > 0 ? ((originalSize - productionSize) / originalSize * 100) : 0,
        productionVsBasic: strippedSize > 0 ? ((strippedSize - productionSize) / strippedSize * 100) : 0
      },
      recommendations: {
        development: 'Use original bundle for development',
        staging: 'Use stripped bundle for testing',
        production: 'Use production bundle for deployment'
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bundle comparison' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    productionManifestLoaded: Object.keys(productionManifest.optimizations?.identifiers || {}).length > 0,
    basicManifestLoaded: Object.keys(basicManifest).length > 0,
    productionValidation: productionManifest.validation?.passed || false,
    timestamp: new Date().toISOString()
  });
});

// Rollback endpoint (for emergency use)
app.post('/rollback', (req, res) => {
  try {
    const buildDir = path.join(__dirname, '../build');
    const jsDir = path.join(buildDir, 'static/js');
    
    const jsFiles = fs.readdirSync(jsDir);
    const mainBundleFile = jsFiles.find(file => 
      file.startsWith('main.') && 
      file.endsWith('.js') && 
      !file.includes('.map') && 
      !file.includes('.stripped') && 
      !file.includes('.enhanced')
    );
    
    if (!mainBundleFile) {
      return res.status(404).json({ error: 'No main bundle found' });
    }
    
    const originalBundle = path.join(jsDir, mainBundleFile);
    const backupFile = originalBundle + '.backup';
    
    if (fs.existsSync(backupFile)) {
      fs.copyFileSync(backupFile, originalBundle);
      res.json({ 
        message: 'Rollback successful',
        restored: path.relative(process.cwd(), originalBundle),
        backup: path.relative(process.cwd(), backupFile)
      });
    } else {
      res.status(404).json({ error: 'Backup file not found' });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Rollback failed' });
  }
});

app.listen(port, () => {
  console.log(`🏭 Production Dev Server running at http://localhost:${port}`);
  console.log(`📁 Production manifest status: ${Object.keys(productionManifest.optimizations?.identifiers || {}).length > 0 ? 'Loaded' : 'Not found'}`);
  console.log(`📁 Basic manifest status: ${Object.keys(basicManifest).length > 0 ? 'Loaded' : 'Not found'}`);
  console.log(`✅ Production validation: ${productionManifest.validation?.passed ? 'PASSED' : 'NOT VALIDATED'}`);
  console.log(`🔧 Available endpoints:`);
  console.log(`   POST /translate-error - Translate production-optimized stack traces`);
  console.log(`   POST /reload-manifests - Reload manifests`);
  console.log(`   GET  /production-info - Get production manifest information`);
  console.log(`   GET  /bundle-comparison - Compare all bundle versions`);
  console.log(`   POST /rollback - Emergency rollback to backup`);
  console.log(`   GET  /health - Health check`);
  console.log(`📖 Static files served from: ${path.join(__dirname, '../build')}`);
});
