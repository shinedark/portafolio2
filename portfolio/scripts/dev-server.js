// scripts/dev-server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

let manifest = {};

// Function to load manifest
function loadManifest() {
  try {
    const manifestPath = path.join(__dirname, '../build/bundle-manifest.json');
    if (fs.existsSync(manifestPath)) {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      console.log(`Loaded manifest with ${Object.keys(manifest).length} mappings`);
    } else {
      console.log('No manifest found. Run the stripper first.');
    }
  } catch (error) {
    console.error('Error loading manifest:', error);
  }
}

// Load manifest on startup
loadManifest();

// Endpoint to translate stripped stack traces
app.post('/translate-error', (req, res) => {
  try {
    const { stack } = req.body;
    
    if (!stack) {
      return res.status(400).json({ error: 'Stack trace is required' });
    }
    
    let translatedStack = stack;
    let translations = [];
    
    // Translate minimal identifiers back to original names
    Object.keys(manifest).forEach((minified) => {
      const original = manifest[minified];
      const regex = new RegExp(`\\b${minified}\\b`, 'g');
      if (regex.test(translatedStack)) {
        translatedStack = translatedStack.replace(regex, original);
        translations.push({ minified, original });
      }
    });
    
    res.json({ 
      originalStack: stack,
      translatedStack,
      translations,
      manifestSize: Object.keys(manifest).length
    });
    
  } catch (error) {
    console.error('Error translating stack trace:', error);
    res.status(500).json({ error: 'Failed to translate stack trace' });
  }
});

// Endpoint to reload manifest
app.post('/reload-manifest', (req, res) => {
  loadManifest();
  res.json({ 
    message: 'Manifest reloaded',
    manifestSize: Object.keys(manifest).length 
  });
});

// Endpoint to get manifest info
app.get('/manifest-info', (req, res) => {
  res.json({
    manifestSize: Object.keys(manifest).length,
    sampleMappings: Object.entries(manifest).slice(0, 10),
    hasManifest: Object.keys(manifest).length > 0
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    manifestLoaded: Object.keys(manifest).length > 0,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 Dev server running at http://localhost:${port}`);
  console.log(`📁 Manifest status: ${Object.keys(manifest).length > 0 ? 'Loaded' : 'Not found'}`);
  console.log(`🔧 Available endpoints:`);
  console.log(`   POST /translate-error - Translate stripped stack traces`);
  console.log(`   POST /reload-manifest - Reload the bundle manifest`);
  console.log(`   GET  /manifest-info - Get manifest information`);
  console.log(`   GET  /health - Health check`);
  console.log(`📖 Static files served from: ${path.join(__dirname, '../build')}`);
});
