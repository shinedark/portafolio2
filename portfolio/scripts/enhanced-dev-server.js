// scripts/enhanced-dev-server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3002;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

let enhancedManifest = {};
let basicManifest = {};

// Function to load manifests
function loadManifests() {
  try {
    const enhancedManifestPath = path.join(__dirname, '../build/enhanced-bundle-manifest.json');
    const basicManifestPath = path.join(__dirname, '../build/bundle-manifest.json');
    
    if (fs.existsSync(enhancedManifestPath)) {
      enhancedManifest = JSON.parse(fs.readFileSync(enhancedManifestPath, 'utf-8'));
      console.log(`✅ Enhanced manifest loaded with ${Object.keys(enhancedManifest.identifiers || {}).length} identifiers, ${Object.keys(enhancedManifest.strings || {}).length} strings, ${Object.keys(enhancedManifest.numbers || {}).length} numbers`);
    } else {
      console.log('⚠️  Enhanced manifest not found. Run enhanced stripper first.');
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

// Enhanced error translation endpoint
app.post('/translate-error', (req, res) => {
  try {
    const { stack, useEnhanced = true } = req.body;
    
    if (!stack) {
      return res.status(400).json({ error: 'Stack trace is required' });
    }
    
    let translatedStack = stack;
    let translations = [];
    let manifestUsed = useEnhanced ? 'enhanced' : 'basic';
    
    if (useEnhanced && enhancedManifest.identifiers) {
      // Translate enhanced optimizations
      const allMappings = {
        ...enhancedManifest.identifiers,
        ...enhancedManifest.strings,
        ...enhancedManifest.numbers,
        ...enhancedManifest.properties,
        ...enhancedManifest.imports,
        ...enhancedManifest.jsxElements
      };
      
      Object.keys(allMappings).forEach((minified) => {
        const original = allMappings[minified];
        const regex = new RegExp(`\\b${minified}\\b`, 'g');
        if (regex.test(translatedStack)) {
          translatedStack = translatedStack.replace(regex, original);
          translations.push({ minified, original, type: 'enhanced' });
        }
      });
    } else if (basicManifest && Object.keys(basicManifest).length > 0) {
      // Translate basic optimizations
      Object.keys(basicManifest).forEach((minified) => {
        const original = basicManifest[minified];
        const regex = new RegExp(`\\b${minified}\\b`, 'g');
        if (regex.test(translatedStack)) {
          translatedStack = translatedStack.replace(regex, original);
          translations.push({ minified, original, type: 'basic' });
        }
      });
    }
    
    res.json({ 
      originalStack: stack,
      translatedStack,
      translations,
      manifestUsed,
      enhancedManifestSize: Object.keys(enhancedManifest.identifiers || {}).length,
      basicManifestSize: Object.keys(basicManifest).length
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
    enhancedManifestSize: Object.keys(enhancedManifest.identifiers || {}).length,
    basicManifestSize: Object.keys(basicManifest).length
  });
});

// Endpoint to get comprehensive manifest info
app.get('/manifest-info', (req, res) => {
  const enhancedStats = enhancedManifest.statistics || {};
  
  res.json({
    enhanced: {
      hasManifest: Object.keys(enhancedManifest.identifiers || {}).length > 0,
      identifiers: Object.keys(enhancedManifest.identifiers || {}).length,
      strings: Object.keys(enhancedManifest.strings || {}).length,
      numbers: Object.keys(enhancedManifest.numbers || {}).length,
      properties: Object.keys(enhancedManifest.properties || {}).length,
      imports: Object.keys(enhancedManifest.imports || {}).length,
      jsxElements: Object.keys(enhancedManifest.jsxElements || {}).length,
      totalOptimizations: Object.keys(enhancedManifest.identifiers || {}).length + 
                          Object.keys(enhancedManifest.strings || {}).length + 
                          Object.keys(enhancedManifest.numbers || {}).length + 
                          Object.keys(enhancedManifest.properties || {}).length + 
                          Object.keys(enhancedManifest.imports || {}).length + 
                          Object.keys(enhancedManifest.jsxElements || {}).length,
      statistics: enhancedStats
    },
    basic: {
      hasManifest: Object.keys(basicManifest).length > 0,
      mappings: Object.keys(basicManifest).length
    },
    sampleMappings: {
      enhanced: {
        identifiers: Object.entries(enhancedManifest.identifiers || {}).slice(0, 3),
        strings: Object.entries(enhancedManifest.strings || {}).slice(0, 3),
        numbers: Object.entries(enhancedManifest.numbers || {}).slice(0, 3)
      },
      basic: Object.entries(basicManifest).slice(0, 5)
    }
  });
});

// Endpoint to get specific optimization type info
app.get('/optimization-info/:type', (req, res) => {
  const { type } = req.params;
  
  if (type === 'identifiers' && enhancedManifest.identifiers) {
    res.json({
      type: 'identifiers',
      count: Object.keys(enhancedManifest.identifiers).length,
      sample: Object.entries(enhancedManifest.identifiers).slice(0, 10)
    });
  } else if (type === 'strings' && enhancedManifest.strings) {
    res.json({
      type: 'strings',
      count: Object.keys(enhancedManifest.strings).length,
      sample: Object.entries(enhancedManifest.strings).slice(0, 10)
    });
  } else if (type === 'numbers' && enhancedManifest.numbers) {
    res.json({
      type: 'numbers',
      count: Object.keys(enhancedManifest.numbers).length,
      sample: Object.entries(enhancedManifest.numbers).slice(0, 10)
    });
  } else {
    res.status(404).json({ error: 'Optimization type not found' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    enhancedManifestLoaded: Object.keys(enhancedManifest.identifiers || {}).length > 0,
    basicManifestLoaded: Object.keys(basicManifest).length > 0,
    timestamp: new Date().toISOString()
  });
});

// Bundle comparison endpoint
app.get('/bundle-comparison', (req, res) => {
  try {
    const buildDir = path.join(__dirname, '../build');
    const jsDir = path.join(buildDir, 'static/js');
    
    const jsFiles = fs.readdirSync(jsDir);
    const mainBundleFile = jsFiles.find(file => file.startsWith('main.') && file.endsWith('.js') && !file.includes('.map'));
    
    if (!mainBundleFile) {
      return res.status(404).json({ error: 'No main bundle found' });
    }
    
    const originalBundle = path.join(jsDir, mainBundleFile);
    const strippedBundle = path.join(jsDir, mainBundleFile.replace('.js', '.stripped.js'));
    const enhancedBundle = path.join(jsDir, mainBundleFile.replace('.js', '.enhanced.js'));
    
    const originalSize = fs.existsSync(originalBundle) ? fs.statSync(originalBundle).size : 0;
    const strippedSize = fs.existsSync(strippedBundle) ? fs.statSync(strippedBundle).size : 0;
    const enhancedSize = fs.existsSync(enhancedBundle) ? fs.statSync(enhancedBundle).size : 0;
    
    res.json({
      bundles: {
        original: { size: originalSize, file: mainBundleFile },
        stripped: { size: strippedSize, file: mainBundleFile.replace('.js', '.stripped.js') },
        enhanced: { size: enhancedSize, file: mainBundleFile.replace('.js', '.enhanced.js') }
      },
      reductions: {
        basic: originalSize > 0 ? ((originalSize - strippedSize) / originalSize * 100) : 0,
        enhanced: originalSize > 0 ? ((originalSize - enhancedSize) / originalSize * 100) : 0,
        additional: strippedSize > 0 ? ((strippedSize - enhancedSize) / strippedSize * 100) : 0
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bundle comparison' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Enhanced Dev Server running at http://localhost:${port}`);
  console.log(`📁 Enhanced manifest status: ${Object.keys(enhancedManifest.identifiers || {}).length > 0 ? 'Loaded' : 'Not found'}`);
  console.log(`📁 Basic manifest status: ${Object.keys(basicManifest).length > 0 ? 'Loaded' : 'Not found'}`);
  console.log(`🔧 Available endpoints:`);
  console.log(`   POST /translate-error - Translate stripped stack traces (enhanced or basic)`);
  console.log(`   POST /reload-manifests - Reload both manifests`);
  console.log(`   GET  /manifest-info - Get comprehensive manifest information`);
  console.log(`   GET  /optimization-info/:type - Get specific optimization type info`);
  console.log(`   GET  /bundle-comparison - Compare bundle sizes`);
  console.log(`   GET  /health - Health check`);
  console.log(`📖 Static files served from: ${path.join(__dirname, '../build')}`);
});
